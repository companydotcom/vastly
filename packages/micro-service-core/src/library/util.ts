import middy from "@middy/core";
import { MicroAppMessage } from "./sharedTypes";

/**
 * @description Attempt to JSON.parse input value. If parse fails, return original @param {any} v
 * @returns {any}
 */
export const parseJson = (v: any) => {
  try {
    return JSON.parse(v);
  } catch (err) {
    return v;
  }
};

export const deepParseJson = (jsonString: any): any => {
  if (typeof jsonString === "string") {
    if (!isNaN(Number(jsonString))) {
      return jsonString;
    }
    try {
      return deepParseJson(JSON.parse(jsonString));
    } catch (err) {
      return jsonString;
    }
  } else if (Array.isArray(jsonString)) {
    return jsonString.map((val) => deepParseJson(val));
  } else if (typeof jsonString === "object" && jsonString !== null) {
    return Object.keys(jsonString).reduce((obj, key: string) => {
      obj[key] = deepParseJson(jsonString[key]);
      return obj;
    }, {} as any);
  } else {
    return jsonString;
  }
};

/**
 * Returns the string equivalent meaning for given HTTP status code
 * @param {Number} code
 */
const getCodeStatus = (code: number) => {
  switch (code) {
    case 200:
      return "OK";
    case 201:
      return "Created";
    case 400:
      return "Bad Request";
    case 500:
      return "Internal Server Error";
    default:
      return undefined;
  }
};

/**
 * @typedef {Object} LambdaProxyIntegrationResponse
 * @property {number} statusCode
 * @property {string} body
 */

/**
 * @description Format HTTP lambda's input, result, and response code to be comliant with Lambda proxy integration
 * @param {number} code
 * @param {*} input
 * @param {*} result
 * @returns {LambdaProxyIntegrationResponse}
 */
export const formatHttpResponse = (code: number, input: any, result: any) => {
  const status = getCodeStatus(code);
  const resp = `HTTP Resp: ${code}${status ? ` - ${status}` : ""}`;
  let resultObj = {} as any;
  if (result instanceof Error) {
    resultObj.error = result.toString();
  } else if (typeof result === "object") {
    resultObj = result;
  } else {
    resultObj.message = result;
  }
  return {
    statusCode: code,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      resp,
      input,
      resultObj,
    }),
  };
};

/**
 * Returns the string representation of a given object, error or string
 * @param {Object/ String/ Error} e
 * @returns {String}
 */
export const getErrorString = (e: any) => {
  if (e instanceof Error) {
    return e.toString();
  }
  if (typeof e === "object") {
    return JSON.stringify(e, null, 4);
  }
  return e;
};

/**
 * This is a higher order function to execute the given messageHandler, catch
 * errors and return a proper response
 * @param {any} params
 * @param {Function} messageHandler
 * @returns {Object}
 */
export const neverThrowError = async (params: any, messageHandler: (params: any) => any) => {
  const result = {
    status: "pass",
    params,
  } as any;
  try {
    result.workerResp = await messageHandler(params);
  } catch (e) {
    result.workerResp = {
      status: "fail",
      error: getErrorString(e),
    };
    result.status = "fail";
  }
  return result;
};

/**
 * Checks if the given param exists in the given object
 * @param {object} obj is the object to check if the given param exists in
 * @param {string} param is the param to check if it exists in the given obj
 * @returns {Boolean}
 */
// eslint-disable-next-line max-len
export const itemExists = (obj: any, param: string) =>
  typeof obj === "object" && obj !== null
    ? Object.prototype.hasOwnProperty.call(obj, param)
    : false;

/**
 * Classis sleep function using async-await
 * @param {Number} s is the number of milliseconds to sleep
 */
export const sleep = async (s: any) =>
  new Promise((r: any) =>
    setTimeout(() => {
      r();
    }, s),
  );

/**
 * Filters the internalMicroAppData object based on if the service
 * is included in the readAccess array of item or not.
 * @param {Object: raw MADS} internalMicroAppData the object as is from the Account, or User tables
 * @param {String} service the service name (serverless name) of the current processing service
 * @returns a internalMicroAppData object filtered to just the data points that current service has access to
 * @abstract docs: https://bit.ly/3kdY2w9
 */
