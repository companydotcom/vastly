import { parseJson } from "./util"

/**
 * @typedef MessageAttribute
 * @property {string} DataType
 * @property {string} StringValue
 */

/**
 * @typedef CompanyEventAttributes
 * @property {MessageAttribute<string>} emitter
 * @property {MessageAttribute<string>} eventId
 * @property {MessageAttribute<string>} triggerEventId
 * @property {MessageAttribute<string>} entity
 * @property {MessageAttribute<string>} entityId
 * @property {MessageAttribute<'C' | 'R' | 'U' | 'D'>} operation
 * @property {MessageAttribute<'trigger' | 'pass' | 'fail'>} status
 */

/**
 * Determine if the given value is a string
 * @param {*} val
 * @returns {Boolean}
 */
const isString = (val: any) => typeof val === "string"

/**
 * Determine if the given value is a number
 * @param {*} val
 * @returns {Boolean}
 */
const isNumber = (val: any) => typeof val === "number"

/**
 * Determine if the given value is an array
 * @param {*} val
 * @returns {Boolean}
 */
const isArray = (val: any) => Array.isArray(val)

/**
 * Get the type of the given value
 * @param {*} val
 * @returns {Boolean}
 * @throws {Error}
 */
const getAttrType = (val: any) => {
  if (isString(val)) return "String"
  if (isNumber(val)) return "Number"
  if (isArray(val)) return "String.Array"
  throw new Error(
    `Invalid MessageAttribute type: ${typeof val} for value ${val}. Valid types: String, Number, Array.`,
  )
}

/**
 * Parse the given JSON object of attributes to SNS message attributes
 * @param {Object} attributes JSON object
 * @returns {[{String: {DataType: String, StringValue: String}}]}
 */
const parseAttributes = (attributes: any) =>
  Object.keys(attributes).reduce((res, key) => {
    const val = attributes[key]
    if (typeof val === "undefined") {
      return res
    }
    const type = getAttrType(val)
    return {
      ...res,
      [key]: {
        DataType: type,
        StringValue: type === "String.Array" ? JSON.stringify(val) : val.toString(),
      },
    }
  }, {})

/**
 * * Determine if the given value (type) is a string
 * @param {any} type
 * @returns {boolean}
 */
const isSnsString = (type: any) => type === "String"

/**
 * Parses object if it is not a string
 * @param {any} val
 * @param {any} type
 */
const parseSnsType = (val: any, type: string) => (isSnsString(type) ? val : JSON.parse(val))

export default {
  /**
   * @description Publish message to SNS event stream.
   * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
   * @param {string} topicArn
   * @param {{ [key: string]: any }} message
   * @param {CompanyEventAttributes} attributes
   * @returns {*}
   */
  publish: async (AWS: any, topicArn: string, message: any, attributes = {}, options = {}) => {
    const sns = new AWS.SNS({ apiVersion: "2010-03-31" })
    let res
    try {
      const params = {
        Message: JSON.stringify(message),
        TopicArn: topicArn,
        MessageAttributes: parseAttributes(attributes),
        ...options,
      }
      res = await sns.publish(params).promise()
      console.log("SNS Publish - Success: ", JSON.stringify(params))
      return res
    } catch (err) {
      console.log("SNS Publish - Failure: ", (err as Error).toString())
      return err
    }
  },

  /**
   * @description Parses a CompanyEvent, returning an object that retains only the original event's "Message" and "MessageAttributes" values.
   * @template M
   * @param {{ Records: [{ Sns: { Message: M, MessageAttributes: { [key: string]: MessageAttribute } } }] }} event
   * @returns {{ message: M, attributes: { [key: string]: string | number | array } }}
   */
  parse: (event: any) => {
    const message = parseJson(event.Records[0].Sns.Message)
    const attributes = Object.keys(event.Records[0].Sns.MessageAttributes).reduce((res, key) => {
      const { Type: type, Value: value } = event.Records[0].Sns.MessageAttributes[key]

      const val = parseSnsType(value, type)
      return { ...res, [key]: val }
    }, {})
    return { message, attributes }
  },
}
