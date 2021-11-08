import { Commanding } from './commanding';
import { cmdLintAction, cmdTestAction } from './commanding-action';

const commanding = new Commanding();
commanding.declareLintAction(cmdLintAction);
commanding.declareTestAction(cmdTestAction);

export { commanding }
