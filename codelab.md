### Angular + Bazel Codelab

#### Step 1: Create a page

Before doing the lab please make sure the application runs without errors.

1. Navigate to the app directory
```bash
$ cd src/app
```

2. Generate a new module todo using Angular CLI.
```bash
$ ng generate module todo -m app
```

3. Generate a new component called `ToDo`
```bash
$ ng g c Todo -m todo --export
```
* it will generate the following files:
  * `app/todo/todo.component.scss`
  * `app/todo/todo.component.html`
  * `app/todo/todo.component.ts`
  * `app/todo/todo.component.spec.ts`
* It will also update todo module `app/todo/todo.module.ts`

4. Create `BUILD.bazel` file in `app/todo`
5. Define a package by adding the following rule to the file:
```
package(default_visibility = ["//:__subpackages__"])
```
6. Define a module and add ts files:

Import `ng_module` rule:
```
load("//tools:ng_module.bzl", "ng_module")
```

Define a module:
```
ng_module(
    name = "todo",
    srcs = glob(
        include = [
            "todo.component.ts",
            "todo.module.ts",
        ],
    ),
    angular_assets = [
        "todo.component.html",
    ],
    deps = 
        "@npm//@angular/common",
        "@npm//@angular/core",
    ],
)
```
7. Now we need to add styles to the module:

Import sass rule:
```
load("@io_bazel_rules_sass//:defs.bzl", "sass_binary")
```

Define a rule for scss:
```
sass_binary(
    name = "todo_styles",
    src = "todo.component.scss",
)
```
Then add it to `todo` module

```
    angular_assets = [
        "todo.component.html",
        ":todo_styles",
    ],
```

8. Now we could add `todo` module to `app`.

Open /app/BUILD.bazel
Add todo module to app deps:
```
...
    deps = [
        ...
        "@npm//rxjs",
        "//src/app/todo"
    ],
...
```

8. Connect todo files to lint
```
load("//tools:ts_lint.bzl", "ts_lint")

tslint()
```

9. Open `app-routing` and define a todo route.
```
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TodoComponent} from './todo/todo.component';

const routes: Routes = [
  {
    path: 'todo',
    component: TodoComponent,
  },
];

/**
  Main application routes module.
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

```

10. You could run the application and go to `http://localhost:8080/todo` to see if changes are applied correctly.


#### Step 2: Add rules for testing.

1. Let's run test script:

```bash
$ npm run test
# or
$ bazel test --nobuild_runfile_links //src/...
```

You probably could see that some steps could be failed. If you run bazel with `--test_output=all` flag, you could see the result in a terminal. Otherwise, you could check it in `tests.log` file, path to that you could see in the terminal or run directly.

For instance:

You see the following output:
```
//src/app:lint                                                           FAILED in 3.9s
  /**/angular_bazel/bazel-out/*-fastbuild/testlogs/src/app/lint/test.log
```
You could open `/**/angular_bazel/bazel-out/*-fastbuild/testlogs/src/app/lint/test.log`
or run
```
bazel run //src/app:lint
```
to see what went wrong.


2. Once tests run without issues let's add our todo module to it.
   Open app/todo/BAZEL.build file.

Import `ts_test_project` rule:
```
load("//tools:typescript.bzl", "ts_test_project")
```

Define tests module:
```
ts_test_project(
    name = "test_lib",
    srcs = glob(["*.spec.ts"]),
    deps = [
        ":todo",
        "@npm//@angular/core",
        "@npm//@angular/platform-browser",
    ],
)
```

3. Attach `test_lib` to the app package.
   Open `app/BUILD.bazel` and add `//src/app/todo:test_lib` to `karma_web_test_suite` rule.

```
karma_web_test_suite(
    name = "test",
    # do not sort
    bootstrap = [
        "@npm//:node_modules/zone.js/dist/zone-testing-bundle.js",
        "@npm//:node_modules/reflect-metadata/Reflect.js",
    ],
    browsers = [
        "@io_bazel_rules_webtesting//browsers:chromium-local",
    ],
    specs = [
        "//src:initialize_testbed.js",
        ":test_lib",
        "//src/app/todo:test_lib",
    ],
    deps = [
        ":test_lib",
        "//src/app/todo:test_lib",
        "//src:initialize_testbed",
    ],
)
```
Now you can run app tests and see that todo tests were executed.

4. Add linter.
```
load("//tools:ts_lint.bzl", "ts_lint")

...

ts_lint()
```

If you run `bazel tests` you will see that linter was executed in todo package.

Congratulations! You completed the codelab :)