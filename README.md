![](https://raw.githubusercontent.com/decentraland/web/gh-pages/img/decentraland.ico)

# Commons [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


Set of common functionality accross Decentraland projects.

### Scripts

**build**

Build the lib for use

**lint**

Lint js files with `eslint`

**docs**

Builds an static page with the JSDoc documentation

**test**

Run tests using mocha and chai

### Dependencies

**babel-polyfill**
If you're using `decentraland-commons` as a dependency without using `babel-node` you'll need to add an `import 'babel-polyfill'` to your code's entrypoint.

### Release

We use [semantic-release](https://github.com/semantic-release/semantic-release) to automate the release process of this package. Every time we merge to `master`, the CI will run `semantic-release` and it will publish a new version of the package. It will determine the next version of the package and it will generate release notes from the commit messages. That's why we enforce the following format for commit messages:

```
type: message
```

or

```
type(scope): messages
```

for example

```
feature(Map): added zoom levels
```

We use [husky](https://github.com/typicode/husky) and [validate-commit-msg](https://www.npmjs.com/package/validate-commit-msg) to enfore this format on every commit.

