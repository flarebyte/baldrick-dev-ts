import { computeEsLintConfig } from "./eslint-config";
import { LintOpts, LocalSetup } from "./model";
import { CLIEngine } from "eslint";
import fs from "fs-extra";

export const eslintCommand = (localSetup: LocalSetup) => async (opts: LintOpts) => {
  const cliConfig = computeEsLintConfig(localSetup, opts);

  const cli = new CLIEngine(cliConfig);
  const patterns = ["src", "test"];
  const report = cli.executeOnFiles(patterns);
  if (opts.fix) {
    CLIEngine.outputFixes(report);
  }
  console.log(cli.getFormatter()(report.results));
  if (opts.reportFile) {
    await fs.outputFile(
      opts.reportFile,
      cli.getFormatter("json")(report.results)
    );
  }
  if (report.errorCount) {
    process.exit(1);
  }
  if (report.warningCount > opts.maxWarnings) {
    process.exit(1);
  }
};
