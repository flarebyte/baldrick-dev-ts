import { Commanding } from "./commanding";
import { cmdLintAction } from "./commanding-action";

const commanding = new Commanding()
commanding.declareLintAction(cmdLintAction)

commanding.parse(process.argv)