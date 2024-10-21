const { join } = require("node:path");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  roots: [join(__dirname, "src", "testing")]
};