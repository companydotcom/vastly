# Instructions

The only files to edit are:

1. 'env.yml' which has its own comments to describe the parameters,
2. 'workers/fetch-worker' to implement the business logic of a fetch call,
3. 'workers/transition-worker' to implement the business logic of a transition call,
4. 'services' folder to add any required service function files for the workers,
5. 'tests' folder to add any unit tests, vsCode tests.
6. 'database.config.json' file to add any specific settings that you would like
   to have stored safely in our database and delivered to the worker files as
   'serviceConfigData'. Once you have the file ready, just run 'npm run setupDatabase'
   to setup the database.

Of course, you can add any new npm packages required for the workers by using the 'npm i s <package>' command

## Input Schemas

Message that will be delivered to worker:

```json
{
  "payload": {
    // any custom data from triggering event
  },
  "context": {
    "user": {
      "userId": "xxxxxx",
      "seoId": "xxxx",
      "accountId": "xxxxxx",
      "userCUIs": [],
      "appointments": [],
      "products": "[{productId=af62ded1-06e4-11e8-9306-120b17a64360, dateActivated=1574662799211, status=active}]",
      "mailboxFQDN": null,
      "mailbox": null,
      "marketoPersonId": "xxxx",
      "firstName": "xxxx",
      "lastName": "xxxx",
      "email": "xxx@xxx.xxx",
      "role": "admin",
      "phone": "(xxx) xxx-xxxx",
      "source": "company",
      "userStatus": "active",
      "userSettings": null,
      "__typename": "User"
    },
    "account": {
      "accountId": "xxxx",
      "seoStatus": {
        "gmbConnectStatus": "Not listed",
        "__typename": "SeoStatus"
      },
      "accountStatus": "active",
      "business": [
        {
          "businessId": "xxx",
          "name": "xxx",
          "address": {
            "addressLine1": "xxx",
            "city": "xxx",
            "state": "XX",
            "zipCode": "12345",
            "__typename": "Address"
          },
          "__typename": "Business"
        }
      ],
      "businessPrimary": {
        "businessId": "1a2386c3-a975-4cdf-9f99-5dd75181a521",
        "name": "Dykema Rubber Band Co",
        "address": {
          "addressLine1": "4075 Windgap Ave Bldg, #5 & 6",
          "city": "Pittsburgh",
          "state": "PA",
          "zipCode": "15204",
          "__typename": "Address"
        },
        "numberOfEmployees": "5",
        "__typename": "Business"
      },
      "Products": [
        {
          "isActive": true,
          "ratePlanName": null,
          "productId": "4b92ba48-06ec-11e8-9306-120b17a64360",
          "__typename": "AccountProduct"
        }
      ],
      "loans": null,
      "loanPrimary": null,
      "zuoraPaymentMethodId": null,
      "dateCreated": 1231231231231,
      "dateUpdated": 1231231231231,
      "isWebFQDNCustom": false,
      "isEmailFQDNCustom": false,
      "fqdnCompany": null,
      "fqdnCustom": null,
      "hasFQDN": false,
      "users": [
        {
          "isPrimary": true,
          "userId": "xxxx",
          "__typename": "AccountUser"
        }
      ],
      "__typename": "Account"
    },
    "product": {
      "name": "Business Listings Manager",
      "isPackage": false,
      "description": "Get found, both locally and online, to get more customers.",
      "slug": "directory_uberall",
      "purchaseRelUrl": "/subscriptions/directory_uberall",
      "ratePlans": [
        {
          "description": null,
          "includedInMembership": true,
          "isActive": null,
          "name": "Pro",
          "price": 0,
          "seatCount": null,
          "linkedTiles": null,
          "zuoraProductRatePlanId": null,
          "eligibleProducts": ["234fert45"],
          "partnerRatePlanId": "1111",
          "__typename": "RatePlan"
        },
        {
          "description": null,
          "includedInMembership": false,
          "isActive": null,
          "name": "Pro Plus",
          "price": 10,
          "seatCount": null,
          "linkedTiles": null,
          "zuoraProductRatePlanId": "345lk345l345kl345lk",
          "eligibleProducts": ["123123-234234-3534fg-345"],
          "partnerRatePlanId": "2222",
          "__typename": "RatePlan"
        }
      ],
      "__typename": "Product",
      "productId": "785d02a4-2e7a-11e8-ae75-120b17a64360"
    }
  },
  "metadata": {
    "eventType": "activate",
    "stateCurrent": "active",
    "statePrevious": "inactive",
    "tileId": "xxxxx",
    "isHidden": null,
    "seqNo": null
  }
}
```

Message attributes that will be delivered to the worker:

```json
{
  "eventId": {
    "Type": "String",
    "Value": "xxxxx"
  },
  "entityId": {
    "Type": "String",
    "Value": "xxxxx"
  },
  "emitter": {
    "Type": "String",
    "Value": "xxxxx"
  },
  "operation": {
    "Type": "String",
    "Value": "X"
  },
  "entity": {
    "Type": "String",
    "Value": "product"
  },
  "status": {
    "Type": "String",
    "Value": "trigger"
  }
}
```

## Output Options

```json
{
  "res": "Here is where you send the response data. This can also be an object",
  "serviceAccountData": {}, // saved under vendorData[vendorSlug] on Account
  "microAppData": {
    "user": [
      {
        "key": "",
        "value": {},
        "readAccess": []
      }
    ],
    "account": [
      {
        "key": "",
        "value": {},
        "readAccess": []
      }
    ]
  },
  "serviceUserData": {}, // saved under vendorData[vendowSlug] on User
  "extraStatus": "", // custom status to send out in addition to the default pass/ fail for custom responders to catch. Add the key only if required
  "crmData": {} // crm data is used to pass custom data directly to Salesforce or other configured crm providers.  Add key only if required.  Triggers micro-application-core to send a crm event on event-bus with this data as the payload
}
```

## Testing things right away

For VS Code debug, we have a health handler configured to work through the debug mode in VS. However, there is one change you will need to do in
/tests/sampleMessage.json. Open the file, replace 'dummy' with real existing values for user and account in lines 46, 47 and 50.
