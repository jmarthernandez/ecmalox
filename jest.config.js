module.exports = {
    "roots": [
      "<rootDir>"
    ],
    testMatch: [
      "**/__tests__/**/?(*.)+(spec|tests).+(ts)",
    ],
    "transform": {
      "^.+\\.(ts|tsx)?$": "ts-jest"
    },
  }