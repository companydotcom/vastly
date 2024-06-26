import { isObject } from "./assertion";

/**
 * A type guard for `try...catch` errors.
 *
 * This function is based on:
 * https://github.com/stdlib-js/assert-is-error
 */
export const isError = (error: unknown): error is Error => {
  if (!isObject(error)) return false;

  // Check for `Error` objects instantiated within the current global context.
  if (error instanceof Error) return true;

  // Walk the prototype tree until we find a matching object.
  while (error) {
    if (Object.prototype.toString.call(error) === "[object Error]") return true;
    error = Object.getPrototypeOf(error);
  }

  return false;
};

export const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  return isError(error) && "code" in error;
};

interface ErrorLike {
  message: string;
  name?: string;
  stack?: string;
}

/**
 * A type guard for error-like objects.
 */
export const isErrorLike = (error: unknown): error is ErrorLike =>
  isObject(error) && "message" in error;

/**
 * Parses errors to string, useful for getting the error message in a
 * `try...catch` statement.
 */
export const errorToString = (error: unknown, fallback?: string): string => {
  if (isError(error) || isErrorLike(error)) return error.message;

  if (typeof error === "string") return error;

  return fallback ?? "An unknown error has ocurred.";
};
