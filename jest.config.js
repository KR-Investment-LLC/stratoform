/*
 *
 */

console.log("Jest configuration Loaded.");

/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
MediaSourceHandle.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [
        "**/__test__/**/*.test.ts",
        "**/?(*.)+(spec|test).ts"
    ],
    moduleFileExtensions: [
        "ts",
        "js",
        "json",
        "node"
    ],
    roots: [
        "<rootDir>.tsx?$",
        "<rootDir>/tests"
    ],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.json"
            }
        ]
    },
    reporters: [
        "default",
        [
            "jest-junit",
            {
                outputDirectory:   "./tests/test-results",
                outputName:        "results.xml",
                ancestorSeperator: " > ",
                addFileAttribute:  "true",
            }
        ]
    ],
    collectCoverage: true,
    coverageDirectory: "./tests/test-results/coverage",
    coverageReporters: [
        "text",
        "lcov"
    ],
    verbose: true
}