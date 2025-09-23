// Export a plain config object so vitest can load this file even when vitest
// is installed only in a workspace subfolder (frontend/node_modules).
module.exports = {
  test: {
    include: ['specs/**/tests/**/*.test.@(ts|tsx)'],
    // Run spec-level contract/integration tests in Node so they don't require
    // jsdom to be installed at the repository root. These tests call HTTP
    // endpoints directly and work fine under Node (Node 18+ provides global fetch).
    environment: 'node',
    threads: false,
    reporters: 'verbose'
  }
}

// Add resolver aliases so tests import React from the frontend package's
// node_modules (single copy), preventing the "Invalid hook call" issue when
// vitest (installed at repo root) resolves a different React instance.
try {
  const path = require('path')
  const frontendNodeModules = path.resolve(__dirname, 'frontend', 'node_modules')
  module.exports.resolve = {
    alias: {
      react: path.join(frontendNodeModules, 'react'),
      'react-dom': path.join(frontendNodeModules, 'react-dom')
    }
  }
} catch (e) {
  // best-effort; ignore when running in environments without frontend deps
}
