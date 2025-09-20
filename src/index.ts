import { Commanding } from "./commanding.js";
import {
	cmdLintAction,
	cmdMarkdownAction,
	cmdReleaseAction,
	cmdTestAction,
} from "./commanding-action.js";

/**
 * Singleton CLI wiring for this package.
 *
 * Exposes the `markdown` and `release` commands.
 */
const commanding = new Commanding();
commanding.declareLintAction(cmdLintAction);
commanding.declareTestAction(cmdTestAction);
commanding.declareMarkdownAction(cmdMarkdownAction);
commanding.declareReleaseAction(cmdReleaseAction);

export { commanding };
