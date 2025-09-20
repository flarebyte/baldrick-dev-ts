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
- pico-accountancy: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; npx baldrick-dev-ts@latest lint check -s src test; npx baldrick-dev-ts@latest lint fix -s src test; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- baldrick-doc-ts: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- baldrick-broth: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- baldrick-zest-engine: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; npx baldrick-dev-ts@latest lint check -s src test; npx baldrick-dev-ts@latest lint fix -s src test; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check; npx baldrick-dev-ts@latest release ci
- baldrick-zest-mess: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; npx baldrick-dev-ts@latest lint check -s src test; npx baldrick-dev-ts@latest lint fix -s src test; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check; npx baldrick-dev-ts@latest release ci
- fairlie-functional: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- baldrick-pest: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- lunar-diamond-engraving: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- overview: npx baldrick-dev-ts@latest markdown check; npx baldrick-dev-ts@latest markdown fix
- lunar-obsidian-crypt: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- faora-kai: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- lunar-multiple-prism-beam: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- delimatrix_dart: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- validomix: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- eagleyeix: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- text_copperframe: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- slotboard_copperframe: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- grand_copperframe: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- message_copperframe: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- message_slot_bubblegum: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- document_slot_bubblegum: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- preview_slot_bubblegum: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- boolean_rhapsody: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- incy-wincy-code-bite: npx baldrick-dev-ts test check; npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest release check; npx baldrick-dev-ts@latest markdown check
- clingy-code-detective: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- kiwi_watermelon_store: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- elegant_fragment_copperframe: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- beaming-yggdrasil: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
- beaming-well-of-mimir: npx baldrick-dev-ts@latest markdown fix; npx baldrick-dev-ts@latest markdown fix -s .github/; baldrick markdown check; npx baldrick-dev-ts@latest markdown check -s .github/; npx baldrick-dev-ts@latest markdown check
