import middy from "@middy/core";
import _get from "lodash/get";
import { MicroAppMessage, HandledMicroAppMessage, Options } from "../library/sharedTypes";
import { getMiddyInternal, prepareMiddlewareDataForWorker } from "../library/util";

/*
 * The purpose of the "Privacy screen" is four fold
 * - to isolate any raw dynamo queries stored in request.internal from being exposed to custom-written middleware in individual services
 * - prevent custom-written middleware from overwriting internal storage, while allowing them to safely add to it
 * - parse between the parameter { message, attributes, ...middleware data } format that service workers understand and the more SNS-like format internal middleware use.
 * - ensure the user and account contexts always have the most up-to-date data, while hiding protected fields.
 */
const createWithPrivacyScreen = (
  options: Options,
): middy.MiddlewareObj<[MicroAppMessage] | any, [HandledMicroAppMessage] | any> => {
  const middlewareName = "withPrivacyScreen";
  let requestInternalStash = {} as any;
  const before: middy.MiddlewareFn<
    [MicroAppMessage] | any,
    [HandledMicroAppMessage] | any
  > = async (request): Promise<void> => {
    if (options.debugMode) {
      console.log("before", middlewareName);
    }

    const data = await getMiddyInternal(request, ["vendorConfig"]);
    requestInternalStash = Object.assign({}, request.internal);

    request.event = await Promise.all(
      request.event.map(async (m: MicroAppMessage) => {
        console.log("Micro Application Message: ", m);
        const userId: string = _get(m, ["msgBody", "context", "user", "userId"], "");
        const accountId: string = _get(m, ["msgBody", "context", "user", "accountId"], "");
        const context = await getMiddyInternal(request, [`user-${userId}`, `account-${accountId}`]);
        if (context[`user-${userId}`]) {
          if (typeof context[`user-${userId}`].vendorData !== "undefined") {
            delete context[`user-${userId}`].vendorData;
          }
          if (typeof context[`user-${userId}`].globalMicroAppData !== "undefined") {
            delete context[`user-${userId}`].globalMicroAppData;
          }
        } else {
          console.log("User", userId, "not found in DB");
        }
        if (context[`account-${accountId}`]) {
          if (typeof context[`account-${accountId}`].vendorData !== "undefined") {
            delete context[`account-${accountId}`].vendorData;
          }
          if (typeof context[`account-${accountId}`].globalMicroAppData !== "undefined") {
            delete context[`account-${accountId}`].globalMicroAppData;
          }
        } else {
          console.log("Account", accountId, "not found in DB");
        }

        return {
          message: {
            payload: m.msgBody.payload,
            metadata: m.msgBody.metadata,
            context: {
              ...m.msgBody.context,
              ...(context[`user-${userId}`] ? { user: context[`user-${userId}`] } : {}),
              ...(context[`account-${accountId}`]
                ? { account: context[`account-${accountId}`] }
                : {}),
            },
          },
          attributes: m.msgAttribs,
          rcptHandle: m.rcptHandle,
          serviceConfigData: data.vendorConfig,
          ...(await prepareMiddlewareDataForWorker(request, m)),
        };
      }),
    );
    console.log("Stashing request.internal & reformating event messages");
    request.internal = {};
  };

  const after: middy.MiddlewareFn<[MicroAppMessage] | any, [HandledMicroAppMessage] | any> = async (
    request,
  ): Promise<void> => {
    if (options.debugMode) {
      console.log("after", middlewareName);
    }
    request.response = request.response.map((m: any) => {
      return {
        msgBody: m.message,
        msgAttribs: m.attributes,
        rcptHandle: m.rcptHandle,
        workerResp: m.workerResp,
        status: m.status,
      };
    });
    console.log("Popping request.internal & reformating event messages");
    request.internal = Object.assign({}, requestInternalStash);
  };

  return {
    before,
    after,
  };
};

export default createWithPrivacyScreen;
