interface WrappingWord {
  current: string;
  done: string[];
  progress: {
    count: number;
    words: string[];
  };
}

const createWrappingWord = (current: string): WrappingWord => ({
  current,
  done: [],
  progress: {
    count: current.length,
    words: [current],
  },
});

const mergeWrappingWords =
  (width: number) =>
  (total: WrappingWord, next: WrappingWord): WrappingWord => {
    const newCount = next.current.length + total.progress.count;
    if (newCount > width) {
      return {
        current: next.current,
        done: [...total.done, total.progress.words.join(' ')],
        progress: {
          count: next.current.length,
          words: [next.current],
        },
      };
    } else {
      return {
        current: next.current,
        done: total.done,
        progress: {
          count: newCount,
          words: [...total.progress.words, next.current],
        },
      };
    }
  };

export const wrapWord = (width: number, text: string): string => {
  const words = text.split(' ').map(createWrappingWord);
  const result = words.reduce(mergeWrappingWords(width));

  const done =
    result.progress.words.length > 0
      ? [...result.done, result.progress.words.join(' ')]
      : result.done;
  return done.join('\n');
};

type MdLineType =
  | 'blockquote'
  | 'ordered-list'
  | 'unordered-list'
  | 'paragraph'
  | 'header'
  | 'table-row'
  | 'code-block';

const getMdLineType = (line: string): MdLineType => {
  const trimmed = line.trim();
  if (trimmed.startsWith('#')) {
    return 'header';
  }
  if (trimmed.startsWith('>')) {
    return 'blockquote';
  }
  if (trimmed.startsWith('1.')) {
    return 'ordered-list';
  }
  if (trimmed.startsWith('-')) {
    return 'unordered-list';
  }
  if (trimmed.includes('|')) {
    return 'table-row';
  }
  if (line.length !== trimmed.length) {
    return 'code-block';
  }
  return 'paragraph';
};

const maxLineP = 78;
const maxLineOther = 72;

/**
 * @see https://cirosantilli.com/markdown-style-guide/
 * @param text
 * @returns
 */
export const normalizeMdLine = (line: string): string => {
  const lineType = getMdLineType(line);
  const keepLineAsIs =
    lineType === 'header' ||
    lineType === 'table-row' ||
    lineType === 'code-block';
  if (keepLineAsIs) {
    return line;
  }
  if (lineType === 'paragraph') {
    return wrapWord(maxLineP, line);
  }

  const trimmed = line.trimStart();
  const nbOfLeadingSpaces = line.length - trimmed.length;
  const leadingSpaces = ' '.repeat(nbOfLeadingSpaces);
  if (lineType === 'unordered-list') {
    const ulText = wrapWord(maxLineOther, trimmed.substring(1).trim());
    return `${leadingSpaces}-   ${ulText}`;
  }
  if (lineType === 'ordered-list') {
    const olText = wrapWord(maxLineOther, trimmed.substring(2).trim());
    return `${leadingSpaces}1.   ${olText}`;
  }
  if (lineType === 'blockquote') {
    const bqText = wrapWord(maxLineOther, trimmed.substring(1).trim());
    return `${leadingSpaces}> ${bqText}`;
  }

  throw new Error('should be a supported line type');
};
