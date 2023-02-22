import middy from "@middy/core"
import _get from "lodash/get"
import { HandledMicroAppMessage, Options, MicroAppMessage } from "../library/sharedTypes"
import { itemExists, addToEventContext, getMiddyInternal } from "../library/util"
import { fetchRecordsByQuery, batchPutIntoDynamoDb } from "../library/dynamo"

/**
 * Get the current account data from the database for the given accountId
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {string} accountId is the accountId for which the data needs to be fetched
 */
const getCurrentAccountData = async (AWS: any, accountId: string) => {
  const fetchResponse = await fetchRecordsByQuery(AWS, {
    TableName: "Account",
    ExpressionAttributeNames: { "#pk": "accountId" },
    KeyConditionExpression: "#pk = :accId",
    ExpressionAttributeValues: {
      ":accId": { S: accountId },
    },
  })
  return fetchResponse[0]
}

/**
 * Get the current user data from the database for the given accountId
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {string} userId is the userId for which the data needs to be fetched
 */
const getCurrentUserData = async (AWS: any, userId: string) => {
  const fetchResponse = await fetchRecordsByQuery(AWS, {
    TableName: "User",
    ExpressionAttributeNames: { "#pk": "userId" },
    KeyConditionExpression: "#pk = :uId",
    ExpressionAttributeValues: {
      ":uId": { S: userId },
    },
  })
  return fetchResponse[0]
}

const getAccountServiceData = async (accData: any, service?: string) => {
  let serviceAccountData = {}

  if (itemExists(accData, "vendorData") && itemExists(accData.vendorData, `${service}`)) {
    serviceAccountData = accData.vendorData[`${service}`]
  }
  return serviceAccountData
}

const getUserServiceData = async (userData: any, service?: string) => {
  let serviceUserData = {}

  if (itemExists(userData, "vendorData") && itemExists(userData.vendorData, `${service}`)) {
    serviceUserData = userData.vendorData[`${service}`]
  }
  return serviceUserData
}

const defaults = {
  service: "",
}

const withServiceData = (
  opts: Options,
): middy.MiddlewareObj<[MicroAppMessage], [HandledMicroAppMessage]> => {
  const middlewareName = "withServiceData"
  const options = { ...defaults, ...opts } as Options
  const serviceDataBefore: middy.MiddlewareFn<MicroAppMessage[], HandledMicroAppMessage[]> = async (
    request,
  ): Promise<void> => {
    if (options.debugMode) {
      console.log("before", middlewareName)
    }
    await Promise.all(
      request.event.map(async (m: MicroAppMessage) => {
        const userId: string = _get(m, ["msgBody", "context", "user", "userId"], "")
        const accountId: string = _get(m, ["msgBody", "context", "user", "accountId"], "")

        const context = await getMiddyInternal(request, [`user-${userId}`, `account-${accountId}`])

        const userSD = await getUserServiceData(context[`user-${userId}`], options.service)
        const accountSD = await getAccountServiceData(
          context[`account-${accountId}`],
          options.service,
        )
        console.log("User & Account Service Data Retrieved")
        addToEventContext(request, m, middlewareName, {
          serviceUserData: userSD,
          serviceAccountData: accountSD,
        })
      }),
    )
    // fetch serviceAccountData
  }

  const serviceDataAfter: middy.MiddlewareFn<MicroAppMessage[], HandledMicroAppMessage[]> = async (
    request,
  ): Promise<void> => {
    if (options.debugMode) {
      console.log("after", middlewareName)
    }
    const { AWS, service } = options
    // set changes to serviceUserData/serviceAccountData
    if (request.response) {
      await Promise.all(
        request.response.map(async (m: HandledMicroAppMessage) => {
          const promises = [] as any[]
          const userId: string = _get(m, ["msgBody", "context", "user", "userId"], "")
          const accountId: string = _get(m, ["msgBody", "context", "user", "accountId"], "")

          const { workerResp } = m
          if (itemExists(workerResp, "serviceAccountData")) {
            console.log("Writing serviceAccountData")

            if (typeof workerResp.serviceAccountData !== "object") {
              throw new Error("Service specific user account data should be an object")
            }
            if (accountId) {
              const currAccData = await getCurrentAccountData(AWS, accountId)
              if (!itemExists(currAccData, "vendorData")) {
                currAccData.vendorData = {}
              }
              if (!itemExists(currAccData.vendorData, `${service}`)) {
                currAccData.vendorData[`${service}`] = {}
              }
              currAccData.vendorData[`${service}`] = {
                ...currAccData.vendorData[`${service}`],
                ...workerResp.serviceAccountData,
              }
              promises.push(batchPutIntoDynamoDb(AWS, [currAccData], "Account"))
            }
          }

          if (itemExists(workerResp, "serviceUserData")) {
            console.log("Writing serviceUserData")
            if (typeof workerResp.serviceUserData !== "object") {
              throw new Error("Service specific user data should be an object")
            }
            if (userId) {
              const currUserData = await getCurrentUserData(AWS, userId)
              if (!itemExists(currUserData, "vendorData")) {
                currUserData.vendorData = {}
              }
              if (!itemExists(currUserData.vendorData, `${service}`)) {
                currUserData.vendorData[`${service}`] = {}
              }
              currUserData.vendorData[`${service}`] = {
                ...currUserData.vendorData[`${service}`],
                ...workerResp.serviceUserData,
              }

              promises.push(batchPutIntoDynamoDb(AWS, [currUserData], "User"))
            }
          }
          await promises
        }),
      )
    }
  }

  return {
    before: serviceDataBefore,
    after: serviceDataAfter,
  }
}

export default withServiceData
