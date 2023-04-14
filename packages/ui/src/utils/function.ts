import { __DEV__, __TEST__ } from "@companydotcom/utils";
import { AnyFunction } from "./types";

export function once<T extends AnyFunction>(fn?: T | null) {
  let result: any;

  return function func(this: any, ...args: Parameters<T>) {
    if (fn) {
      result = fn.apply(this, args);
      fn = null;
    }

    return result;
  };
}

type MessageOptions = {
  condition: boolean;
  message: string;
};

export const warn = once((options: MessageOptions) => () => {
  const { condition, message } = options;
  if (condition && __DEV__) {
    console.warn(message);
  }
});

export const error = once((options: MessageOptions) => () => {
  const { condition, message } = options;
  if (condition && __DEV__) {
    console.error(message);
  }
});
