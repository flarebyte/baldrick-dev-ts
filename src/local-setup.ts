import { LocalSetup } from "./model";

export const readLocalSetup = (appPath: string): LocalSetup => {
  const localSetup: LocalSetup = {
    appPath,
    toolOptions: {
      profileName: "ts-lib",
      sizeLimitKB: 5,
      coverage: {
        ignore: [],
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    packageJson: {
      name: "",
    },
  };
  return localSetup;
};
