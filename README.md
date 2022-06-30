# Example Angular app using Bazel


## Installation

1. Install Bazel following instructions at http://bazel.build. 
2. Install ibazel, which is a watch mode for Bazel not included in the standard distribution. See https://github.com/bazelbuild/bazel-watcher#installation.  
    > You simply run `bazel` commands shown below, and don't need to install NodeJS, yarn, or any other dependencies.
4. Clone the application

## Development

First we'll run the development server:

```bash
$ npm run serve
# or
$ ibazel run //src:devserver
```

This runs in "watch mode", which means it will watch any files that are inputs to the `devserver`, and when they change it will ask Bazel to re-build them.
When the re-build is finished, it will trigger a LiveReload in the browser.

This command prints a URL on the terminal. Open that page to see the demo app running.
Now you can edit one of the source files (`src/lib/file.ts` is an easy one to understand and see the effect).
As soon as you save a change, the app should refresh in the browser with the new content.
Our intent is that this time is less than two seconds, even for a large application.

Ctrl-C twice to kill the `devserver`.

## Testing

We can run all the unit tests:

```bash
$ npm run test
# or
$ bazel test --nobuild_runfile_links //src/...
```

`--nobuild_runfile_links` is added as a workaround to run Chromium for macOS/Windows in Bazel. [More details here](https://github.com/bazelbuild/bazel/issues/4327#issuecomment-922106293)

## Production

We can run the application in production mode, where the code has been bundled and optimized.
This can be slower than the development mode, because any change requires re-optimizing the app.
This example uses Rollup and Uglify, but other bundlers can be integrated with Bazel.

```bash
$ npm run serve-prod
# or
$ bazel run //src:prodserver
```

## Clean Bazel output
If you want to clean bazel output, you could run:

```bash
$ npm run clean
# or
$ bazel clean
```

## Npm dependencies

Having a local `node_modules` folder setup by `yarn` or `npm` is not necessary when building this example with Bazel.
This example makes use of Bazel managed npm dependencies (https://bazelbuild.github.io/rules_nodejs/dependencies.html) which means Bazel will setup the npm dependencies in your `package.json` for you outside of your local workspace for use in the build.

However, you may still want to run `yarn` or `npm` to manually setup a local `node_modules` folder for editor and tooling support.

