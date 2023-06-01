import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: ["./schema.gql", "./src/graphql/aws.gql"],
  generates: {
    "src/graphql/graphql-types.ts": {
      plugins: [
        "typescript",
        "typescript-resolvers",
        "typescript-react-apollo",
      ],
      documents: "src/**/*.gql",
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
