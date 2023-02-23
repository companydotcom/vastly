const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

import { setupDatabase as sDb, httpReqHandler, useMicroApp } from '@companydotcom/micro-application-core';
import fMsgHandler from './workers/fetch-worker';
import tMsgHandler from './workers/transition-worker';
// import webhookWorker from './workers/webhook-worker';
import { microAppMiddleware } from './middleware';

AWS.config.update({ region: process.env.region });

const { region, service, accountId, throttleLmts, safeThrottleLimit, reserveCapForDirect, retryCntForCapacity } =
  process.env;

const sharedMicroAppConfig = {
  region,
  service,
  account: accountId,
  useThrottling: '<%- throttlingOn %>',
  throttleOptions: {
    throttleLmts,
    safeThrottleLimit,
    reserveCapForDirect,
    retryCntForCapacity,
  },
  maxMessagesPerInstance: 20,
};

const determineMiddleware = (allMiddleware, eventType, isBulk) => {
  return allMiddleware.reduce((midToUse, { middleware, settings }) => {
    if (settings.isBulk && !settings.isBulk.includes(isBulk)) {
      return midToUse;
    }
    if (settings.eventType && !settings.eventType.includes(eventType)) {
      return midToUse;
    }
    return midToUse.concat([middleware]);
  }, []);
};

export const fetchHandler = async (event) =>
  useMicroApp(
    AWS,
    { ...sharedMicroAppConfig, isBulk: false, eventType: 'fetch' },
    fMsgHandler,
    determineMiddleware(microAppMiddleware, 'fetch', false),
  )(event);

export const directTransitionHandler = async (event) =>
  useMicroApp(
    AWS,
    { ...sharedMicroAppConfig, isBulk: false, eventType: 'transition' },
    tMsgHandler,
    determineMiddleware(microAppMiddleware, 'transition', false),
  )(event);

export const bulkFetchHandler = async (event) =>
  useMicroApp(
    AWS,
    { ...sharedMicroAppConfig, isBulk: true, eventType: 'fetch' },
    tMsgHandler,
    determineMiddleware(microAppMiddleware, 'fetch', true),
  )(event);

export const bulkTransitionHandler = async (event) =>
  useMicroApp(
    AWS,
    { ...sharedMicroAppConfig, isBulk: true, eventType: 'transition' },
    tMsgHandler,
    determineMiddleware(microAppMiddleware, 'transition', true),
  )(event);

export const webhookHandler = (event) =>
  useMicroApp(
    AWS,
    { ...sharedMicroAppConfig, isBulk: false, eventType: 'webhook' },
    webhook - worker,
    determineMiddleware(microAppMiddleware, 'webhook', false),
  )(event);

// eslint-disable-next-line arrow-body-style
export const setupDatabase = async (event) => {
  return sDb(AWS, event, process.env.service);
};

// eslint-disable-next-line arrow-body-style
export const getHttpHandler = async (event) => {
  return httpReqHandler(
    AWS,
    process.env.region,
    process.env.service,
    process.env.accountId,
    process.env.productId,
    event,
  );
};

// eslint-disable-next-line arrow-body-style
export const postHttpHandler = async (event) => {
  return httpReqHandler(
    AWS,
    process.env.region,
    process.env.service,
    process.env.accountId,
    process.env.productId,
    event,
  );
};
