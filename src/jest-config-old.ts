import path from "path";
import fs from "fs-extra";
import { Config } from "@jest/types";
import { paths } from "./path-helper";
import { JestOpts, PackageJson } from "./model";
import { resolveApp } from "./resolve-app";

type JestConfigOptions = Partial<Config.InitialOptions>;

function createJestConfig(
  _: (relativePath: string) => void,
  rootDir: string
): JestConfigOptions {
  const config: JestConfigOptions = {
    transform: {
      ".(ts|tsx)$": require.resolve("ts-jest/dist"),
    },
    transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
    moduleFileExtensions: ["ts", "tsx", "json", "node"],
    collectCoverageFrom: ["src/**/*.{ts,tsx}"],
    testMatch: ["<rootDir>/**/*.(spec|test).{ts,tsx}"],
    testURL: "http://localhost",
    rootDir,
    watchPlugins: [],
  };

  return config;
}

const overrideJestConfig = (config: string | undefined): JestConfigOptions => {
  const jestConfigPath = resolveApp(config || paths.jestConfig);
  const jestConfigContents: JestConfigOptions = require(jestConfigPath);
  return jestConfigContents;
};

export const computeJestConfig = async (appPackageJson: PackageJson, opts: JestOpts) => {
  const initJestConfig: JestConfigOptions = {
    ...createJestConfig(
      (relativePath) => path.resolve(__dirname, "..", relativePath),
      opts.config ? path.dirname(opts.config) : paths.appRoot
    ),
    ...appPackageJson.jest,
  };

  const defaultPathExists = await fs.pathExists(paths.jestConfig);

  const jestConfig =
    opts.config || defaultPathExists
      ? { ...initJestConfig, ...overrideJestConfig(opts.config) }
      : initJestConfig;
  return jestConfig;
};
