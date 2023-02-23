import { WorkerArgs } from '../types';

export default async ({
  message,
  attributes,
  serviceConfigData,
  serviceAccountData,
  serviceUserData,
  internalMicroAppData,
  sharedMicroAppData,
}: WorkerArgs) => {
  // Look out for user data, account data, product data in message.context
  // Service specific config data that was stored during initial setup will be
  // available in serviceConfigData. Any service specific user account data that
  // was stored earlier will be available in serviceAccountData. Similar is the
  // case with serviceUserData
  console.log('fetch-worker: INFO: Received a call to work.');
  console.log(`message => ${JSON.stringify(message, null, 2)})`);
  console.log(`attributes => ${JSON.stringify(attributes, null, 2)},`);
  console.log(`serviceConfigData => ${JSON.stringify(serviceConfigData, null, 4)}`);
  console.log(`serviceAccountData => ${JSON.stringify(serviceAccountData, null, 4)}`);
  console.log(`serviceUserData => ${JSON.stringify(serviceUserData, null, 4)}`);
  console.log(`internalMicroAppData => ${JSON.stringify(internalMicroAppData, null, 4)}`);
  console.log(`sharedMicroAppData => ${JSON.stringify(sharedMicroAppData, null, 4)}`);
  // Write all logic to perform the required work. Create other files for other
  // helpers as necessary, import and use them while keeping this file clean.
  // Do not worry about catching errors unless necessary for the business logic.

  // Check if the type of fetch event is defined. Else, throw an error
  if (typeof message.metadata === 'undefined' || typeof message.metadata.eventType === 'undefined') {
    throw new Error('Message did not have the required parameter metadata or parameter eventType within metadata');
  }

  // Check what type of fetch event has been requested and perform business
  // logic based on the same.
  // Use microAppData to store service specific data either privately to Users and Accounts of this Micro App or
  // publicly to any other Micro App on the platform. See docs for more information:
  // https://www.notion.so/companycorp/Micro-Application-Data-Store-MADS-2493a9efdaaf4f2ea3cc4eff96f92f06#29a1cdc82ed44c5cbf4f38327819ace2
  switch (message.metadata.eventType) {
    case '':
      return {
        res: 'Here is where you send the response data. This can also be an object',
        serviceAccountData: {},
        serviceUserData: {},
        /*
        microAppData: {
          user: [
            {
              key: '',
              value: {},
              readAccess: []
            }
          ],
          account: [
            {
              key: '',
              value: {},
              readAccess: []
            }
          ]
        },
        */
        /*
        extraStatus: '', // custom status to send out in addition to the default pass/ fail for custom responders to catch. Add the key only if required
        */
        /*
        crmData: {}, // crm data is used to pass custom data directly to Salesforce.  Add key only if required.
        */
      };
    default:
      throw new Error(`fetch-worker: ERROR: metadata.eventType not recognized: ${message.metadata.eventType}`);
  }
};