export const evaluateMadsReadAccess = (internalMicroAppData: any, service: string) => {
  const result = {} as any;

  // * key = mads service name (ex. 'gmb-svc')
  // * value = data store array (ex. [{key: 'a', value: {}, readAccess: ['*']}, ...])
  Object.entries(internalMicroAppData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const eachMadsFiltered = value.filter(
        (dataPoint) => dataPoint.readAccess.includes(service) || dataPoint.readAccess.includes("*"),
      );

      if (eachMadsFiltered.length) {
        result[key] = eachMadsFiltered;
      }
    }
  });
  return result;
};

/**
 * Transforms a raw MADS object to readable object, without array data points, or readAccess arrays.
 * @param {Object: raw MADS} mads the object as is from the Account, User, user-mads or account-mads tables
 * @returns a readable MADS object.
 * @abstract docs: https://bit.ly/3kdY2w9
 */
export const transformMadsToReadFormat = (mads: any = {}) => {
  const result = {} as any;

  // * key = mads service name (ex. 'gmb-svc')
  // * value = data store array (ex. [{key: 'a', value: {}, readAccess: ['*']}, ...])
  Object.entries(mads).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const eachMadsReduced = value.reduce((acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      }, {} as any);

      result[key] = eachMadsReduced;
    }
  });
  return result;
};

/**
 * Finds duplicate MADS keys if any
 * @param {Object: worker response MADS} mads from the process worker response
 * @returns {string || null} Returns first duplicate key in MADS array, or null if no duplicates
 */
export const findDuplicateMadsKeys = (mads: any) => {
  let duplicateKey;

  const keyCount = mads.reduce((acc: any, cur: any) => {
    acc[cur.key] = acc[cur.key] >= 0 ? acc[cur.key] + 1 : 0;
    return acc;
  }, {} as any);

  Object.entries(keyCount).forEach(([key, value]: [any, any]) => {
    if (value > 0) {
      duplicateKey = key;
    }
  });

  return duplicateKey || null;
};

export const addToEventContext = (
  request: middy.Request,
  message: MicroAppMessage,
  middlewareName: string,
  data: any,
) => {
  const messageId = message.msgAttribs.eventId;
  if (!request.internal[messageId]) {
    request.internal[messageId] = {};
  }

  request.internal[messageId][middlewareName] = data;
};

export const prepareMiddlewareDataForWorker = async (
  request: middy.Request,
  message: MicroAppMessage,
) => {
  const messageId = message.msgAttribs.eventId;
  if (!request.internal[messageId]) {
    console.log("no data stored for this message");
    return {};
  }
  const midsInUse = Object.keys(request.internal[messageId]);
  return midsInUse.reduce((acc: any, midName: string): any => {
    const midData = request.internal[messageId][midName];
    const dataKeys = Object.keys(midData);
    dataKeys.forEach((key: string) => {
      if (acc.hasOwnProperty(key)) {
        console.warn(
          `Middleware data key ${key} in middleware ${midName} collides with another middleware's data key.  This is not permitted`,
        );
      } else {
        Object.assign(acc, {
          [key]: request.internal[messageId][midName][key],
        });
      }
    });
    return acc;
  }, {} as any);
};

export const setMiddyInternal = (request: middy.Request, key: string, value: any) => {
  request.internal[key] = value;
};

// Internal Context
export const getMiddyInternal = async (request: middy.Request, variables: Array<string>) => {
  if (!variables || !request) return {};
  let keys = [] as any[];
  let values = [] as any[];
  if (Array.isArray(variables)) {
    keys = values = variables;
  }
  const promises = [];
  for (const internalKey of values) {
    // 'internal.key.sub_value' -> { [key]: internal.key.sub_value }
    const pathOptionKey = internalKey.split(".");
    const rootOptionKey = pathOptionKey.shift();
    let valuePromise = request.internal[rootOptionKey];
    if (typeof valuePromise?.then !== "function") {
      valuePromise = Promise.resolve(valuePromise);
    }
    promises.push(
      valuePromise
        .then((value: any) => pathOptionKey.reduce((p: any, c: any) => p?.[c], value))
        .then((value: any) => ({ value }))
        .catch((err: Error) => ({
          status: "rejected",
          reason: { message: getErrorString(err) },
        })),
    );
  }
  // ensure promise has resolved by the time it's needed
  // If one of the promises throws it will bubble up to @middy/core
  values = await Promise.all(promises);
  const errors = values.filter((res) => res.status === "rejected").map((res) => res.reason.message);
  if (errors.length) throw new Error(JSON.stringify(errors));
  return keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index].value }), {});
};
