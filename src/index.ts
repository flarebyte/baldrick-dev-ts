import { Commanding } from './commanding';
import { cmdLintAction } from './commanding-action';

const commanding = new Commanding();
commanding.declareLintAction(cmdLintAction);

async function main() {
  await commanding.parseAsync(process.argv);
}
(async () => {
  await main();
})();
