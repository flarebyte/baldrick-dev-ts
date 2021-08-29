import { ToolOptions } from "../src/model";

export const simpleToolOptions: ToolOptions = {
    profileName: "ts-lib",
    sizeLimitKB: 10,
    coverage: {
      ignore: ["-io"],
      branches: 93,
      lines: 94,
      statements: 95,
      functions: 96,
    },
    linting: {
      ignore: ["-generated"],
    }
  }