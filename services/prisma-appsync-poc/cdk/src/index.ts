/* eslint-disable no-new */
import * as path from "path"
import { App } from "aws-cdk-lib"
import { AuthorizationType } from "@aws-cdk/aws-appsync-alpha"
import { kebabCase } from "scule"
import { AppSyncStack } from "./appsync"

const app = new App()

new AppSyncStack(app, kebabCase("prisma-appsync-poc"), {
  resourcesPrefix: "prisma-appsync-poc",
  schema: path.join(process.cwd(), "prisma/generated/prisma-appsync/schema.gql"),
  resolvers: path.join(process.cwd(), "prisma/generated/prisma-appsync/resolvers.yaml"),
  function: {
    code: path.join(process.cwd(), "handler.ts"),
    memorySize: 1536,
    useWarmUp: 0, // useWarmUp > 0 will incur extra costs
    environment: {
      NODE_ENV: "production",
      DATABASE_URL: process.env.DATABASE_URL,
    },
    bundling: {
      minify: true,
      sourceMap: true,
      forceDockerBundling: true,
      commandHooks: {
        // beforeBundling(inputDir: string, outputDir: string): string[] {
        //   return [`cp ${inputDir}/prisma/schema.prisma ${outputDir}`]
        // },
        beforeBundling(inputDir: string, outputDir: string): string[] {
          const schema = path.join(process.cwd(), "prisma/schema.prisma")
          const gql = path.join(inputDir, "prisma/custom-schema.gql")
          const yaml = path.join(inputDir, "prisma/custom-resolvers.yaml")

          console.log({ inputDir })
          console.log({ schema })
          console.log({ outputDir })

          return [
            `cp "/Users/nhumai/company/dxp/services/prisma-appsync-poc/prisma/schema.prisma" /Users/nhumai/company/dxp/services/prisma-appsync-poc/prisma/`,
            `cp ${gql} ${outputDir}`,
            `cp ${yaml} ${outputDir}`,
          ]
        },
        beforeInstall() {
          return []
        },
        afterBundling() {
          return [
            "npx prisma generate",
            "rm -rf generated",

            // npm + yarn 1.x
            "rm -rf node_modules/@prisma/engines",
            "rm -rf node_modules/@prisma/client/node_modules",
            "rm -rf node_modules/.bin",
            "rm -rf node_modules/prisma",
            "rm -rf node_modules/prisma-appsync",
          ]
        },
      },
      nodeModules: ["prisma", "@prisma/client"],
      environment: {
        NODE_ENV: "production",
      },
    },
  },
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: AuthorizationType.API_KEY,
    },
  },
})

app.synth()
