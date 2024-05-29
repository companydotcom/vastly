import type { CodegenConfig } from "@graphql-codegen/cli";

const serviceName = ["test-3"];

const schemas = serviceName?.map(
  (service) => `../../services/${service}/prisma/generated/prisma-appsync/schema.gql`,
);

const config: CodegenConfig = {
  overwrite: true,
  schema: [...schemas, "./graphql/aws.gql"],
  generates: {
    "./graphql/graphql-types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-resolvers",
        "typescript-react-apollo",
      ],
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
