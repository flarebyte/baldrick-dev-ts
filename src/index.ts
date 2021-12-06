import { Commanding } from './commanding.js';
import {
  cmdLintAction,
  cmdTestAction,
} from './commanding-action.js';

const commanding = new Commanding();
commanding.declareLintAction(cmdLintAction);
commanding.declareTestAction(cmdTestAction);

export { commanding };
