const { middleware } = require('@vastly/micro-application-core');

module.exports.getAvailableMiddleware = () => {
  const middlewareNames = Object.keys(middleware);
  return middlewareNames;
};

const defaultMiddlewareSettings = ` {
      isBulk: [true, false],
      eventType: [\'fetch\', \'transition\', \'webhook\'],
    },`;

module.exports.generateMiddlewareIndex = (customMiddlewareNames, microAppMiddlewareInUse) => {
  let imports = ``;
  let exports = '';
  if (microAppMiddlewareInUse.length) {
    imports = imports.concat(`import { middleware } from '@vastly/micro-application-core'\n`);
  }

  microAppMiddlewareInUse.forEach((name) => {
    exports = exports.concat(`  {
    middleware: middleware.${name},
    settings: ${defaultMiddlewareSettings}
  },
`);
  });

  customMiddlewareNames.forEach((name) => {
    imports = imports.concat(`import ${name} from './${name}'\n`);
  });

  customMiddlewareNames.forEach((name) => {
    exports = exports.concat(`  {
    middleware: ${name},
    settings: ${defaultMiddlewareSettings}
  },
`);
  });
  console.log('imports', imports);
  console.log('exports', exports);

  return {
    imports,
    exports,
  };
};
