import type { CodegenConfig } from "@graphql-codegen/cli";

const serviceName = "Service Name";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    `../../services/${serviceName}/prisma/generated/prisma-appsync/schema.gql`,
    "./graphql/aws.gql",
  ],
  generates: {
    "./graphql/graphql-types.ts": {
      plugins: ["typescript", "typescript-resolvers", "typescript-react-apollo"],
      documents: "graphql/*.gql",
      config: {
        scalars: {
          AWSDateTime: "Date",
          AWSEmail: "string",
          AWSJSON: "string",
          AWSURL: "string",
          AWSTimestamp: "string",
        },
        withHooks: true,
      },
    },
  },
};

export default config;
