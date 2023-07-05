### Configuring Generated Microservices

#### - Database Connection

1. Navigate to your generated service folder
2. Add your database URL to the `schema.prisma` file in the prisma folder. Please visit
   https://www.prisma.io/docs/concepts/database-connectors for proper formatting of your databse URL
3. Run `npm run generate`

#### - Deploying to AWS Appsync

1. Update your AWS Credentials by running `code ~/.aws/credentials` in your terminal
2. Open Docker
3. Run `npm run deploy`

#### - Generating Frontend Hooks

1. Navigate to `apps/client`
2. Run `npm install`
3. Update the `apollo.tsx` file in the `apps/client` folder with your generated Appsync API `url`,
   `region`, and `apiKey`.
4. Run `npm run codegen`
5. Types and front end hooks will be generated in the `graphql-types.ts` in the graphql folder

#### - Using Frontend Hooks Example

1. Import your generated frontend hooks to use in a frontend page. Each generated hook and examples
   for use can be found towards the bottom of `graphql-types.ts` file.
2. Run `npm run build`, and `npm run dev` or `npm start` to start your app
