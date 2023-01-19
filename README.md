# Company.com Custom Offering Monorepo

This is a monorepo to manage the Company.com custom offering.

## What's inside?

This monorepo uses [pnpm](https://pnpm.io) as a package manager and
[Turborepo](https://turbo.build/) as a build system. It includes the following
packages/apps:

### Apps and Packages

- `docs`: a [Nextra](https://nextra.site/) app
- `web`: a [Next.js](https://nextjs.org/) app, used for testing purposes
- `client`: a collection of React features to be consumed by creators
- `ui`: a React component library, (formerly Potion) shared by both `web` and
  `docs` applications
- `cli`: our custom CLI
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next`
  and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This monorepo has some tools setup for managing our packages:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [tsx](https://github.com/esbuild-kit/tsx) for running ts scripts
- [tsup](https://github.com/egoist/tsup) for bundling our libraries

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm run dev
```

## Useful Links

Learn more about Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
