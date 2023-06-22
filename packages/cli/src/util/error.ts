import { isError } from "@vastly/utils";
import { Response } from "node-fetch";

export interface ResponseError extends Error {
  status: number;
  serverMessage: string;
  retryAfter?: number;
  [key: string]: any;
}

export async function responseError(
  res: Response,
  fallbackMessage: string | null = null,
  parsedBody = {},
) {
  let message = "";
  let bodyError;

  if (res.status >= 400 && res.status < 500) {
    let body: any;

    try {
      body = await res.json();
    } catch (err) {
      body = parsedBody;
    }

    bodyError = body.error || {};
    message = bodyError.message;
  }

  if (!message) {
    message = fallbackMessage === null ? "Response Error" : fallbackMessage;
  }

  const err = new Error(`${message} (${res.status})`) as ResponseError;

  err.status = res.status;
  err.serverMessage = message;

  // Copy every field that was added manually to the error
  if (bodyError) {
    for (const field of Object.keys(bodyError)) {
      if (field !== "message") {
        err[field] = bodyError[field];
      }
    }
  }

  return err;
}

/**
 * This error is thrown when there is an API error with a payload. The error
 * body includes the data that came in the payload plus status and a server
 * message.
 */
export class APIError extends Error {
  status: number;
  serverMessage: string;
  [key: string]: any;

  constructor(message: string, response: Response, body?: object) {
    super();
    this.message = `${message} (${response.status})`;
    this.status = response.status;
    this.serverMessage = message;

    if (body) {
      for (const field of Object.keys(body)) {
        if (field !== "message") {
          // @ts-ignore
          this[field] = body[field];
        }
      }
    }
  }
}

export function isAPIError(v: unknown): v is APIError {
  return isError(v) && "status" in v;
}
