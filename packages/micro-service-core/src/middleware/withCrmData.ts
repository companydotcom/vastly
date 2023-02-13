import middy from "@middy/core"
import es from "../library/eventStream"
import { v4 as uuid } from "uuid"
import { itemExists } from "../library/util"
import { MicroAppMessage, HandledMicroAppMessage, Options } from "../library/sharedTypes"

const defaults = {
  region: "us-east-1",
}

const createWithCrm = (
  opt: Options,
): middy.MiddlewareObj<[MicroAppMessage], [HandledMicroAppMessage]> => {
  const middlewareName = "withCrmData"
  const options = { ...defaults, ...opt }

  const after: middy.MiddlewareFn<[MicroAppMessage], [HandledMicroAppMessage]> = async (
    request,
  ): Promise<void> => {
    if (options.debugMode) {
      console.log("after", middlewareName)
    }
    const { AWS, service, region, account } = options
    // set changes to serviceUserData/serviceAccountData
    if (request.response) {
      await Promise.all(
        request.response.map(async (m: HandledMicroAppMessage) => {
          const { msgBody, msgAttribs } = m
          if (itemExists(m.workerResp, "crmData")) {
            if (typeof m.workerResp.crmData !== "object") {
              throw new Error("Data going to a CRM should be an object")
            }
            if (Object.keys(m.workerResp.crmData).length > 0) {
              console.log("CRM data detected")
              try {
                await es.publish(
                  AWS,
                  `arn:aws:sns:${region}:${account}:event-bus`,
                  {
                    ...msgBody,
                    payload: m.workerResp.crmData,
                    metadata: {
                      eventType: "sendFields",
                      dateCreated: Date.now(),
                      operationType: "update",
                      invocationSource: service,
                    },
                  },
                  {
                    ...msgAttribs,
                    status: "trigger",
                    eventType: "crm",
                    eventId: uuid(),
                    emitter: service,
                  },
                )
              } catch (err) {
                console.log("Could not emit SNS", err)
              }
            }
          }
        }),
      )
    }
  }

  return {
    after,
  }
}

export default createWithCrm
