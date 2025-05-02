module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.js$": "babel-jest",
  },
  moduleFileExtensions: ["js", "json"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};
