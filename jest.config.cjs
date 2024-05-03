const {defaults} = require('jest-config');
module.exports = {
  preset: void(0)/*"jest-puppeteer"*/,
  globals: {
  
  },
  testMatch: [
    "**/test/*.test.js"
  ],
  verbose: true,
  setupFilesAfterEnv: ["./jest.setup.js"],
  collectCoverage: true,
  collectCoverageFrom: ["./dist/*.umd.js"],
  coverageDirectory: "./coverage"
}