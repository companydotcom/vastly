# CompanyDotCom Generators

## File Structure

```
generator-{generatorName}
   |- app
     |- templates
       |-{Files to copy}
   |- index.js (This is where yo commands are)
```

## How to run a generator

1. make sure `yo` is installed globally (you may have to use `sudo`) `pnpm i -g yo`
2. if there is no `node_modules` folder in the `generators` directory, navigate into it via terminal
   and run `pnpm i`
   - this should generate a `node_modules` folder
3. navigate to the generator you wish to use and run `pnpm link`
4. run `yo {generator-name}` from any directory. The files will be copied into one level above your
   current working directory
