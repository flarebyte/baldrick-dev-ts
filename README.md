# Baldrick-dev-ts

![npm](https://img.shields.io/npm/v/baldrick-dev-ts) ![Build
status](https://github.com/flarebyte/baldrick-dev-ts/actions/workflows/main.yml/badge.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/baldrick-dev-ts)

![npm type definitions](https://img.shields.io/npm/types/baldrick-dev-ts)
![node-current](https://img.shields.io/node/v/baldrick-dev-ts)
![NPM](https://img.shields.io/npm/l/baldrick-dev-ts)

> CLI for the package development of Typescript library in ESM format.

The main motivation is to reduce the amount of dev dependencies that needs to
be installed and configured individually.

-   **Typescript** the strongly typed alternative to Javascript.

-   **Reduced configuration** the CLI should be ready go without further
    configuration.

-   **ESLint** under the hood for linting.

-   **Jest** under the hood for testing (very experimental)

-   **ES2020** or later.

## Usage

Statically analyzes the default source folder to quickly find problems:

`baldrick lint check`

Fix problems in the default source folder:

`baldrick lint fix`

Run unit tests:

`baldrick test check`

Update snapshots for unit test:

`baldrick test fix`

## Acknowledgements

`baldrick-dev-ts` was initially created as a fork of the brilliant
[tsdx](https://github.com/jaredpalmer/tsdx) project.
Eventually, the code has been massively refactored to match the new
requirements, and very little remain of the `tsdx` starting point, except our
gratitude to this initial project.

## Documentation and links

-   [Code Maintenance](MAINTENANCE.md)
-   [Code Of Conduct](CODE_OF_CONDUCT.md)
-   [Api for baldrick-dev-ts](API.md)
-   [Contributing](CONTRIBUTING.md)
-   [Glossary](GLOSSARY.md)
-   [Diagram for the code base](INTERNAL.md)
-   [Vocabulary used in the code base](CODE_VOCABULARY.md)
-   [Architectural Decision Records](DECISIONS.md)
-   [Contributors](https://github.com/flarebyte/baldrick-dev-ts/graphs/contributors)
-   [Dependencies](https://github.com/flarebyte/baldrick-dev-ts/network/dependencies)

## Installation

This package is [ESM
only](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77).

```bash
yarn global add baldrick-dev-ts
baldrick --help
```

Or alternatively run it:

```bash
npx baldrick-dev-ts --help
```

If you want to tun the latest version from github. Mostly useful for dev:

```bash
git clone git@github.com:flarebyte/baldrick-dev-ts.git
yarn global add `pwd`
```
