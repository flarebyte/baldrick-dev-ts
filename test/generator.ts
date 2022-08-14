import fs from 'fs-extra';

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

export const createTempDirsSync = (subfolder: string): string => {
  const suffix = randomBetween(1, 1000000);
  const tempFolder = `temp/${subfolder}/temp${suffix}`;
  fs.ensureDirSync(`${tempFolder}/src`);
  fs.ensureDirSync(`${tempFolder}/test`);
  fs.ensureDirSync(`${tempFolder}/schemas`);
  fs.ensureDirSync(`${tempFolder}/data`);
  return tempFolder;
};

export const emptyTempDir = (subfolder: string) => fs.emptyDirSync(`temp/${subfolder}/`);

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

export const tsconfigNode = (configVersion: 'es2021') =>
  createFileContent(
    'tsconfig.json',
    JSON.stringify(
      {
        $schema: 'https://json.schemastore.org/tsconfig',
        display: configVersion,

        compilerOptions: {
          lib: [configVersion],
          module: configVersion,
          target: configVersion,
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          declaration: true,
          newLine: 'lf',
          noImplicitReturns: true,
          noImplicitOverride: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
          noUncheckedIndexedAccess: true,
          noPropertyAccessFromIndexSignature: true,
          noEmitOnError: true,
          useDefineForClassFields: true,
        },
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

// https://json-schema.org/learn/miscellaneous-examples.html

const personSchemaObj = {
  $id: 'https://example.com/person.schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Person',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      description: "The person's first name.",
    },
    lastName: {
      type: 'string',
      description: "The person's last name.",
    },
    age: {
      description: 'Age in years which must be equal to or greater than zero.',
      type: 'integer',
      minimum: 0,
    },
  },
};

export const personSchema = createFileContent(
  'schemas/author.schema.json',
  JSON.stringify(personSchemaObj, null, 2)
);

export const author = (firstName: string, lastName: string, age: number) =>
  createFileContent(
    `data/author-${lastName}.json`,
    JSON.stringify(
      {
        firstName,
        lastName,
        age,
      },
      null,
      2
    )
  );

export const authorList = (names: string[]) =>
  createFileContent(
    'author-list.csv',
    names.map((lastName) => `data/author-${lastName}.json`).join('\n')
  );

export const loadSelection: FileContent = createFileContent(
  'load.txt',
  ['src/index.ts', 'src/problematic.ts;buggy'].join('\n')
);
