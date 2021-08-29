import { LocalSetup } from "./model";

export const readLocalSetup = (modulePath: string): LocalSetup => {
  const localSetup: LocalSetup = {
    modulePath,
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
