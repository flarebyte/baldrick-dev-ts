import {jest} from '@jest/globals';
import { Commanding } from '../src/commanding.js';
import {
  author,
  authorList,
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  editorConfig,
  emptyTempDir,
  indexTestTs,
  indexTs,
  personSchema,
  prettierContent,
  readmeMd,
  tsconfigNode,
} from './generator';

interface Example {
  given: string[];
}

const authorExamples: Example[] = [
  {
    given: [
      'find:',
      'data/*.json',
      'with-path-containing:',
      'author',
      'check-json-schema:',
      'schemas/author.schema.json',
    ],
  },
  {
    given: [
      'read-list:',
      'author-list.csv',
      'with-path-containing:',
      'author',
      'check-json-schema:',
      'schemas/author.schema.json',
    ],
  },
  {
    given: [
      'for:',
      'data/author-Wilde.json',
      'data/author-Miller.json',
      'data/author-Hugo.json',
      'data/author-Camus.json',
      'data/painter-Picasso.json',
      'check-json-schema:',
      'schemas/author.schema.json',
    ],
  },
];

const testFolder = 'cmd-glob';

const createProjectDir = () => {
  const tempDir = createTempDirsSync('cmd-glob');
  const fileContents = [
    createPackageJson('module-' + tempDir.replace('/', '-')),
    indexTs,
    indexTestTs,
    readmeMd,
    editorConfig,
    prettierContent,
    tsconfigNode('es2020'),
    personSchema,
    author('Oscar', 'Wilde', 21),
    author('Arthur', 'Miller', 22),
    author('Victor', 'Hugo', 23),
    author('Albert', 'Camus', 24),
    authorList(['Wilde', 'Miller', 'Hugo', 'Camus']),
  ];
  createTestingFilesSync(tempDir, fileContents);
  return tempDir;
};

describe('Commands Glob', () => {

  beforeAll(() => {
    emptyTempDir(testFolder);
    createProjectDir();
  });

  afterAll(() => {
    emptyTempDir(testFolder);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('rehearse parsing', () => {
    const commanding = new Commanding();
    const mockedAction = jest.fn();
    commanding.declareGlobAction(mockedAction);
    const given = ['find:', 'src/*.ts', '.eslint.json'];
    commanding.parseAsync(['node', 'baldrick', 'do', ...given]);
    expect(mockedAction).toHaveBeenCalledWith(given);
  });

  describe('Managing json schema', () => {
    const commanding = new Commanding();
    const mockedAction = jest.fn();
    commanding.declareGlobAction(mockedAction);

    it.each(authorExamples)(
      'check each json with schemas $given',
      ({ given }) => {
        commanding.parseAsync(['node', 'baldrick', 'do', ...given]);
        expect(mockedAction).toHaveBeenCalledWith(given);
      }
    );
  });
});
