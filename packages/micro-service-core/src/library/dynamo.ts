import { sleep, itemExists } from "./util"

// Safety limit for bulk insertions into DynamoDb
const batchWriteRecordsLimit = 25

// Fallback safety limit for bulk queries from DynamoDb
const dynamoDbQuerySafeBatchLimit = 1000

/**
 * Gets records for given query object.
 * If there is no limit set on the number of records, it uses the built-in safety limit.
 * All records returned are simple Javascript Objects with Key-Value pairs (doing away with
 * DynamoDb style of defining values for properties along with data type - unmarshalling)
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {Object} queryObject
 * @returns {[{String: *}]}
 */
export const fetchRecordsByQuery = async (AWS: any, queryObject: any, paginate = false) => {
  const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })
  // Add safe fetch limit if one is not set
  if (!itemExists(queryObject, "Limit")) {
    // eslint-disable-next-line no-param-reassign
    queryObject.Limit = dynamoDbQuerySafeBatchLimit
  }
  const qResult = await dynamodb.query(queryObject).promise()
  if (paginate === true) {
    if (!itemExists(qResult, "Items") || qResult.Items.length < 1) {
      return { items: [], ExclusiveStartKey: undefined }
    }
    return {
      items: qResult.Items.map((it: any) => AWS.DynamoDB.Converter.unmarshall(it)),
      ExclusiveStartKey: itemExists(qResult, "LastEvaluatedKey")
        ? qResult.LastEvaluatedKey
        : undefined,
    }
  }
  if (!itemExists(qResult, "Items") || qResult.Items.length < 1) {
    return []
  }
  // Convert DynamoDb stlye objects to simple Javascript objects
  return qResult.Items.map((item: any) => AWS.DynamoDB.Converter.unmarshall(item))
}

/**
 * Increment the value in the given column by the given value
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {String} tName is the table name
 * @param {Object} srchParams are the search params for the record
 * @param {String} colName column name to increment
 * @param {Number} incVal value to increment by
 * @returns {Boolean}
 */
// eslint-disable-next-line arrow-body-style
export const incrementColumn = async (
  AWS: any,
  tName: string,
  srchParams: any,
  colName: string,
  incVal = 1,
) => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const obj = {
    TableName: tName,
    Key: srchParams,
    UpdateExpression: `ADD ${colName} :val`,
    ExpressionAttributeValues: {
      ":val": incVal,
    },
  }
  return docClient.update(obj).promise()
}

/**
 * Inserts/ Upserts data into DynamoDb with given records to the given table
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {Array} records
 * @param {String} tName
 * @returns {Boolean}
 */
export const batchPutIntoDynamoDb = async (
  AWS: any,
  recs: any,
  tName: string,
  backoff = 1000,
): Promise<void> => {
  const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })
  // Convert all records to DynamoDb object structure and append the top level
  // object structure for each record insertion
  const preparedRecords = recs.map((record: any) => ({
    PutRequest: { Item: AWS.DynamoDB.Converter.marshall(record) },
  }))

  const bulkRequests = []

  // Split the records into batches of the safe batch request length, insert
  // the top level object for insertion and send the split batches for batch
  // write into database all at the same time using Promise.all
  while (preparedRecords.length > 0) {
    bulkRequests.push(
      dynamodb
        .batchWriteItem({
          RequestItems: {
            [tName]: preparedRecords.splice(0, batchWriteRecordsLimit),
          },
        })
        .promise(),
    )
  }

  console.log(
    `DYNAMODB SERVICE: batchPutIntoDynamoDb: totalBulkRequestsSent: ${
      bulkRequests.length
    } with each request having ${batchWriteRecordsLimit} records except the last one having ${
      recs.length - batchWriteRecordsLimit * (bulkRequests.length - 1)
    } records`,
  )

  const result = await Promise.all(bulkRequests)
  const unprocessedRecords = result
    .map((resultDatum) => {
      if (
        itemExists(resultDatum, "UnprocessedItems") &&
        itemExists(resultDatum.UnprocessedItems, tName) &&
        resultDatum.UnprocessedItems[tName].length > 0
      ) {
        // eslint-disable-next-line max-len
        return resultDatum.UnprocessedItems[tName].map((unprocessedRec: any) =>
          AWS.DynamoDB.Converter.unmarshall(unprocessedRec.PutRequest.Item),
        )
      }
      return []
    })
    .reduce((output, currentArray) => output.concat(currentArray))
  if (unprocessedRecords.length > 0) {
    await sleep(backoff)
    return batchPutIntoDynamoDb(AWS, unprocessedRecords, tName, backoff + 1000)
  }
}
