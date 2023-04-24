/* eslint-disable @typescript-eslint/no-var-requires */
// import AWSAppSyncServer from "aws-appsync"
// import { schema } from "./schema"

// const server = new AWSAppSyncServer({ schema })

// // Configure your AWS AppSync settings here
// const config = {
//   endpoint: "https://spvx3o65mrblhgsu3rp7kbw2qy.appsync-api.us-east-1.amazonaws.com/graphql",
//   region: "us-east-1",
//   auth: {
//     type: "API_KEY",
//     apiKey: "da2-r3d3tfez5nexzopaax4vaoqmea",
//   },
// }

// // Start the AWSAppSyncServer
// server.start(config).then(() => {
//   console.log("AWSAppSyncServer started")
// })

import fs from "fs"
import { AppSyncClient, StartSchemaCreationCommand } from "@aws-sdk/client-appsync"

const client = new AppSyncClient({
  region: "us-east-1",
})

const schema = fs.readFileSync("schema.gql")

const params = {
  apiId: "onuaxxpyxvbazaa2lnfl5zklzu",
  definition: schema,
}

const command = new StartSchemaCreationCommand(params)

client.send(command).then(
  (data: unknown) => {
    console.log(data)
  },
  (error: unknown) => {
    console.log(error)
  },
)
