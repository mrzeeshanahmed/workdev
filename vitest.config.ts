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
