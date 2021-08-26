import { Config } from "@jest/types";

export type JestConfigOptions = Partial<Config.InitialOptions>;

export function createJestConfig(
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
