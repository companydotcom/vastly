# cli

## 0.14.4

### Patch Changes

- Fixed an issue where bulk env file upload was cutting off env variable values if they had "="
  signs in them.

## 0.14.3

### Patch Changes

- Added the option to do bulk .env variable upload to the @vastly/cli command

## 0.14.2

### Patch Changes

- Adds pull all command for vastly env

## 0.14.1

### Patch Changes

- Update version of node engine on all CLIs. Updates create-wave-app to use nodemon to fix console
  error

## 0.14.0

### Minor Changes

- 743f2f2: Refactors the env portion of the cli to be an internal tool, decouples it from the
  environment service. Updates packages in utilites

### Patch Changes

- Updated dependencies [743f2f2]
  - @vastly/utils@0.5.1

## 0.13.0

### Minor Changes

- Refactors env cli tool to be internal facing
- f8fca0c: Refactors the env portion of the cli to be an internal tool, decouples it from the
  environment service. Updates packages in utilites

### Patch Changes

- Updated dependencies
- Updated dependencies [f8fca0c]
  - @vastly/utils@0.5.0

## 0.12.17

### Patch Changes

- fixes build error and shared utilities packages fix
- Updated dependencies
  - @vastly/utils@0.4.3

## 0.12.16

### Patch Changes

- Adds idToken to client, updates user service to accomodate, updates asset service to accomodate
  and utilize idToken
- Updated dependencies
  - @vastly/utils@0.4.2

## 0.12.15

### Patch Changes

- Updated dependencies
  - @vastly/utils@0.4.1

## 0.12.14

### Patch Changes

- @vastly/utils@0.3.2

## 0.12.13

### Patch Changes

- Fixes CLI localhost error routing

## 0.12.12

### Patch Changes

- Adds account retrieval from config

## 0.12.11

### Patch Changes

- Changes api url

## 0.12.10

### Patch Changes

- temporarily changes default API gateway url

## 0.12.9

### Patch Changes

- updates provenance. updates wave.config.ts reader.
- Updated dependencies
  - @vastly/utils@0.3.1

## 0.12.8

### Patch Changes

- moved generate to wave

## 0.12.7

### Patch Changes

- Adds authorizer error handling

## 0.12.6

### Patch Changes

- updated create-wave-app readme. fixed error handling in generate ciam command. updated
  create-wave-app docs links

## 0.12.5

### Patch Changes

- removes services dir by default. removes default nextjs front end docs. fixes some bugs with
  generate service and generate ciam

## 0.12.4

### Patch Changes

- Fix encoded urls

## 0.12.3

### Patch Changes

- Another attempt

## 0.12.2

### Patch Changes

- More path fixes

## 0.12.1

### Patch Changes

- Changes how pkg is passed down

## 0.12.0

### Minor Changes

- Adds better handling for grabbing package.json

## 0.11.6

### Patch Changes

- fix issue with vastly command.ts

## 0.11.5

### Patch Changes

- trying to fix cli -V issue

## 0.11.3

### Patch Changes

- fixed -V command

## 0.11.2

### Patch Changes

- fixed -V command

## 0.11.0

### Minor Changes

- Adds better error handling and streamlines codes

## 0.10.0

### Minor Changes

- adds better error handling, polishing CLI

## 0.9.7

### Patch Changes

- changed dev api urls to official https://api.vastly.is url

## 0.9.6

### Patch Changes

- Fix mutation query

## 0.9.5

### Patch Changes

- Update default queries for local microservice server

## 0.9.4

### Patch Changes

- Add local dev server for microservice template

## 0.9.3

### Patch Changes

- Format error, apollo path

## 0.9.2

### Patch Changes

- generate ciam command

## 0.9.1

### Patch Changes

- adds error handling to the env commands, cleans code and adds better success text

## 0.9.0

### Minor Changes

- Changes package name, adds vastly bin

## 0.8.11

### Patch Changes

- Create frontend src folder for template, update wave-cli version

## 0.8.10

### Patch Changes

- Add graphql codegen plugin, update wave cli version for create-wave-app templates

## 0.8.9

### Patch Changes

- Resolve pathing issue for frontend template

## 0.8.8

### Patch Changes

- Handle lambda size limit issue with pnpm

## 0.8.7

### Patch Changes

- 3a8b26e: Fix templates

## 0.8.6

### Patch Changes

- Fix graphql schema path in codgen config

## 0.8.5

### Patch Changes

- Remove subscriptions gql file

## 0.8.4

### Patch Changes

- Fix tsconfig

## 0.8.3

### Patch Changes

- Ignore templates in tsconfig

## 0.8.2

### Patch Changes

- Include templates in tsup build, add service description question

## 0.8.1

### Patch Changes

- Fix frontend package.json path

## 0.8.0

### Minor Changes

- Adds generate service command

## 0.7.2

### Patch Changes

- add keywords, debuggin

## 0.7.1

### Patch Changes

- update tsconfig
- adds readme

## 0.7.0

### Minor Changes

- bumping version after fixing install and build script for npm release action

### Patch Changes

- Updated dependencies
  - @vastly/utils@0.3.0

## 0.6.0

### Minor Changes

- debugging global install issue

## 0.5.0

### Minor Changes

- add npm provenance

### Patch Changes

- Updated dependencies
  - @vastly/utils@0.2.0

## 0.4.0

### Minor Changes

- f0cc2d8: name change, changeset add
- 1e3d6df: test bump
- f3f82bb: test bump

## 0.3.0

### Minor Changes

- 2b140ed: change npm org from companydotcom to vastly

### Patch Changes

- Updated dependencies [2b140ed]
  - @vastly/utils@0.1.0

## 0.2.0

### Minor Changes

- 1ccfdc7: changeset ci setup

### Patch Changes

- @vastly/utils@0.0.1

## 0.1.0

### Minor Changes

- setting up cli ci config
