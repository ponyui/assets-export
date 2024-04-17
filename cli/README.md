## Testing locally

Run `npm link ./cli` from the workspace root folder.

Now you can use `npx ponyui-a` command to access cli.

## Publishing to npm

- Log in to npm using `npm login`
- Run `npm publish`

And there you have it, your package should be available at https://www.npmjs.com/.

Before publishing new version don't forget to run `npm version <whatever>` to bump the version.

## Publish to npm using Github Actions

https://hackernoon.com/publishing-a-nodejs-cli-tool-to-npm-in-less-than-15-minutes
