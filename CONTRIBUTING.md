# Guide on Git process and contributing to the Wave repo

## Submodules

The vastly repo uses git submodules to let us separate concerns for other non-technical contributors
(such as design or product)

### After fresh clone

When you clone this repo, or if your submodule files are missing, you will have to initialize the
submodules. Do this by running the command

```bash
git submodule update --init
```

### Contributing to the submodule from this repo

From the vastly repo, if you want to modify the submodule, you **must first cd into that
submodule**. For example, `cd apps/docs/pages` will switch your terminal to that submodules current
branch. Be sure to keep track of which branch you are on - main branch, develop, or feature branch
etc.

### Pulling submodules changes into this repo

First, you must cd into the submodule. From there, switch to the branch you want to pull from
(whether its the `main` branch or another). From there, run `git pull origin <branch>` or just
`git pull` to keep everything up to date

### Deploying Docs App

When any content from the pages submodule is merged into the `main` branch, it should auto deploy to
Vercel. In the event it does not, from the root of this repo, run `vercel login` to log into your
account if you arent already, run `vercel link` to link the project to the `wave-docs` project, then
run `vercel deploy`

## Publishing Packages

In order to publish public packages to NPM run `pnpm changeset` then `pnpm changeset version` commit
your changes, that's it. When your branch is merged into `main` it will be automatically published
to NPM.
