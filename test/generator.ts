import fs from 'fs-extra';
import { ToolOptions } from '../src/model';

interface FileContent {
  path: string;
  content: string;
}
export const createFileContent = (path: string, content: string) => ({
  path,
  content,
});

export const createPackageJson = (name: string): FileContent => ({
  path: 'package.json',
  content: JSON.stringify(
    {
      name,
      dependencies: {},
      devDependencies: { jest: '^27.0.6' },
      engines: {
        node: '>=14',
      },
    },
    null,
    2
  ),
});

export const createToolOptions = (toolOpts: ToolOptions): FileContent => ({
  path: '.baldrick-dev.json',
  content: JSON.stringify(toolOpts, null, 2),
});

const prettierConfig = {
  printWidth: 80,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
};

export const prettierContent: FileContent = {
  path: '.prettierrc',
  content: JSON.stringify(prettierConfig, null, 2),
};

const randomBetween = (low: number, high: number): number =>
  Math.ceil(Math.random() * (high - low) + low);

export const createTempDirsSync = (): string => {
  const suffix = randomBetween(1, 1000000);
  const tempFolder = `temp/temp${suffix}`;
  fs.ensureDirSync(`${tempFolder}/src`);
  fs.ensureDirSync(`${tempFolder}/test`);
  return tempFolder;
};

export const emptyTempDir = () => fs.emptyDirSync('temp');

export const createTestingFilesSync = (
  modulePath: string,
  fileContents: FileContent[]
) => {
  fileContents.forEach((fileContent) =>
    fs.writeFileSync(`${modulePath}/${fileContent.path}`, fileContent.content)
  );
};

const additionTs = `
export const sum = (a: number, b: number) => {
  return a + b;
};
`;

const addPrefixTs = `
export const addPrefix = (text: string) => {
  return "prefix" + text;
};
`;

export const indexTs: FileContent = createFileContent(
  'src/index.ts',
  [additionTs, addPrefixTs].join('\n')
);

const fullOfProblemLint = `
function addOne(i) {
  if (i != NaN) {
      return i ++
  } else {
    return
  }
};
`;
export const problematicTs: FileContent = createFileContent(
  'src/problematic.ts',
  fullOfProblemLint
);

const additionTestTs = `
import { sum } from '../src';

describe('sum', () => {
  it('adds two numbers together', () => {
    expect(sum(1, 1)).toEqual(2);
  });
});
`;

export const indexTestTs: FileContent = createFileContent(
  'test/index.test.ts',
  additionTestTs
);

const readmeLint = `
# test readme
> Basic markdown description
`;
export const readmeMd: FileContent = createFileContent('README.md', readmeLint);

const tsconfigEsNextJson = {
  // see https://www.typescriptlang.org/tsconfig to better understand tsconfigs
  include: ['src', 'types'],
  compilerOptions: {
    module: 'esnext',
    lib: ['dom', 'esnext'],
    importHelpers: true,
    // output .d.ts declaration files for consumers
    declaration: true,
    // output .js.map sourcemap files for consumers
    sourceMap: true,
    // match output dir to input dir. e.g. dist/index instead of dist/src/index
    rootDir: './src',
    // stricter type-checking for stronger correctness. Recommended by TS
    strict: true,
    // linter checks for common issues
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    // noUnused* overlap with @typescript-eslint/no-unused-vars, can disable if duplicative
    noUnusedLocals: true,
    noUnusedParameters: true,
    // use Node's module resolution algorithm, instead of the legacy TS one
    moduleResolution: 'node',
    // transpile JSX to React.createElement
    jsx: 'react',
    // interop between ESM and CJS modules. Recommended by TS
    esModuleInterop: true,
    // significant perf increase by skipping checking .d.ts files, particularly those in node_modules. Recommended by TS
    skipLibCheck: true,
    // error out if import and file system have a casing mismatch. Recommended by TS
    forceConsistentCasingInFileNames: true,
    // `tsdx build` ignores this option, but it is commonly used when type-checking separately with `tsc`
    noEmit: true,
  },
};

export const tsconfigEsNext: FileContent = createFileContent(
  'tsconfig.json',
  JSON.stringify(tsconfigEsNextJson, null, 2)
);

export const tsconfigNode = (configVersion: 'node14' | 'node16') =>
  createFileContent(
    'tsconfig.json',
    JSON.stringify(
      {
        extends: `@tsconfig/${configVersion}/tsconfig.json`,
      },
      null,
      2
    )
  );

const editorConfigSimple = `
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
  `;

export const editorConfig: FileContent = createFileContent(
  '.editorconfig',
  editorConfigSimple
);
