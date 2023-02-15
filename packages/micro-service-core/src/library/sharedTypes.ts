import { SQSEvent, ScheduledEvent } from "aws-lambda"

export type Context = {
  user: any
  account: any
  product?: any
  tile?: any
}

interface TransitionMetadata extends StandardMetadata {
  eventType: string
  tileId: string
  stateCurrent: string
  statePrevious: string
}

interface StandardMetadata {
  eventType: string
  tileId: string
}

type MessageBody = {
  payload?: any
  context: Context
  metadata: TransitionMetadata | StandardMetadata
}

type MessageAttributes = {
  emitter: string
  eventId: string
  triggerEventId: string
  entity: string
  entityId: string
  operation: "C"
  status: string
  eventType: string
}

type WorkerResp = {
  status: string
  res: any
  error: Error | null
  [key: string]: any
}

export interface MicroAppMessage {
  msgBody: MessageBody
  msgAttribs: MessageAttributes
  rcptHandle?: any
}

export interface HandledMicroAppMessage extends MicroAppMessage {
  workerResp: WorkerResp
}

export type RawEvent = SQSEvent | ScheduledEvent

// type ThrottleLimits = {
//   second?: number;
//   minute?: number;
//   hour?: number;
//   day?: number;
// };

export type ThrottleSettings = {
  throttleLmts: string
  safeThrottleLimit: number
  reserveCapForDirect: number
  retryCntForCapacity: number
}

export type Options = {
  isBulk?: boolean
  eventType?: "transition" | "fetch"
  service?: string
  region?: string
  account?: string
  AWS?: any
  maxMessagesPerInstance?: number
  throttleOptions?: ThrottleSettings
  debugMode?: boolean
}

export interface CoreMicroAppConfig {
  eventType: "fetch" | "transition" | "webhook"
  isBulk: boolean
  region: string
  service: string
  account: string
  useThrottling?: string
  throttleOptions?: ThrottleSettings
  maxMessagesPerInstance?: number
  debugMode?: boolean
  useMads?: boolean
  hasServiceConfig?: boolean
}

export type AllowableConfigKeys =
  | "eventType"
  | "isBulk"
  | "region"
  | "service"
  | "account"
  | "useThrottling"
  | "throttleOptions"
  | "maxMessagesPerInstance"
  | "debugMode"
  | "useMads"

export type MicroAppWorkerInterface = {
  message: MessageBody
  attributes: MessageAttributes
  rcptHandle?: any
  serviceConfigData?: any
  workerResp: WorkerResp
  [key: string]: any
}
