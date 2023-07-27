import pkg from "fs-extra";
import { Client } from "../../util/client.js";
import { execSync } from "child_process";
const { existsSync } = pkg;

export default async function dev(client: Client) {
  const { output } = client;
  try {
    if (existsSync("./prisma") && existsSync("./server.ts")) {
      console.log("inside");
      execSync(
        'npx prisma generate && DATABASE_URL=\'file:dev.sqlite\' npx prisma db push --accept-data-loss && DATABASE_URL=\'file:dev.sqlite\' npx vite-node ./server.ts --watch -- --schema prisma/generated/prisma-appsync/schema.gql --watchers \'[{"watch":["**/*.prisma","*.prisma"],"exec":"npx prisma generate && DATABASE_URL=\'file:dev.sqlite\' npx prisma db push --accept-data-loss && touch ./server.ts"}]\'',
        { stdio: "inherit" },
      );
    }
  } catch (err: unknown) {
    output.error(err as string);
  }
}
