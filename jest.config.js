const { pathsToModuleNameMapper } = require("ts-jest/utils")
const { compilerOptions } = require("./tsconfig.json")

module.exports = {
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "!components/**/index.{ts,tsx}",
    "!**/models/**",
    // 'pages/**/*.{ts,tsx}'
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFiles: ["<rootDir>/tests/loadershim.js"],
  testMatch: ["**/?(*.)+(spec|test).(ts|js)?(x)"],
  testEnvironment: "jsdom",
  transform: {
    "\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    // we must specify a custom tsconfig for tests because we need the typescript transform
    // to transform jsx into js rather than leaving it jsx such as the next build requires.  you
    // can see this setting in tsconfig.jest.json -> "jsx": "react"
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
}
