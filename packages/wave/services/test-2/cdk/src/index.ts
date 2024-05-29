/* eslint-disable no-new */
import { join } from 'path'
import { App } from 'aws-cdk-lib'
import { AuthorizationType } from 'aws-cdk-lib/aws-appsync'
import { kebabCase } from 'scule'
import { AppSyncStack } from './appsync'

const app = new App()

new AppSyncStack(app, kebabCase('test-2'), {
    resourcesPrefix: 'test-2',
    schema: join(process.cwd(), 'prisma/generated/prisma-appsync/schema.gql'),
    resolvers: join(process.cwd(), 'prisma/generated/prisma-appsync/resolvers.yaml'),
    function: {
        code: join(process.cwd(), 'handler.ts'),
        memorySize: 1536,
        useWarmUp: 0, // useWarmUp > 0 will incur extra costs
        environment: {
            NODE_ENV: 'production',
            DATABASE_URL: process.env.DATABASE_URL,
        },
        bundling: {
            minify: true,
            sourceMap: true,
            forceDockerBundling: true,
            commandHooks: {
                beforeBundling(inputDir: string, outputDir: string): string[] {
                    return [`cp ${inputDir}/prisma/schema.prisma ${outputDir}`]
                },
                beforeInstall() {
                    return []
                },
                afterBundling() {
                    return [
                        'npx prisma generate',
                        'rm -rf generated',

                        // npm + yarn 1.x
                        'rm -rf node_modules/@prisma/engines',
                        'rm -rf node_modules/@prisma/client/node_modules',
                        'rm -rf node_modules/.bin',
                        'rm -rf node_modules/prisma',
                        'rm -rf node_modules/prisma-appsync',
                    ]
                },
            },
            nodeModules: ['prisma', '@prisma/client', 'prisma-appsync'],
            environment: {
                NODE_ENV: 'production',
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
