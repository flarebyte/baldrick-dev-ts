import path from "path";
import fs from "fs-extra";
import { Config } from "@jest/types";
import { paths } from "./path-helper";
import { JestOpts, PackageJson, TestResolvedOpts } from "./model";
import { resolveApp } from "./resolve-app";

type JestConfigOptions = Partial<Config.InitialOptions>;

function createJestConfig(
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

export const computeJestConfig = (opts: TestResolvedOpts) => {
  return createJestConfig(opts.modulePath)
}