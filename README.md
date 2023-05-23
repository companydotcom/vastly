# Vastly's Wave

<picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://u.photofunia.com/1/results/m/D/mDRuOKsodBeZRZJbzxWwFA_r.jpg">
  <img src="https://u.photofunia.com/1/results/m/D/mDRuOKsodBeZRZJbzxWwFA_r.jpg" height="420">
</picture>

This is Vastly's monorepo to power the Wave platform

## What's inside?

This monorepo uses [pnpm](https://pnpm.io) as a package manager and
[Turborepo](https://turbo.build/) as a build system. It includes the following packages/apps:

### Apps and Packages

- `docs`: a [Nextra](https://nextra.site/) app
- `workshop`: a [Next.js](https://nextjs.org/) app, used for testing purposes
- `client`: a collection of React features to be consumed by creators
- `ui`: a React component library, (formerly Potion) shared by both `workshop` and `docs`
  applications
- `forms`: a React component library with custom form components
- `cli`: our custom CLI
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and
  `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This monorepo has some tools setup for managing our packages:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Changesets](https://github.com/changesets/changesets) for publishing and versioning packages
- [tsx](https://github.com/esbuild-kit/tsx) for running ts scripts
- [tsup](https://github.com/egoist/tsup) for bundling our libraries
- [husky](https://github.com/typicode/husky) and
  [lint-staged](https://github.com/okonet/lint-staged) for ensuring code quality is kept
- [commit-lint](https://commitlint.js.org/#/) to ensure every commit is tied to a ticket in Jira

### Build

To build all apps and packages, run the following command:

```
cd wave
pnpm run build:all
```

### Develop

To develop all apps and packages, run the following command:

```
cd wave
pnpm run dev
```

## Development Guidelines

- Keep dependency list as small as possible.
- Document features as they are built and modified.
- Colocate dependencies with their packages - don't install packages in monorepo root unless
  necessary.

## Publishing Packages

- In order to publish public packages to NPM run `pnpm changeset` then commit your changes, that's
  it. When your branch is merged into `main` it will be automatically version bumped and published
  to NPM.

## Useful Links

Learn more about Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
