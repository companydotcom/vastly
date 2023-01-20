const fs = require("fs")
const path = require("path")

// This script copies the appropriate .env provided as an arg (dev, plat, or stage)
// and copies them to the monorepo root, main root, and auth root

try {
  const args = process.argv.slice(2)
  if (args.length <= 0) {
    throw new Error("Must provide an environment")
  }

  if (args.length > 1) {
    throw new Error("Too many arguments!")
  }

  if (args[0] !== "dev" && args[0] !== "plat" && args[0] !== "stage" && args[0] !== "prod") {
    throw new Error("Must provide an argument thats either one of dev, plat, prod, or stage")
  }

  const pathToCopy = path.join(__dirname, "../", `.env.${args[0]}`)
  const pathToRoot = path.join(__dirname, "../", ".env.local")
  const pathToDashboard = path.join(__dirname, "../", "apps", "dashboard", ".env.local")
  const pathToAuth = path.join(__dirname, "../", "apps", "auth", ".env.local")
  const pathToTypes = path.join(__dirname, "../", "packages", "types", ".env.local")
  // const pathToHelpers = path.join(__dirname, '../', 'packages', 'helpers', '.env');

  const paths = [
    pathToRoot,
    pathToAuth,
    pathToDashboard,
    pathToTypes,
    // , pathToHelpers
  ]

  paths.forEach((path) => fs.copyFileSync(pathToCopy, path))

  console.log("Successfully copied and moved the file!")
} catch (err) {
  console.log("Problem copying .env")
  throw err
}
