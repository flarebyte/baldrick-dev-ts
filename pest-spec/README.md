Pest Specs for baldrick-dev-ts

This folder contains specs for running CLI smoke tests using baldrick-pest.

How to run

- Ensure dependencies are installed (for building and running the CLI locally):
  - `yarn install`
  - `yarn build` (or use `yarn cli` directly via tsx)

- Run the pest spec with npx:
  - `npx baldrick-pest@latest run -f pest-spec/markdown-validate.yaml`

What it does

- `markdown-validate.yaml` defines two tests:
  - valid-markdown: runs `yarn cli markdown check` against `pest-spec/fixtures/valid/` and expects no markdown lint failures in stderr.
  - invalid-markdown: runs the same command against `pest-spec/fixtures/invalid/` and expects to see a failure message in stderr.

Notes

- The CLI prints markdown lint findings to stderr (via the project’s error formatter). The tests check for the presence/absence of the string `Linting markdown failed`.
- You can tweak the fixtures to exercise other rules; current invalid sample uses a `*` unordered list marker which violates the configured marker style.

