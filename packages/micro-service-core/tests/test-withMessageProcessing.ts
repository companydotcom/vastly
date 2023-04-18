import withMessageProcessing from "../src/middleware/withMessageProcessing";
import middy from "@middy/core";
import AWS from "aws-sdk";
import { Options } from "../src/library/sharedTypes";

AWS.config.update({ region: process.env.region });

const middlewareToTest = [withMessageProcessing];

const coreSettings = {
  AWS,
  region: process.env.region,
  service: process.env.service,
  account: process.env.accountId,
  useThrottling: false,
  maxMessagesPerInstance: 20,
  isBulk: false,
  eventType: "fetch",
} as Options;

// return useMicroApp(
//   AWS,
//   { ...sharedMicroAppConfig, isBulk: false, eventType: 'fetch' },
//   fMsgHandler,
//   determineMiddleware(microApplicationMiddleware, 'fetch', false),
// ).then((handler) => {
//   console.log(event);
//   console.log(handler);
//   return handler(event);
// });

const test = async (event: any) => {
  const handler = (data: any) => {
    console.log("INTERIOR DATA", data);
    return data.map((m: any) => ({ ...m, workerResp: { res: "hello world" } }));
  };

  const middifiedHandler = middy(handler);
  middifiedHandler.use(middlewareToTest[0](coreSettings));

  await middifiedHandler(event, {} as any, () => {
    console.log("did this work");
  });
};

const sampleSQSEvent = {
  Records: [
    {
      EventSource: "aws:sns",
      EventVersion: "1.0",
      EventSubscriptionArn:
        "arn:aws:sns:us-east-1:811255529278:event-bus:a7f1d3a5-8109-4972-a4d3-5e69f7caee1a",
      body: {
        Type: "Notification",
        MessageId: "07a72944-bda4-5820-9752-7c9a92ad84af",
        TopicArn: "arn:aws:sns:us-east-1:811255529278:event-bus",
        Subject: null,
        MessageAttributes: {
          emitter: {
            Type: "String",
            Value: "platform-events",
          },
          eventId: {
            Type: "String",
            Value: "aeab0921-0bdc-4e47-8968-c2b8c2b1a8f2",
          },
          triggerEventId: {
            Type: "String",
            Value: "747099bd-48be-42ce-81e1-de80a7212713",
          },
          entity: {
            Type: "String",
            Value: "tile",
          },
          entityId: {
            Type: "String",
            Value: "abc123",
          },
          operation: {
            Type: "String",
            Value: "C",
          },
          status: {
            Type: "String",
            Value: "trigger",
          },
          eventType: {
            Type: "String",
            Value: "fetch",
          },
        },
        Message: {
          payload: {},
          context: {
            user: {},
            account: {},
            product: {},
            tile: {},
          },
          metadata: {
            eventType: "/* EVENT NAME */",
            tileId: "tile123",
          },
        },
      },
    },
  ],
};

console.log("hello please");
console.log(middy);
const sampleBadEvent = {
  hello: "world",
};

const run = async () => {
  try {
    console.log("RUNNING BAD EVENT");
    await test(sampleBadEvent);
  } catch (err) {
    console.log("This should have erred", err);
  }

  try {
    console.log("RUNNING GOOD EVENT");
    await test(sampleSQSEvent);
  } catch (err) {
    console.log("This should not have erred", err);
  }
};

run();
