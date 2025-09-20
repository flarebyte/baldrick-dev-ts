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
| baldrick-broth |  |  |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| baldrick-doc-ts |  |  |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| baldrick-pest |  |  |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| baldrick-zest-engine | npx baldrick-dev-ts@latest lint check -s src test | npx baldrick-dev-ts@latest lint fix -s src test |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check | npx baldrick-dev-ts@latest release ci |
| baldrick-zest-mess | npx baldrick-dev-ts@latest lint check -s src test | npx baldrick-dev-ts@latest lint fix -s src test |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check | npx baldrick-dev-ts@latest release ci |
| beaming-well-of-mimir |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| beaming-yggdrasil |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| boolean_rhapsody |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| clingy-code-detective |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| delimatrix_dart |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| document_slot_bubblegum |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| eagleyeix |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| elegant_fragment_copperframe |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| fairlie-functional |  |  |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| faora-kai |  |  |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| grand_copperframe |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| incy-wincy-code-bite |  |  |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| kiwi_watermelon_store |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| lunar-diamond-engraving |  |  |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| lunar-multiple-prism-beam |  |  |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| lunar-obsidian-crypt |  |  |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| message_copperframe |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| message_slot_bubblegum |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| overview |  |  |  |  | npx baldrick-dev-ts@latest markdown check | npx baldrick-dev-ts@latest markdown fix |  |  |
| pico-accountancy | npx baldrick-dev-ts@latest lint check -s src test | npx baldrick-dev-ts@latest lint fix -s src test |  | npx baldrick-dev-ts test check | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ | npx baldrick-dev-ts@latest release check |  |
| preview_slot_bubblegum |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| slotboard_copperframe |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| text_copperframe |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
| validomix |  |  |  |  | baldrick markdown check<br>npx baldrick-dev-ts@latest markdown check<br>npx baldrick-dev-ts@latest markdown check -s .github/ | npx baldrick-dev-ts@latest markdown fix<br>npx baldrick-dev-ts@latest markdown fix -s .github/ |  |  |
