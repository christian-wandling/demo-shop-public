const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  setupFiles: ['jest-canvas-mock'],
  coverageReporters: ['lcov', 'text', 'text-summary'],
};
