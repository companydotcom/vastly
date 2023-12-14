import xdgAppPaths from "xdg-app-paths";
import type { XDGAppPaths } from "xdg-app-paths";
import { join } from "path";
import { loadJsonFileSync } from "load-json-file";
import { Config } from '@vastly/types';

export const cx = (...classNames: any[]) => classNames.filter(Boolean).join(" ");

export function isDev() {
  return process.env.NODE_ENV !== "production";
}

type MessageOptions = {
  condition: boolean;
  message: string;
};

export const warn = (options: MessageOptions) => {
  const { condition, message } = options;
  if (condition && isDev()) {
    console.warn(message);
  }
};

export function runIfFn<T, U>(valueOrFn: T | ((...fnArgs: U[]) => T), ...args: U[]): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}

const isFunction = <T extends Function = Function>(value: any): value is T =>
  typeof value === "function";

type Booleanish = boolean | "true" | "false";
export const dataAttr = (condition: boolean | undefined) =>
  (condition ? "" : undefined) as Booleanish;

export const ariaAttr = (condition: boolean | undefined) => (condition ? true : undefined);

type Args<T extends Function> = T extends (...args: infer R) => any ? R : never;

type AnyFunction<T = any> = (...args: T[]) => any;

export function callAllHandlers<T extends (event: any) => void>(...fns: (T | undefined)[]) {
  return function func(event: Args<T>[0]) {
    fns.some((fn) => {
      fn?.(event);
      return event?.defaultPrevented;
    });
  };
}

export function callAll<T extends AnyFunction>(...fns: (T | undefined)[]) {
  return function mergedFn(arg: Args<T>[0]) {
    fns.forEach((fn) => {
      fn?.(arg);
    });
  };
};

export const getGlobalPathConfig = (): string => {
  const configDirs = (xdgAppPaths)({
    name: "vastly",
  }).dataDirs();

  return configDirs[0];
};

export const readConfigFile = () => {
  const VASTLY_DIR = getGlobalPathConfig();
  const CONFIG_FILE_PATH = join(VASTLY_DIR, "config.json");
  const config = loadJsonFileSync(CONFIG_FILE_PATH);
  return config as Config;
};