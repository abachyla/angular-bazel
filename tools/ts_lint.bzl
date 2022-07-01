load("@npm//eslint:index.bzl", _eslint_test = "eslint_test")

def ts_lint(name = None, args = [], **kwargs):
 srcs = native.glob(["**/*.js", "**/*.ts"])

 _eslint_test(
     name = "lint",
     data = srcs + [
         "//:.gitignore",
         "//:.eslintrc.json",
         "//src:tsconfig.json",
         "@npm//@typescript-eslint/parser",
         "@npm//@typescript-eslint/eslint-plugin",
         "@npm//@angular-eslint/eslint-plugin",
         "@npm//@angular-eslint/eslint-plugin-template",
         "@npm//@angular-eslint/template-parser",
         "@npm//@angular-eslint/schematics",
         "@npm//eslint-plugin-import",
         "@npm//eslint-config-google",
     ],
     args = args + ["--ignore-path", "$(location //:.gitignore)"] +
            ["$(location " + x + ")" for x in srcs],
     tags = ["lint"]
 )
