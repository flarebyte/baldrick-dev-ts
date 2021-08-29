import { readJsonSync } from "fs-extra";
import { LocalSetup } from "./model";
import { resolve } from "path";

export const readLocalSetup = (modulePath: string): LocalSetup => {
  const localSetup: LocalSetup = {
    modulePath,
    toolOptions: readJsonSync(resolve(modulePath, ".baldrick-dev.json")),
    packageJson: readJsonSync(resolve(modulePath, "package.json")),
  };
  return localSetup;
};
