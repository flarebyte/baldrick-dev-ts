# Code Analysis

## Overview
Baldrick-dev-ts is a CLI that standardizes TypeScript library development tasks in ESM projects. It orchestrates linting (ESLint), testing (Jest), Markdown checks/fixes (Prettier + Remark), and release publishing, exposing consistent commands and filters.

## CLI Commands & Features
- Lint: `baldrick lint <aim>` — aims: `check|fix|ci`; supports ECMAScript version and style flags.
- Test: `baldrick test <aim>` — aims: `check|cov|watch|fix|ci`; supports `--display-name`.
- Markdown: `baldrick markdown <aim>` — aims: `check|fix|ci`; fixes with Prettier and validates with Remark.
- Release: `baldrick release <aim>` — aims: `check|ci`; verifies publishability, then `npm publish` and GitHub release.
- Library entry exports a configured `Commanding` instance (`src/index.ts`).

## File Selection & Filtering
All actions can target files via a unified filter model:
- Sources: explicit files (`files`), loaded lists (`load`), or globbing (`glob`).
- Filters: `with/without-path-starting`, `with/without-extension`, `with/without-path-segment`, `with/without-tag`, `with/without-tag-starting`.
- Queries are composed then applied to `PathInfo[]` before final action execution.

## Linting (ESLint)
- Config computed at runtime (`computeEsLintConfig`) with plugins: TypeScript, Prettier, Jest, Import, Unicorn.
- Flags: `aim:fix` enables autofix; `paradigm:fp` relaxes certain Unicorn rules.
- Output: human/compact text and CI artifacts (`reportBase.{json,junit.xml}`).

## Testing (Jest)
- Runtime config via `computeJestConfig`; ESM enabled via `NODE_OPTIONS=--experimental-vm-modules`.
- Flags: `aim:fix` adds `--updateSnapshot`.
- Outputs timing + runs with dynamically built argv; supports coverage via `aim:cov`.

## Markdown Processing
- Fix: Prettier with custom normalization + secondary Remark pass.
- Check: Remark presets (consistent + recommended + GFM) and specific lint rules (headings, lists, markers, lengths). JSON report per file in `report/`.

## Release Workflow
- Validates publishability based on `package.json` vs remote `yarn info`.
- `aim:check` performs a dry-check; otherwise runs `npm publish` and `gh release`.
- Emits context and version summaries for traceability.

## Reporting & UX
- Terminal formatting with intro/info/success phases; durations measured for glob, lint, test, markdown.
- Reports written under `report/` with `{reportBase, reportDirectory, reportPrefix}` controls.

## Extensibility
- Micro-instruction pipeline (`files|load|glob|filter|lint|test|markdown`) composed per action.
- Central command wiring in `Commanding` with typed models for options and flags.

## Usage Across Flarebyte Repos
| Project | lint check | lint fix | lint ci | test check | markdown check | markdown fix | release check | release ci |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| [baldrick-broth](https://github.com/flarebyte/baldrick-broth) |  |  |  | ✓ | ✓ | ✓ | ✓ |  |
| [baldrick-doc-ts](https://github.com/flarebyte/baldrick-doc-ts) |  |  |  | ✓ | ✓ | ✓ | ✓ |  |
| [baldrick-pest](https://github.com/flarebyte/baldrick-pest) |  |  |  | ✓ | ✓ | ✓ | ✓ |  |
| [baldrick-zest-engine](https://github.com/flarebyte/baldrick-zest-engine) | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| [baldrick-zest-mess](https://github.com/flarebyte/baldrick-zest-mess) | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| [beaming-well-of-mimir](https://github.com/flarebyte/beaming-well-of-mimir) |  |  |  |  | ✓ | ✓ |  |  |
| [beaming-yggdrasil](https://github.com/flarebyte/beaming-yggdrasil) |  |  |  |  | ✓ | ✓ |  |  |
| [boolean_rhapsody](https://github.com/flarebyte/boolean_rhapsody) |  |  |  |  | ✓ | ✓ |  |  |
| [clingy-code-detective](https://github.com/flarebyte/clingy-code-detective) |  |  |  |  | ✓ | ✓ |  |  |
| [delimatrix_dart](https://github.com/flarebyte/delimatrix_dart) |  |  |  |  | ✓ | ✓ |  |  |
| [document_slot_bubblegum](https://github.com/flarebyte/document_slot_bubblegum) |  |  |  |  | ✓ | ✓ |  |  |
| [eagleyeix](https://github.com/flarebyte/eagleyeix) |  |  |  |  | ✓ | ✓ |  |  |
| [elegant_fragment_copperframe](https://github.com/flarebyte/elegant_fragment_copperframe) |  |  |  |  | ✓ | ✓ |  |  |
| [fairlie-functional](https://github.com/flarebyte/fairlie-functional) |  |  |  | ✓ | ✓ | ✓ | ✓ |  |
| [faora-kai](https://github.com/flarebyte/faora-kai) |  |  |  | ✓ | ✓ | ✓ | ✓ |  |
| [grand_copperframe](https://github.com/flarebyte/grand_copperframe) |  |  |  |  | ✓ | ✓ |  |  |
| [incy-wincy-code-bite](https://github.com/flarebyte/incy-wincy-code-bite) |  |  |  | ✓ | ✓ | ✓ | ✓ |  |
| [kiwi_watermelon_store](https://github.com/flarebyte/kiwi_watermelon_store) |  |  |  |  | ✓ | ✓ |  |  |
| [lunar-diamond-engraving](https://github.com/flarebyte/lunar-diamond-engraving) |  |  |  | ✓ | ✓ | ✓ | ✓ |  |
| [lunar-multiple-prism-beam](https://github.com/flarebyte/lunar-multiple-prism-beam) |  |  |  | ✓ | ✓ | ✓ | ✓ |  |
| [lunar-obsidian-crypt](https://github.com/flarebyte/lunar-obsidian-crypt) |  |  |  | ✓ | ✓ | ✓ | ✓ |  |
| [message_copperframe](https://github.com/flarebyte/message_copperframe) |  |  |  |  | ✓ | ✓ |  |  |
| [message_slot_bubblegum](https://github.com/flarebyte/message_slot_bubblegum) |  |  |  |  | ✓ | ✓ |  |  |
| [overview](https://github.com/flarebyte/overview) |  |  |  |  | ✓ | ✓ |  |  |
| [pico-accountancy](https://github.com/flarebyte/pico-accountancy) | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ |  |
| [preview_slot_bubblegum](https://github.com/flarebyte/preview_slot_bubblegum) |  |  |  |  | ✓ | ✓ |  |  |
| [slotboard_copperframe](https://github.com/flarebyte/slotboard_copperframe) |  |  |  |  | ✓ | ✓ |  |  |
| [text_copperframe](https://github.com/flarebyte/text_copperframe) |  |  |  |  | ✓ | ✓ |  |  |
| [validomix](https://github.com/flarebyte/validomix) |  |  |  |  | ✓ | ✓ |  |  |
