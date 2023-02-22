import { batchPutIntoDynamoDb } from "../library/dynamo"
import { getErrorString } from "../library/util"

/**
 * Sets up the database with the given data
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {object} data is the data that needs to be saved as vendorConfig data
 * @param {string} service is the name of the service
 * @returns {string}
 * @throws {Error}
 */
export const handler = async (AWS: any, data: any, service: string) => {
  try {
    const record = {
      service,
      configdata: data,
    }
    console.log(`Data being sent ${JSON.stringify([record], null, 4)}`)
    await batchPutIntoDynamoDb(AWS, [record], "vendorConfig")
    console.log("Database has been setup successfully")
    return "Database has been setup successfully"
  } catch (e) {
    console.log(`bulkTransition: ERROR: ${getErrorString(e)}`)
    throw e
  }
}
