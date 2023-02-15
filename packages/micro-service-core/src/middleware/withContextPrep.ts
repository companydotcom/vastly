import middy from "@middy/core"

import { HandledMicroAppMessage, MicroAppMessage, Options } from "../library/sharedTypes"
import { fetchRecordsByQuery } from "../library/dynamo"

const defaults = {
  region: "us-east-1",
}

/**
 * Get the current account data from the database for the given accountId
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {string} accountId is the accountId for which the data needs to be fetched
 */
const getCurrentAccountData = async (AWS: any, accountId: string) => {
  if (accountId === "" || typeof accountId === "undefined") {
    return undefined
  }
  const fetchResponse = await fetchRecordsByQuery(AWS, {
    TableName: "Account",
    ExpressionAttributeNames: { "#pk": "accountId" },
    KeyConditionExpression: "#pk = :accId",
    ExpressionAttributeValues: {
      ":accId": { S: accountId },
    },
  })

  if (fetchResponse.length === 0) {
    return undefined
  }

  if (
    typeof fetchResponse[0] !== "undefined" &&
    typeof fetchResponse[0].globalMicroAppData !== "undefined"
  ) {
    delete fetchResponse[0].globalMicroAppData
  }
  return fetchResponse[0]
}

/**
 * Get the current user data from the database for the given accountId
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {string} userId is the userId for which the data needs to be fetched
 */
const getCurrentUserData = async (AWS: any, userId: string) => {
  if (userId === "" || typeof userId === "undefined") {
    return undefined
  }
  const fetchResponse = await fetchRecordsByQuery(AWS, {
    TableName: "User",
    ExpressionAttributeNames: { "#pk": "userId" },
    KeyConditionExpression: "#pk = :uId",
    ExpressionAttributeValues: {
      ":uId": { S: userId },
    },
  })

  if (fetchResponse.length === 0) {
    return undefined
  }

  if (
    typeof fetchResponse[0] !== "undefined" &&
    typeof fetchResponse[0].globalMicroAppData !== "undefined"
  ) {
    delete fetchResponse[0].globalMicroAppData
  }
  return fetchResponse[0]
}

const createWithContextPrep = (
  opt: Options,
): middy.MiddlewareObj<[MicroAppMessage], [HandledMicroAppMessage]> => {
  const middlewareName = "withContextPrep"
  const options = { ...defaults, ...opt }
  const before: middy.MiddlewareFn<[MicroAppMessage], [HandledMicroAppMessage]> = async (
    request,
  ): Promise<void> => {
    if (options.debugMode) {
      console.log("before", middlewareName)
    }
    request.event.map(async (m) => {
      const userId = m.msgBody.context.user.userId
      if (!userId) {
        throw new Error(
          'Messages using "withContextPrep" must include a userId on the context.user object',
        )
      }
      const userData = await getCurrentUserData(options.AWS, userId)
      let accountId = undefined
      if (typeof userData !== "undefined") {
        request.internal[`user-${userId}`] = userData
        accountId = request.internal[`user-${userId}`].accountId
        const accountData = await getCurrentAccountData(options.AWS, accountId)
        if (typeof accountData !== "undefined") {
          request.internal[`account-${accountId}`] = accountData
        }
      }
      console.log(`Fetching latest User: ${userId} and Account: ${accountId} for this message`)
    })
  }

  return {
    before,
  }
}

export default createWithContextPrep
