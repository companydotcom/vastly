import middy from "@middy/core";
import { MicroAppMessage, HandledMicroAppMessage, Options } from "../library/sharedTypes";

import { fetchRecordsByQuery } from "../library/dynamo";

const createWithVendorConfig = (
  options: Options,
): middy.MiddlewareObj<[MicroAppMessage], [HandledMicroAppMessage]> => {
  const middlewareName = "withVendorConfig";
  const before: middy.MiddlewareFn<[MicroAppMessage], [HandledMicroAppMessage]> = async (
    request,
  ): Promise<void> => {
    if (options.debugMode) {
      console.log("before", middlewareName);
    }
    console.log("Service name:", options.service);
    // Use ids to pull context
    request.internal.vendorConfig = fetchRecordsByQuery(options.AWS, {
      TableName: "vendorConfig",
      ExpressionAttributeNames: { "#pk": "service" },
      KeyConditionExpression: "#pk = :serv",
      ExpressionAttributeValues: {
        ":serv": { S: `${options.service}` },
      },
    })
      .then((items: any[]) => items[0].configdata)
      .catch(() => {
        throw new Error(
          "Error fetching vendor config data. Is something wrong with service config in database?",
        );
      });
  };

  return {
    before,
  };
};

export default createWithVendorConfig;
