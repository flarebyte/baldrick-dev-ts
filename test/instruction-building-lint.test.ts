import { LintActionOpts, SupportedEcmaVersion } from '../src/model.js';
import { toLintInstructions } from '../src/instruction-building.js';
import { emptyFileFiltering } from '../src/path-filtering.js';

// https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions

const defaultOpts = {
  flags: [],
  ecmaVersion: 2021 as SupportedEcmaVersion,
  reportBase: 'report/lint-report',
  reportDirectory: 'report',
  reportPrefix: 'lint-report',
};

describe('Build instruction for linting', () => {
  it('lint some sources', () => {
    const given: LintActionOpts = {
      ...defaultOpts,
      fileSearching: {
        pathInfos: [],
        filtering: {
          ...emptyFileFiltering,
          withPathStarting: ['src/', 'test/'],
        },
        useGlob: 'auto',
      },
    };

    const actual = toLintInstructions(given);
    expect(actual).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "lint",
          "params": Object {
            "ecmaVersion": 2021,
            "extensions": Array [],
            "flags": Array [],
            "reportBase": "report/lint-report",
            "reportDirectory": "report",
            "reportPrefix": "lint-report",
            "targetFiles": Array [
              "src/",
              "test/",
            ],
          },
        },
      ]
    `);
  });
  it('lint some sources with extension', () => {
    const given: LintActionOpts = {
      ...defaultOpts,
      fileSearching: {
        pathInfos: [],
        filtering: {
          ...emptyFileFiltering,
          withPathStarting: ['test/'],
          withExtension: ['.specs.ts'],
        },
        useGlob: 'auto',
      },
    };

    const actual = toLintInstructions(given);
    expect(actual).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "lint",
          "params": Object {
            "ecmaVersion": 2021,
            "extensions": Array [
              ".specs.ts",
            ],
            "flags": Array [],
            "reportBase": "report/lint-report",
            "reportDirectory": "report",
            "reportPrefix": "lint-report",
            "targetFiles": Array [
              "test/",
            ],
          },
        },
      ]
    `);
  });
  it('lint some sources using tags for selecting files', () => {
    const given: LintActionOpts = {
      ...defaultOpts,
      fileSearching: {
        pathInfos: [
          { path: 'gen/step1.ts', tags: ['phase1'] },
          { path: 'gen/step2.ts', tags: ['phase2'] },
        ],
        filtering: { ...emptyFileFiltering, withTag: ['phase1'] },
        useGlob: 'auto',
      },
    };

    const actual = toLintInstructions(given);
    expect(actual).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "files",
          "params": Object {
            "targetFiles": Array [
              "gen/step1.ts",
            ],
          },
        },
        Object {
          "name": "lint",
          "params": Object {
            "ecmaVersion": 2021,
            "extensions": Array [],
            "flags": Array [
              "globInputPaths:false",
            ],
            "reportBase": "report/lint-report",
            "reportDirectory": "report",
            "reportPrefix": "lint-report",
            "targetFiles": Array [],
          },
        },
      ]
    `);
  });

  it('lint some sources loaded from a csv file', () => {
    const given: LintActionOpts = {
      ...defaultOpts,
      fileSearching: {
        pathInfos: [{ path: 'gen/schemas.csv', tags: ['@load'] }],
        filtering: { ...emptyFileFiltering, withTag: ['phase1'] },
        useGlob: 'auto',
      },
    };

    const actual = toLintInstructions(given);
    expect(actual).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "load",
          "params": Object {
            "targetFiles": Array [
              "gen/schemas.csv",
            ],
          },
        },
        Object {
          "name": "filter",
          "params": Object {
            "query": Array [
              "--with-tag",
              "phase1",
            ],
          },
        },
        Object {
          "name": "lint",
          "params": Object {
            "ecmaVersion": 2021,
            "extensions": Array [],
            "flags": Array [
              "globInputPaths:false",
            ],
            "reportBase": "report/lint-report",
            "reportDirectory": "report",
            "reportPrefix": "lint-report",
            "targetFiles": Array [],
          },
        },
      ]
    `);
  });

  it('lint and fix some sources', () => {
    const given: LintActionOpts = {
      ...defaultOpts,
      flags: ['aim:fix'],
      fileSearching: {
        pathInfos: [],
        filtering: {
          ...emptyFileFiltering,
          withPathStarting: ['src/', 'test/'],
          withoutPathSegment: ['fixture'],
        },
        useGlob: 'auto',
      },
    };

    const actual = toLintInstructions(given);
    expect(actual).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "glob",
          "params": Object {
            "targetFiles": Array [
              "src/**/*",
              "test/**/*",
            ],
          },
        },
        Object {
          "name": "filter",
          "params": Object {
            "query": Array [
              "--with-path-starting",
              "src/",
              "test/",
              "--without-path-segment",
              "fixture",
            ],
          },
        },
        Object {
          "name": "lint",
          "params": Object {
            "ecmaVersion": 2021,
            "extensions": Array [],
            "flags": Array [
              "globInputPaths:false",
              "aim:fix",
            ],
            "reportBase": "report/lint-report",
            "reportDirectory": "report",
            "reportPrefix": "lint-report",
            "targetFiles": Array [],
          },
        },
      ]
    `);
  });
});
