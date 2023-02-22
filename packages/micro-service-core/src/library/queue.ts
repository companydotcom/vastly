import { deepParseJson } from "./util"

const safeMsgFetchLimitPerInstance = 500
/**
 * Convert the given SNS type attributes to simple JSON key-value pair of
 * attributes
 * @param {Object} attribs are the message attributes
 * @returns {[{String: *}]}
 */
// eslint-disable-next-line arrow-body-style
const unmarshallMsgAttribs = (attribs: any) => {
  return Object.keys(attribs).reduce((res, key) => {
    const { Type: type, Value: value } = attribs[key]

    if (type !== "String" && type !== "Number") {
      return { ...res, [key]: JSON.parse(value) }
    }
    return { ...res, [key]: value }
  }, {})
}

/**
 * Parse the given SQS message that contains a SNS message to its body,
 * attributes and SQS message receipt handle
 * @param {Object} message
 * @returns { msgBody: Object, msgAttribs: Object, rcptHandle: String}
 */
export const parseMsg = (message: any) => {
  let msgB = message.Body ? message.Body : message.body
  let msgAttribs = {}
  try {
    msgB = message.Body ? deepParseJson(message.Body) : deepParseJson(message.body)
  } catch (e1) {
    console.log("Error: withSqsConsumer - parseMsg: Did not get a JSON parsable message in body")
    throw e1
  }
  if (typeof msgB.MessageAttributes !== "undefined") {
    msgAttribs = unmarshallMsgAttribs(msgB.MessageAttributes)
  }
  return {
    msgBody: msgB.Message,
    msgAttribs,
    rcptHandle: message.ReceiptHandle,
  }
}

/**
 * Send the given message to the given SQS queue
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {string} region is the region of AWS that this service is running in
 * @param {String} qUrl is the url of the queue to send the message to
 * @param {String} msg is the message that needs to be sent
 * @returns {*}
 */
export const sendMsg = async (AWS: any, region: string, qUrl: string, msg: any) => {
  const sqs = new AWS.SQS({ region })
  return sqs
    .sendMessage({
      QueueUrl: qUrl,
      MessageBody: msg,
    })
    .promise()
}

/**
 * Gets messages from the given queue
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {string} region is the region of AWS that this service is running in
 * @param {Number} msgCountToFetch is the quantity of messages to fetch from the queue. Returned message quantity can be less than this if the messages in the queue are exhausted
 * @param {String} QueueUrl is the url of the queue from which to fetch the messages
 * @returns {[SQSMessage]}
 */
export const getMsgsFromQueue = async (
  AWS: any,
  region: string,
  msgCountToFetch: number,
  QueueUrl: string,
) => {
  console.log(`Fetching messages from SQS URL: ${QueueUrl}`)
  const sqs = new AWS.SQS({ region })
  let messages: any[] = []
  const proms = []
  let msgsToFetch =
    msgCountToFetch < safeMsgFetchLimitPerInstance ? msgCountToFetch : safeMsgFetchLimitPerInstance
  while (msgsToFetch > 0) {
    const msgsToFetchThisIter = msgsToFetch < 10 ? msgsToFetch : 10
    msgsToFetch -= msgsToFetchThisIter
    proms.push(
      sqs
        .receiveMessage({
          QueueUrl,
          MaxNumberOfMessages: msgsToFetchThisIter,
          VisibilityTimeout: 900,
        })
        .promise(),
    )
  }
  const resps = await Promise.all(proms)
  resps.forEach((resp) => {
    if (typeof resp.Messages !== "undefined" && resp.Messages.length > 0) {
      messages = [...messages, ...resp.Messages]
    }
  })
  return messages
}

/**
 * Delete message from the given queue url using the given receipt handle
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {string} region is the region of AWS that this service is running in
 * @param {String} QueueUrl is the url of the queue from which to delete the message
 * @param {String} ReceiptHandle is the receipt handle of the message to be deleted
 * @returns {*}
 */
export const deleteMsg = async (
  AWS: any,
  region: string,
  QueueUrl: string,
  ReceiptHandle: string,
) => {
  const sqs = new AWS.SQS({ region })
  sqs
    .deleteMessage({
      QueueUrl,
      ReceiptHandle,
    })
    .promise()
}
