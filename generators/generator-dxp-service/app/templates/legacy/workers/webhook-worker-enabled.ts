// import { eventStream as es, utils } from 'company-core';

import { WorkerArgs } from '../types';

// const { publishTransition } = es;
// const { setUserVendorIdMap, getUser, getUserIdByVendorId } = utils;

export default async ({ message, attributes, serviceConfigData }: WorkerArgs) => {
  /*
    Expect your webhook worker to receive a semi-standardized message
    {
      "payload": {
        "webhookConfig": Object, // the webhook configuration record from dynamo.
        [http top level key]: {},
          - e.g. "headers", "body": {}
          - will match the keys included in the "webhookMapping" array off of "webhookConfig".
          - These keys are only included for SNS's that are triggered as a result of a webhook being received NOT webhook health events.  Webhook Health events with only receive the "webhookConfig"
      }
    }
  */
  /* Your webhook worker does not respect any throttle settings configured for your other workers.  If you need to contact your vendor's api - it is better to use the webhook worker to issue a fetch or transition event to do that request than perform it directly in this worker.
   */

  // It is the responsibility of the webhook worker to determine the platform user that a given webhook trigger is relevant to and issue the appropriate platform events.
  // webhook health events are not specific to a particular user

  console.log('webhook-worker: INFO: Received a call to work.');
  console.log(`message => ${JSON.stringify(message, null, 2)})`);
  console.log(`attributes => ${JSON.stringify(attributes, null, 2)},`);
  console.log(`serviceConfigData => ${JSON.stringify(serviceConfigData, null, 4)}`);

  // Write all logic to perform the required work. Create other files for other
  // helpers as necessary, import and use them while keeping this file clean.
  // Do not worry about catching errors unless necessary for the business logic.

  // Check if the type of fetch event is defined. Else, throw an error
  if (typeof message.metadata === 'undefined' || typeof message.metadata.eventType === 'undefined') {
    throw new Error('Message did not have the required parameter metadata or parameter eventType within metadata');
  }

  // Check what type of webhook event has been requested and perform business based on the same. See notion documentation for advice on some common scenarios.

  switch (message.metadata.eventType) {
    // case names should match the "eventType"s set in the webhookConfig for healthCheckParameters and invocationParameters
    case 'trigger':
      // consume http data (message.payload)
      // determine platform identity - use getUserByVendorId helper if you create a record for this during product activation
      // issue platform changes e.g. transition event - use helpers from company-core to accomplish this
      // because the webhook worker executes without a user context, serviceUserData, serviceAccountData nor crmData should be returned from it.  Such updates should be re-delegated via SNS to a fetch or transition event
      return {
        res: 'pass',
      };
    case 'checkHealth':
      // check webhook subscription status
      // if webhook is not connected, attempt to re-subscribe
      return {
        status: 'connected', // or "disconnected", if webhook could not be subscribed
      };
    default:
      throw new Error(`webhook-worker: ERROR: metadata.eventType not recognized: ${message.metadata.eventType}`);
  }
};
