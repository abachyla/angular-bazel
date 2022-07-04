"""Helper macros for compiling typescript with consistent config"""

load("@npm//@bazel/typescript:index.bzl", _ts_project = "ts_project")
load("//tools:ts_lint.bzl", "ts_lint")

def ts_project(name, tsconfig = "//src:tsconfig", **kwargs):
    _ts_project(
        name = name,
        tsconfig = tsconfig,
        declaration = True,
        declaration_map = True,
        **kwargs
    )

def ts_test_project(name, tsconfig = "//src:tsconfig_test", deps = [], **kwargs):
    _ts_project(
        name = name,
        testonly = 1,
        tsconfig = tsconfig,
        deps = deps + ["@npm//@types/node", "@npm//@types/jasmine", "@npm//jasmine"],
        declaration = True,
        declaration_map = True,
        **kwargs
    )

    ts_lint()
