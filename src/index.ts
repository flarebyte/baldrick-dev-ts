import { Commanding } from './commanding';
import { cmdBuildAction, cmdLintAction, cmdTestAction } from './commanding-action';

const commanding = new Commanding();
commanding.declareLintAction(cmdLintAction);
commanding.declareTestAction(cmdTestAction);
commanding.declareBuildAction(cmdBuildAction);

export { commanding }
