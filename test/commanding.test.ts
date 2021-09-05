import { Commanding } from '../src/commanding';
import {
  author,
  authorList,
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  editorConfig,
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

const createProjectDir = () => {
  const tempDir = createTempDirsSync();
  const fileContents = [
    createPackageJson('module-' + tempDir.replace('/', '-')),
    indexTs,
    indexTestTs,
    readmeMd,
    editorConfig,
    prettierContent,
    tsconfigNode('node14'),
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

describe('Commands', () => {
  it('rehearse parsing', () => {
    const commanding = new Commanding();
    commanding.declareGlobAction(jest.fn());
    const given = ['find:', 'src/*.ts', '.eslint.json'];
    commanding.parse(['node', 'baldrick', 'do', ...given]);
    expect(commanding.getInstrumentation().getLastRecord().params).toEqual(
      given
    );
  });

  describe('Managing json schema', () => {
    createProjectDir();
    const commanding = new Commanding();
    commanding.declareGlobAction(jest.fn());

    it.each(authorExamples)('check each json with schemas $given', ({given}) => {
      commanding.parse(['node', 'baldrick', 'do', ...given]);
      expect(commanding.getInstrumentation().getLastRecord().params).toEqual(
        given
      );
    });
  });
});
