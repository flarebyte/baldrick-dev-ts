# Baldrick-dev-ts

![npm](https://img.shields.io/npm/v/baldrick-dev-ts)

![Build status](https://github.com/flarebyte/baldrick-dev-ts/actions/workflows/main.yml/badge.svg)

![npm bundle size](https://img.shields.io/bundlephobia/min/baldrick-dev-ts)

![Dependencies](https://status.david-dm.org/gh/flarebyte/baldrick-dev-ts.svg)

![npm type definitions](https://img.shields.io/npm/types/baldrick-dev-ts)

![node-current](https://img.shields.io/node/v/baldrick-dev-ts)

![NPM](https://img.shields.io/npm/l/baldrick-dev-ts)

> CLI for the package development of Typescript library in ESM format.

The main motivation is to reduce the amount of dev dependencies that needs to be installed and configured individually.

-   **Typescript** the strongly typed alternative to Javascript.
-   **Reduced configuration** the CLI should be ready go without further configuration.
-   **ESLint** under the hood for linting.
-   **Jest** under the hood for testing.
-   **ES2020** or later.

## Usage

### Linting

Usage:  `baldrick lint [options] <aim>`

-   Arguments:
-   `aim`                                                   Specify the aim for linting (choices: "check", "fix", "ci")

-   Options:
-   `-rb, --report-base [reportBase...]`                    Specify the base name for reporting (default: "report/lint-report")
-   `-s, --with-path-starting [withPathStarting...]`        Specify a list of expected prefixes for the path (any will match) (default: ["src"])
-   `-S, --without-path-starting [withoutPathStarting...]` Exclude a list of unwanted prefixes for the path (default: \[])
-   `-e, --with-extension [withExtension...]`              Specify a list of expected suffixes for the path (any will match) (default: \[])
-   `-E, --without-extension [withoutExtension...]`         Exclude a list of unwanted suffixes for the path (default: \[])
-   `-s, --with-path-segment [withPathSegment...] `         Specify a list of expected texts that should be part of the path (any will match) (default: \[])
-   `-S, --without-path-segment [withoutPathSegment...]`   Exclude a list of unwanted texts that should not be part of the path (default: \[])
-   `-t, --with-tag [withTag...]`                           Specify a list of expected tags (any will match) (default: \[])
-   `-T, --without-tag [withoutTag...]`                     Exclude a list of unwanted tags (default: \[])
-   `-p, --with-tag-starting [withTagStarting...]`          Specify a list of expected prefixes for the tag (any will match) (default: \[])
-   `-P, --without-tag-starting [withoutTagStarting...]`    Exclude a list of unwanted prefixes for the tag (default: \[])
-   `-ecma, --ecma-version [ecmaVersion...]`                Specify the ECMAScript version (choices: "2020", "2021", default: "2020")

Statically analyzes the default source folder to quickly find problems:

`baldrick lint check`

Fix problems in the default source folder:

`baldrick lint fix`

### Testing

Usage: `baldrick test [options] <aim>`

-   Arguments:
`aim`                                            Specify the aim for testing (choices: "check", "cov", "watch", "fix", "ci")

-   Options:

-   `-rb, --report-base [reportBase...]`              Specify the base name for reporting (default: "report/test-report")\`
-   `-name, --display-name [displayName...]`          Allows for a label to be printed alongside a test while it is running (default: "main")
-   `-s, --with-path-starting [withPathStarting...]`  Specify a list of expected prefixes for the path (any will match) (default: ["test"])

Run unit tests:

`baldrick test check`

Update snapshots for unit test:

`baldrick test fix`

## Acknowledgements

`baldrick-dev-ts` was initially created as a fork of the brilliant [tsdx](https://github.com/jaredpalmer/tsdx) project.
Eventually, the code has been massively refactored to match the new requirements, and very little remain of the `tsdx` starting point, except our gratitude to this initial project.

## Documentation and links

* [Code Maintenance](MAINTENANCE.md)
* [Code Of Conduct](CODE_OF_CONDUCT.md)
* [Contributing](CONTRIBUTING.md)
* [Contributors](https://github.com/flarebyte/baldrick-dev-ts/graphs/contributors)
* [Dependencies](https://github.com/flarebyte/baldrick-dev-ts/network/dependencies)

## Installation

This package is [ESM only][esm].
```
yarn global add baldrick-dev-ts
baldrick --help
```
Or alternatively run it:
```
npx baldrick-dev-ts --help
```