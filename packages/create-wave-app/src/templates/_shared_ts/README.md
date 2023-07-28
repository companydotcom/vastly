<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">create-wave-app</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#using-the-vastly-cli">Using the Vastly CLI</a></li>
        <ul>
          <li><a href="#generating-microservices">Generating Microservices</a></li>
            <li><a href="#generating-ciam">Generating CIAM</a></li>
        </ul>
        <li><a href="#configuration">Configuration</a></li>
          <ul>
            <li><a href="#configuring-generated-microservices">Configuring Generated Microservices</a></li>
            <li><a href="#configuring-generated-ciam">Configuring Generated CIAM</a></li>
        </ul>
      </ul>
    </li>

  </ol>
</details>

<!-- GETTING STARTED -->

## Getting Started

Follow the instructions below to begin creating with your create-wave-app repo.

### Installation

1. We recommend creating a new Vastly Wave app using `create-wave-app`, which sets up everything
   automatically for you. To create a project, run:
   ```sh
   npx create-wave-app@latest
   ```
2. On installation, you'll see the following prompts:
   ```sh
   1. What would you like to name your project? my-app
   2. Please enter a description for your project: my-app description
   3. Would you like to link your project to GitHub? No / Yes
      If Yes:
      - What is your GitHub email?
      - What is your GitHub username?
      - What is your GitHub token? (Personal Access Token with full repo scope)
   4. Which package manager do you want to use? npm / yarn
   5. Generate? No / Yes
   ```
3. After the prompts, create-wave-app will create a folder with your project name. Navigate to your
new project and run one of the following depending on your answer to question 4 above. `npm install`
or `yarn install`. Moving forward, the examples below will be using `npm`.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Using the Vastly CLI

### Generating Microservices

1. Run `wave generate service`
2. You'll see the following prompts:
   ```sh
   1. What type of microservice do you want to generate? REST / EDA / Streaming Service
   2. What would you like to name your service? example-service
   3. Please enter a description for your service: Description for the example service
   ```
3. After the prompts, `@vastly/wave` will create a folder with your service name inside the
   `services` folder. There will also be a `graphql` directory, `apollo.tsx` file, and `codegen.ts`
   file in your client app.
4. Make sure to re-run your package manager install command at the root of the monorepo after
   generating a service.
5. For additional information about your configuring new service, please see
<a href="#configuring-generated-microservices">Configuring Generated Microservices</a> below or
visit: https://prisma-appsync.vercel.app/
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Generating CIAM

1. Run `wave generate ciam`
2. You'll see the following prompt:
   ```sh
   1. Which CIAM provider would you like to use? AWS Cognito
   ```
3. After the prompt, `@wave/cli` will create an `api` folder, as well as `login.tsx` and
   `restricted.tsx` pages inside `apps/client/pages` folder.
4. Make sure to re-run your package manager install command at the root of the monorepo after
   generating a service.
5. For additional information about configuring your CIAM, please see
<a href="#configuring-generated-ciam">Configuring Generated CIAM</a> below or visit:
https://next-auth.js.org/
<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Configuration

### Configuring Generated Microservices

#### - Database Connection

1. Navigate to your generated service folder
2. Add your database URL to the `schema.prisma` file in the prisma folder. Please visit
   https://www.prisma.io/docs/concepts/database-connectors for proper formatting of your databse URL
3. Run `npm run generate`. Please visit
   https://www.prisma.io/docs/reference/api-reference/command-reference#generate to learn more about
   what this command generates

#### - Local Development Servers

##### Local GraphQL Server

1. To start your local graphQL server, run `npm run dev`
2. This will automatically push your Prisma Schema changes to a SQLite database, as well as launch a
   local GraphQL IDE server (with auto-reload and TS support).

##### Local Database Server

1. To start your local database server, run `npm run db`. Please visit
   https://www.prisma.io/docs/concepts/components/prisma-studio for additional information

#### - Deploying to AWS Appsync

1. Update your AWS Credentials by running `code ~/.aws/credentials` in your terminal
2. Open Docker
3. Run `npm run deploy`

#### - Generating Frontend Hooks

1. Navigate to `apps/client`
2. Run `npm install`
3. Update the `apollo.tsx` file in the `apps/client` folder with your generated Appsync API `url`,
   `region`, and `apiKey`.
4. Run `npx wave codegen`
5. Types and front end hooks will be generated in the `graphql-types.ts` in the graphql folder

#### - Using Frontend Hooks Example

1. Import your generated frontend hooks to use in a frontend page. Each generated hook and examples
   for use can be found towards the bottom of `graphql-types.ts` file.
2. Run `npm run build`, and `npm run dev` or `npm start` to start your app

### Configuring Generated CIAM

1. Update the `[...nextauth].js` file in the `apps/client/pages/api/auth` folder with the
   `clientID`, `clientSecret` and `issuer` fields for your AWS Cognito Provider. The `secret` field
   is necessary for production.
2. Run `npm run build`, and `npm run dev` or `npm start` to start your app
3. Navigate to `localhost:3000/login` to login/logout, and `localhost:3000/restricted` to check
secure routes.
<p align="right">(<a href="#readme-top">back to top</a>)</p>
