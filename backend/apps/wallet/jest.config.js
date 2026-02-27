/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testMatch: ["<rootDir>/test/**/*.spec.ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@application/(.*)$": "<rootDir>/src/application/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@http/(.*)$": "<rootDir>/src/http/$1",
  },
  collectCoverageFrom: ["src/application/**/*.ts", "!src/application/**/*.spec.ts"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
};
