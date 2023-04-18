import { v4 as uuid } from "uuid";
import es from "../library/eventStream";
import { getErrorString } from "../library/util";

/**
 * This is the handler that is invoked by a http event to process
 * messages that are waiting in the bulk transition queue
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {string} region is the region of AWS that this service is running in
 * @param {string} service is the name of the service
 * @param {string} account is AWS the account number
 * @param {object} event that invokes the serverless function. In this case, it is a cloud watch trigger
 * @param {function} mHndlr is the handler/ worker that works on the message applying business logic
 * @returns {string}
 * @throws {Error}
 */
export const handler = async (
  AWS: any,
  region: string,
  service: string,
  account: string,
  entityId: string,
  event: any,
) => {
  try {
    console.log(
      `getpostHttp: INFO: Input is: ${
        typeof event === "object" ? JSON.stringify(event, null, 4) : event
      }`,
    );

    const eventMsg = typeof event === "object" ? event : JSON.parse(event);
    const eventBody = eventMsg.body;
    const eventPathParams = eventMsg.pathParameters;
    const eventQueryStringParams =
      eventMsg.queryStringParameters !== "undefined" ? eventMsg.queryStringParameters : {};

    await es.publish(
      AWS,
      `arn:aws:sns:${region}:${account}:event-bus`,
      {
        payload: {
          ...eventPathParams,
          ...eventBody,
          ...eventQueryStringParams,
        },
        context: null,
        metadata: {
          eventType: eventPathParams.eventType,
        },
      },
      {
        status: "trigger",
        operation: eventPathParams.operation === "fetch" ? "R" : "C",
        entity: "product",
        entityId,
        eventId: uuid(),
        emitter: service,
        eventType: eventPathParams.operation,
      },
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        status: "getpostHttp: INFO: Request accepted and queued",
        input: event,
      }),
    };
  } catch (e) {
    console.log(`getpostHttp: ERROR: ${getErrorString(e)}`);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        status: `getpostHttp: ERROR: We encountered an error. Please quote TS${Date.now()} as reference id for further assistance`,
        input: event,
      }),
    };
  }
};
