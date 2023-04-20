import AWSAppSyncServer from "aws-appsync"
import { schema } from "./schema"

const server = new AWSAppSyncServer({ schema })

// Configure your AWS AppSync settings here
const config = {
  endpoint: "https://spvx3o65mrblhgsu3rp7kbw2qy.appsync-api.us-east-1.amazonaws.com/graphql",
  region: "us-east-1",
  auth: {
    type: "API_KEY",
    apiKey: "da2-r3d3tfez5nexzopaax4vaoqmea	",
  },
}

// Start the AWSAppSyncServer
server.start(config).then(() => {
  console.log("AWSAppSyncServer started")
})
