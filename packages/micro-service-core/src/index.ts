import middy from "@middy/core";
import { neverThrowError, addToEventContext } from "./library/util";
import withMessageProcessing from "./middleware/withMessageProcessing";
import withServiceData from "./middleware/withServiceData";
import withThrottling from "./middleware/withThrottling";
import withVendorConfig from "./middleware/withVendorConfig";
import withContextPrep from "./middleware/withContextPrep";
import withCrmData from "./middleware/withCrmData";
import withMads from "./middleware/withMads";
import withPrivacyScreen from "./middleware/withPrivacyScreen";
import {
  CoreMicroAppConfig,
  MicroAppMessage,
  AllowableConfigKeys,
  Options,
} from "./library/sharedTypes";

import { handler as gpH } from "./handlers/getPostHttp";
import { handler as sDb } from "./handlers/setupDatabase";

const createTailoredOptions = (
  keys: Array<AllowableConfigKeys>,
  microAppConfig: CoreMicroAppConfig,
  AWS?: any,
): Options => {
  return keys.reduce(
    (opt, key) => ({
      ...opt,
      [key]: microAppConfig[key],
    }),
    AWS ? { AWS } : {},
  );
};

export const useMicroApp = (
  AWS: any,
  microAppConfig: CoreMicroAppConfig,
  worker: (params: any) => any,
  additionalMiddleware: [(opt: Options) => middy.MiddlewareObj],
) => {
  console.log("Preparing MicroApp Handler");
  const handler = middy(async (event: any) => {
    console.log("Delegating processed messages to worker:");
    return Promise.all(
      // opportunity to adjust call signature of the worker to best suit this approach
      event.map((m: MicroAppMessage) =>
        neverThrowError(m, worker).then((result: any) => {
          console.log("Received worker response", JSON.stringify(result.workerResp, null, 2));
          return {
            ...result,
            ...result.params,
          };
        }),
      ),
    );
  });

  let middleware: Array<any>;
  switch (microAppConfig.eventType) {
    case "webhook":
      middleware = [
        withMessageProcessing(
          createTailoredOptions(
            [
              "isBulk",
              "eventType",
              "service",
              "maxMessagesPerInstance",
              "region",
              "account",
              "debugMode",
            ],
            microAppConfig,
            AWS,
          ),
        ),
        ...(microAppConfig.hasServiceConfig
          ? [withVendorConfig(createTailoredOptions(["service", "debugMode"], microAppConfig, AWS))]
          : []),
        withPrivacyScreen(createTailoredOptions(["debugMode"], microAppConfig, AWS)),
        ...additionalMiddleware.map((mid) =>
          mid(
            createTailoredOptions(
              ["service", "eventType", "isBulk", "debugMode"],
              microAppConfig,
              false,
            ),
          ),
        ),
      ];
      break;
    case "fetch":
    case "transition":
      middleware = [
        withMessageProcessing(
          createTailoredOptions(
            [
              "isBulk",
              "eventType",
              "service",
              "maxMessagesPerInstance",
              "region",
              "account",
              "debugMode",
            ],
            microAppConfig,
            AWS,
          ),
        ),
        withContextPrep(createTailoredOptions(["debugMode"], microAppConfig, AWS)),
        ...(microAppConfig.hasServiceConfig
          ? [withVendorConfig(createTailoredOptions(["service", "debugMode"], microAppConfig, AWS))]
          : []),
        ...(microAppConfig.useMads
          ? [
              withServiceData(
                createTailoredOptions(
                  ["service", "region", "account", "debugMode"],
                  microAppConfig,
                  AWS,
                ),
              ),
              withMads(
                createTailoredOptions(
                  ["service", "region", "account", "debugMode"],
                  microAppConfig,
                  AWS,
                ),
              ),
            ]
          : [
              withServiceData(
                createTailoredOptions(
                  ["service", "region", "account", "debugMode"],
                  microAppConfig,
                  AWS,
                ),
              ),
            ]), // eventually swap for Mads as default
        withPrivacyScreen(createTailoredOptions(["debugMode"], microAppConfig, AWS)),
        ...additionalMiddleware.map((mid) =>
          mid(
            createTailoredOptions(
              ["service", "eventType", "isBulk", "debugMode"],
              microAppConfig,
              false,
            ),
          ),
        ),
      ];

      if (microAppConfig.useThrottling) {
        middleware.unshift(
          withThrottling(
            createTailoredOptions(["service", "isBulk", "throttleOptions"], microAppConfig, AWS),
          ),
        );
      }
      break;
    default:
      middleware = [];
  }
  console.log("Applying", middleware.length, "middlewares.");
  return middleware.reduce((middyHandler, midlw) => middyHandler.use(midlw), handler);
};

/**
 * This is the fetch request handler
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {Object} d is the data to be saved
 * @param {string} s service is the name of the service
 */
export const setupDatabase = async (AWS: any, d: any, s: string) => {
  let data = "";
  if (typeof d === "object") {
    data = d;
  } else {
    try {
      data = JSON.parse(d);
    } catch (e) {
      console.log(
        "Unable to parse the database file. Please check if it is a valid JSON document.",
      );
      return;
    }
  }
  // eslint-disable-next-line consistent-return
  return sDb(AWS, data, s);
};

// TODO: I think we should be able to kill this - I'm not sure what currently uses it, it was a Bharath add.  Http requests should go through management-svc, we don't need a separate endpoint on every service just to push the request into SNS
/**
 * This is the get http request handler
 * @param {object} AWS is the AWS sdk instance that needs to be passed from the handler
 * @param {string} r is the region of AWS that this service is running in
 * @param {string} s service is the name of the service
 * @param {string} a account is AWS the account number
 * @param {object} b is the event input
 */
export const httpReqHandler = async (AWS: any, r: string, s: string, a: string, b: any, c: any) =>
  gpH(AWS, r, s, a, b, c);

export const utils = {
  addToEventContext,
} as any;

export const middleware = {
  withCrmData,
} as any;
