![](https://raw.githubusercontent.com/decentraland/web/gh-pages/img/decentraland.ico)

# Commons

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
