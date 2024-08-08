/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    // Pontos de entrada e setup ficam fora da cobertura unitária.
    "!src/server.ts",
    "!src/seed.ts",
    "!src/core/**",
    "!src/**/I*.ts",
    "!src/testing/**",
  ],
};
