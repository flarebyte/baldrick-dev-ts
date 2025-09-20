# Baldrick-dev-ts

![npm](https://img.shields.io/npm/v/baldrick-dev-ts) ![Build
status](https://github.com/flarebyte/baldrick-dev-ts/actions/workflows/main.yml/badge.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/baldrick-dev-ts)

![npm type definitions](https://img.shields.io/npm/types/baldrick-dev-ts)
![node-current](https://img.shields.io/node/v/baldrick-dev-ts)
![NPM](https://img.shields.io/npm/l/baldrick-dev-ts)

> CLI utilities to help with Markdown hygiene and release checks for TypeScript packages (ESM).

The current scope is intentionally small and focused to reduce setup time and dev-dependencies.

- TypeScript (ESM) friendly
- Markdown checks and formatting (remark + Prettier-based normalisation)
- Release checks and publishing helper
- Minimal config; tools invoked via `npx`
- Requires Node.js >= 22

## Usage

Markdown: check and fix

```bash
# Check markdown under current repository (default extension .md)
npx baldrick-dev-ts markdown check --with-path-starting .

# Check markdown in .github/ only
npx baldrick-dev-ts markdown check --with-path-starting .github/

# Fix markdown formatting and line wrapping in-place
npx baldrick-dev-ts markdown fix --with-path-starting .
```

Release: dry-run check

```bash
# Check if the current version can be published (no publishing happens)
npx baldrick-dev-ts release check
```

Deprecated commands

- `lint` and `test` subcommands are no longer supported and only print a deprecation notice.

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

## Installation & running

This package is [ESM only](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77).

Run without installing globally:

```bash
npx baldrick-dev-ts --help
```

Or install locally in your project and add scripts:

```bash
yarn add -D baldrick-dev-ts
yarn baldrick-dev-ts --help
```

## Development

- Build: `yarn build`
- Lint: `yarn lint` (Biome via `npx @biomejs/biome@latest`)
- Unit tests: `yarn test:ci` (Node.js test runner)
- Coverage: `yarn test:cov` (via `npx c8@latest`)
- CLI smoke tests: `yarn test:pest` (baldrick-pest specs in `pest-spec/`)
