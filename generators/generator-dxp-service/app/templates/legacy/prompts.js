// See: https://github.com/SBoudrias/Inquirer.js#question for documentation - this is the library yeoman uses under the hood

const { getAvailableMiddleware } = require('./handle-middleware');

const whenBulkInUse = (ans) => ans.bulkFetch || ans.bulkTransition;

const validateForPercentage = (resp) =>
  (resp >= 0 && resp <= 100 && Number.isInteger(resp)) || 'Please enter a whole number between 0 and 100 (inclusive)';

const confirmStart = {
  type: 'confirm',
  name: 'start',
  message:
    "Hi. Welcome to the Company.com micro application generator. Enter 'Y' and hit 'Return' to continue and answer a few questions to enable me to generate the project for you.",
  store: false,
};

const checkExisting = {
  type: 'list',
  name: 'generateFullService',
  message:
    'It looks like this is a previously generated service, would you like to regenerate the entire service - or would you just like to add a middleware?',
  choices: ['Generate Full Service', 'Add Custom Middleware'],
  when: (ans) => ans.start,
};

const getServiceName = {
  type: 'input',
  name: 'service',
  message: 'Your service name',
  default: '',
  store: false,
};

const getProductId = {
  type: 'input',
  name: 'productId',
  message: 'Your productId',
  store: false,
};

const getTileId = {
  type: 'input',
  name: 'tileId',
  message: 'Your tileId',
  store: false,
};

const getWhatThrottles = {
  type: 'checkbox',
  name: 'whichThrottle',
  message: 'What throttle intervals does your service need to respect if any? (Select as many as apply)',
  default: [],
  choices: ['day', 'hour', 'minute', 'second'],
};

const getDayThrottleLimits = {
  type: 'number',
  name: 'dayThrottleLimits',
  message: 'How many calls does the API allow per day?',
  when: (resp) => resp.whichThrottle && resp.whichThrottle.includes('day'),
  store: false,
};

const getHourThrottleLimits = {
  type: 'number',
  name: 'hourThrottleLimits',
  message: 'How many calls does the API allow per hour?',
  when: (resp) => resp.whichThrottle && resp.whichThrottle.includes('hour'),
  store: false,
};

const getMinuteThrottleLimits = {
  type: 'number',
  name: 'minuteThrottleLimits',
  message: 'How many calls does the API allow per minute?',
  when: (resp) => resp.whichThrottle && resp.whichThrottle.includes('minute'),
  store: false,
};

const getSecondThrottleLimits = {
  type: 'number',
  name: 'secondThrottleLimits',
  message: 'How many calls does the API allow per second?',
  when: (resp) => resp.whichThrottle && resp.whichThrottle.includes('second'),
  store: false,
};

const getIsBulkTransitionEnabled = {
  type: 'confirm',
  name: 'bulkTransition',
  message: 'Is your service expected to handle bulk requests for transitioning state?',
  store: false,
};

const getIsBulkFetchEnabled = {
  type: 'confirm',
  name: 'bulkFetch',
  message: 'Is your service expected to handle bulk requests for fetch events?',
  store: false,
};

const getReserveCapForDirect = {
  type: 'number',
  name: 'reserveCapForDirect',
  message:
    'What % of capacity would you like to reserve for direct calls to the API? (enter a whole number between 0 and 100)',
  when: whenBulkInUse,
  validate: validateForPercentage,
  default: 30,
  store: false,
};

const getSafeThrottleLimit = {
  type: 'number',
  name: 'safeThrottleLimit',
  message:
    'What % of throttle capacity would you like to hit at the most for calls to the API? (enter a whole number between 0 and 100)',
  when: whenBulkInUse,
  validate: validateForPercentage,
  default: 80,
  store: false,
};

const getEnableWebhook = {
  type: 'confirm',
  name: 'enableWebhook',
  message: 'Does your service need to connect to a webhook?',
};

const chooseExistingMiddleware = {
  type: 'checkbox',
  name: 'chooseExistingMiddleware',
  choices: getAvailableMiddleware(),
};

const getMiddlewareName = {
  type: 'input',
  name: 'getMiddlewareName',
  message: 'What would you like to name your middleware?',
};

module.exports = {
  confirmStart,
  checkExisting,
  getServiceName,
  getProductId,
  getTileId,
  getWhatThrottles,
  getDayThrottleLimits,
  getHourThrottleLimits,
  getSecondThrottleLimits,
  getMinuteThrottleLimits,
  getReserveCapForDirect,
  getSafeThrottleLimit,
  getIsBulkFetchEnabled,
  getIsBulkTransitionEnabled,
  getEnableWebhook,
  getMiddlewareName,
  chooseExistingMiddleware,
};
