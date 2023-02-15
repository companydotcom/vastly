export interface Attributes {
  eventId: string;
  triggerEventId: string;
  entityId: string;
  eventType: 'fetch' | 'transition';
  emitter: string;
  operation: 'C' | 'R' | 'U' | 'D';
  entity: string;
  status: string;
}

export interface MiddlewareOnErrorRequest {
  event: [
    {
      message: any;
      attributes: Attributes;
    },
  ];
  response: [
    {
      message: any;
      attributes: Attributes;
    },
  ];
}

export interface MiddlewareAfterRequest {
  event: [
    {
      message: any;
      attributes: Attributes;
    },
  ];
  response: [
    {
      message: any;
      attributes: Attributes;
      workerResp: any;
    },
  ];
}

export interface MiddlewareBeforeRequest {
  event: [
    {
      message: any;
      attributes: Attributes;
    },
  ];
}

export interface MiddlewareOptions {
  isBulk?: boolean;
  eventType: string;
  service: string;
}

export interface WorkerArgs {
  message: any;
  attributes: Attributes;
  serviceConfigData?: [any];
  serviceAccountData?: any;
  serviceUserData?: any;
  internalMicroAppData?: any;
  sharedMicroAppData?: any;
}
