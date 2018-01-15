![](https://raw.githubusercontent.com/decentraland/web/gh-pages/img/decentraland.ico)

# Commons

Set of common functionality accross Decentraland projects.

### Scripts

**lint**

Lint js files with `eslint`

**docs**

Builds an static page with the JSDoc documentation

**test**

Run tests using mocha and chai

### ENV

To get a global overview of the ENV variables used, take a look at `.env.example`.

### Dependencies

**babel-polyfill**
If you're using `decentraland-commons` as a dependency without using `babel-node` you'll need to add an `import 'babel-polyfill'` to your code's entrypoint.

**IMPORTANT**

If you make a breaking change or fix a critial bug please alert the users of the lib so they can update their projects accordingly
