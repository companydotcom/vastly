/* eslint-disable no-restricted-globals */
const Generator = require("yeoman-generator")
const fs = require("fs")
const mkdirp = require("mkdirp")
const {
  confirmStart,
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
  checkExisting,
  chooseExistingMiddleware,
  getMiddlewareName,
} = require("./prompts")

const {
  functionConfigs,
  resourceQueueConfigs,
  resourceSubscriptionConfigs,
  queueRefPolicyConfigs,
  iamSqsResources,
} = require("./sls-config-options")

const { generateMiddlewareIndex } = require("./handle-middleware")

class microAppGenerator extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts)
    this.fixAppName = (appname) => appname.replace(/\s+|_+/g, "-")

    this.proceed = true
    this.envData = {
      region: "us-east-1",
      accountId: 254150672415,
      retryCntForCapacity: 3,
    }

    this.doWeStart = async () => {
      const answer = await this.prompt([
        { ...confirmStart, default: this.fixAppName(this.appname) },
      ])
      return answer.start
    }

    this.formatEnvToYml = () => ({
      serviceName: this.answers.service,
      ...this.envData,
      ...this.answers,
      throttleLmts: JSON.stringify({
        ...(this.answers.dayThrottleLimits ? { day: this.answers.dayThrottleLimits } : {}),
        ...(this.answers.hourThrottleLimits ? { hour: this.answers.hourThrottleLimits } : {}),
        ...(this.answers.minutesThrottleLimits
          ? { minutes: this.answers.minutesThrottleLimits }
          : {}),
        ...(this.answers.secondThrottleLimits ? { second: this.answers.secondThrottleLimits } : {}),
      }).replace(/'/g, '"'),
    })

    this.getCurrentMiddlewareNames = () => {
      const middlewareFiles = fs.readdirSync(this.destinationPath("middleware"))
      return middlewareFiles
        .filter((fileName) => fileName !== "index.js")
        .map((file) => file.split(".")[0])
    }

    this.addMiddleware = () => {
      if (this.answers.getMiddlewareName) {
        this.fs.copyTpl(
          this.templatePath("middleware/template.ts"),
          this.destinationPath(`middleware/${this.answers.getMiddlewareName}.js`),
          {
            middlewareName: this.answers.getMiddlewareName,
          },
        )
      }
      this.fs.copyTpl(
        this.templatePath("middleware/index.txt"),
        this.destinationPath("middleware/index.ts"),
        generateMiddlewareIndex(
          [...this.getCurrentMiddlewareNames(), this.answers.getMiddlewareName],
          this.answers.chooseExistingMiddleware || [],
        ),
      )
    }

    this.finishProvisioning = () => {
      const getSlsConfigOptions = (configs, answers) => {
        let slsString = ""
        if (answers.bulkFetch) {
          slsString = slsString.concat(configs.bulkFetch)
        }
        if (answers.bulkTransition) {
          slsString = slsString.concat(configs.bulkTransition)
        }
        if (answers.enableWebhook) {
          slsString = slsString.concat(configs.webhook)
        }
        return slsString
      }

      if (this.proceed === false) {
        return
      }
      this.fs.copy(
        this.templatePath("workers/fetch-worker.ts"),
        this.destinationPath("workers/fetch-worker.ts"),
      )
      this.fs.copy(
        this.templatePath("workers/transition-worker.ts"),
        this.destinationPath("workers/transition-worker.ts"),
      )
      this.fs.copy(this.templatePath("types"), this.destinationPath("types"))
      this.fs.copy(
        this.templatePath("database.config.json"),
        this.destinationPath("database.config.json"),
      )
      this.fs.copyTpl(this.templatePath("handler.js"), this.destinationPath("handler.js"), {
        throttlingOn:
          this.answers.whichThrottle && this.answers.whichThrottle.length !== 0 ? true : false,
      })
      this.fs.copy(
        this.templatePath("webpack.config.js"),
        this.destinationPath("webpack.config.js"),
      )
      this.fs.copy(this.templatePath("tsconfig.json"), this.destinationPath("tsconfig.json"))
      this.fs.copy(this.templatePath(".eslintrc.js"), this.destinationPath(".eslintrc.js"))
      this.fs.copy(this.templatePath(".gitignore"), this.destinationPath(".gitignore"))
      this.fs.copy(this.templatePath(".eslintignore"), this.destinationPath(".eslintignore"))
      this.fs.copy(this.templatePath(".prettierignore"), this.destinationPath(".prettierignore"))
      this.fs.copy(this.templatePath(".prettierrc.js"), this.destinationPath(".prettierrc.js"))
      this.fs.copy(this.templatePath("README.md"), this.destinationPath("README.md"))
      this.fs.copyTpl(this.templatePath("package.json"), this.destinationPath("package.json"), {
        appName: this.answers.service,
      })
      this.fs.copyTpl(
        this.templatePath("env.yml"),
        this.destinationPath("env.yml"),
        this.formatEnvToYml(),
      )
      this.fs.copyTpl(this.templatePath("serverless.yml"), this.destinationPath("serverless.yml"), {
        serviceName: this.answers.service,
        optionalIamSqsResources: getSlsConfigOptions(iamSqsResources, this.answers),
        optionalFunctionConfigs: getSlsConfigOptions(functionConfigs, this.answers),
        optionalQueueCreation: getSlsConfigOptions(resourceQueueConfigs, this.answers),
        optionalQueueSubscriptions: getSlsConfigOptions(resourceSubscriptionConfigs, this.answers),
        optionalQueuePolicies: getSlsConfigOptions(queueRefPolicyConfigs, this.answers),
      })
      this.fs.copyTpl(
        this.templatePath("tests/sample-message.json"),
        this.destinationPath("tests/sample-message.json"),
        this.answers,
      )
      this.fs.copyTpl(
        this.templatePath(".vscode/launch.json"),
        this.destinationPath(".vscode/launch.json"),
        this.answers,
      )
      this.fs.copy(
        this.templatePath(".vscode/extensions.json"),
        this.destinationPath(".vscode/extensions.json"),
      )
      this.fs.copy(
        this.templatePath(".vscode/settings.json"),
        this.destinationPath(".vscode/settings.json"),
      )
      mkdirp.sync(`${this.destinationRoot()}/services`)
      this.fs.copyTpl(
        this.templatePath(
          this.answers.enableWebhook
            ? "workers/webhook-worker-enabled.ts"
            : "workers/webhook-worker-disabled.ts",
        ),
        this.destinationPath("workers/webhook-worker.ts"),
      )
      mkdirp.sync(`${this.destinationRoot()}/middleware`)
      this.fs.copyTpl(
        this.templatePath("middleware/index.txt"),
        this.destinationPath("middleware/index.ts"),
        generateMiddlewareIndex(
          this.getCurrentMiddlewareNames(),
          this.answers.chooseExistingMiddleware || [],
        ),
      )
    }
  }
}

