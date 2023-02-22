import middy from "@middy/core"
import { HandledMicroAppMessage, RawEvent, Options, ThrottleSettings } from "../library/sharedTypes"

import {
  getAvailableCallsThisSec as getAvailableCapacity,
  incrementUsedCount,
} from "../library/throttle"

const defaults = {
  isBulk: false,
  throttleOptions: {
    throttleLmts: {},
    safeThrottleLimit: 0.1,
    reserveCapForDirect: 0.9,
    retryCntForCapacity: 3,
  },
}

type SettledOptions = {
  isBulk: boolean
  eventType: "transition" | "fetch"
  service: string
  region: string
  account: string
  AWS?: any
  maxMessagesPerInstance: number
  throttleOptions: ThrottleSettings
  debugMode: boolean
}

const createWithThrottling = (
  opt: Options,
): middy.MiddlewareObj<RawEvent, [HandledMicroAppMessage]> => {
  const middlewareName = "withThottling"
  const options = { ...defaults, ...opt } as SettledOptions
  let availCap = 0 as number
  // REQUEST HAS "event" "context" "response" and "error" keys
  const throttleBefore: middy.MiddlewareFn<RawEvent, [HandledMicroAppMessage]> = async (
    request,
  ): Promise<void> => {
    if (options.debugMode) {
      console.log("before", middlewareName)
    }
    // fetch callCount records from dynamo
    // compare to options ThrottleLmts
    // set availCap to `internal`
    // if no capacity "return" early

    // need to figure out increment
    availCap = await getAvailableCapacity(
      options.AWS,
      options.throttleOptions,
      options.service,
      options.isBulk,
    )

    if (availCap < 1) {
      console.log("No Capacity available for requests")
      return
    }
    console.log("AvailCap:", availCap)
    request.internal.availCap = options.isBulk ? availCap : 1
    await incrementUsedCount(options.AWS, options.service, options.isBulk ? availCap : 1)
  }

  // eventually need to consider how to handled workers that are calling multiple apis which have different api call limits.  ways which we can wrap individual api calls and track in that manner based on doing an estimation based on an entire lambda execution.

  const throttleAfter: middy.MiddlewareFn<RawEvent, [HandledMicroAppMessage]> = async (
    request,
  ): Promise<void> => {
    if (options.debugMode) {
      console.log("after", middlewareName)
    }
    // if request contains key to adjust used capacity
    // - adjust call count
    if (availCap) {
      let processedCount = 0
      if (request.response && request.response.length) {
        processedCount = request.response.length
      }
      // TODO: consider implications of this "post operation adjustment" on esp. per Second throttling - however since bulk operations only run every 5 minutes it should be acceptable to not do a "pre-operation" update - meaning that this number doesn't need to be negative.  (of course the "perSecond" has never been truly accurate).  This being given that the "reservedCapForDirect" is high enough as well as the "max usage" value (whatever its called)
      console.log(
        "Throttling: Post Worker Execution, reducing API consumption estimation by",
        processedCount - availCap,
      )
      await incrementUsedCount(options.AWS, options.service, processedCount - availCap)
    }
  }

  const onError: middy.MiddlewareFn<RawEvent, [HandledMicroAppMessage]> = async (
    request,
  ): Promise<void> => {
    // TODO: adjust availCap.  check to see if request.response exists, if not, no throughput was used
    let usedThroughput = 0
    if (request.response) {
      usedThroughput = request.response.length || 0
    }
    if (availCap) {
      console.log(
        "Throttling: Error Detected, reducing API consumption estimation by",
        usedThroughput - availCap,
      )
      await incrementUsedCount(options.AWS, options.service, usedThroughput - availCap)
    }
  }

  return {
    before: throttleBefore,
    after: throttleAfter,
    onError,
  }
}

export default createWithThrottling
