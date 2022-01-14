import { Commanding } from './commanding.js';
import {
  cmdLintAction,
  cmdMarkdownAction,
  cmdReleaseAction,
  cmdTestAction,
} from './commanding-action.js';

const commanding = new Commanding();
commanding.declareLintAction(cmdLintAction);
commanding.declareTestAction(cmdTestAction);
commanding.declareMarkdownAction(cmdMarkdownAction);
commanding.declareReleaseAction(cmdReleaseAction);

export { commanding };