module.exports = class extends microAppGenerator {
  async prompting() {
    const preExistingService = fs.existsSync(this.destinationPath("package.json"))

    this.startUp = await this.prompt(
      preExistingService ? [confirmStart, checkExisting] : [confirmStart],
    )

    if (this.startUp.start) {
      if (!preExistingService || this.startUp.generateFullService === "Generate Full Service") {
        this.type = "fullService"
        this.answers = await this.prompt([
          { ...getServiceName, default: this.fixAppName(this.appname) },
          getProductId,
          getTileId,
          getWhatThrottles,
          getDayThrottleLimits,
          getHourThrottleLimits,
          getMinuteThrottleLimits,
          getSecondThrottleLimits,
          getIsBulkFetchEnabled,
          getIsBulkTransitionEnabled,
          getReserveCapForDirect,
          getSafeThrottleLimit,
          getEnableWebhook,
          chooseExistingMiddleware,
        ])
        this.answers.safeThrottleLimit = this.answers.safeThrottleLimit
          ? this.answers.safeThrottleLimit / 100
          : 0.8
        this.answers.reserveCapForDirect = this.answers.reserveCapForDirect
          ? this.answers.reserveCapForDirect / 100
          : 0.3
      } else if (this.startUp.generateFullService === "Add Custom Middleware") {
        this.type = "middleware"
        this.answers = await this.prompt([chooseExistingMiddleware, getMiddlewareName])
      }
    } else {
      this.type = "none"
    }
  }

  writing() {
    switch (this.type) {
      case "fullService":
        this.finishProvisioning()
        break
      case "middleware":
        this.addMiddleware()
        break
      default:
        break
    }
  }

  end() {
    this.log(
      "Your service is now generated, please read the included README.md and comments for instructions on how to get started.",
    )
  }
}
