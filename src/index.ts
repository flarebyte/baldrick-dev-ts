import { Commanding } from './commanding.js';
import {
  cmdBuildAction,
  cmdLintAction,
  cmdTestAction,
} from './commanding-action.js';

const commanding = new Commanding();
commanding.declareLintAction(cmdLintAction);
commanding.declareTestAction(cmdTestAction);
commanding.declareBuildAction(cmdBuildAction);

export { commanding };
