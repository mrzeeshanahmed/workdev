import { defineConfig } from 'vitest/config'
import path from 'path'

// Keep Vite root as the frontend package so node_modules resolution works normally.
// Include tests under ../specs by using a relative include pattern from the frontend root.
const cfg: any = {
  root: path.resolve(__dirname),
  test: {
    include: [path.resolve(__dirname, '..', 'specs', '**', 'tests', '**', '*.test.@(ts|tsx)'), 'src/**/*.test.@(ts|tsx)'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // keep devServerSetup as global setup/teardown for integration tests
    globalSetup: path.resolve(__dirname, '..', 'specs', 'test-helpers', 'devServerSetup.js'),
    globalTeardown: path.resolve(__dirname, '..', 'specs', 'test-helpers', 'devServerSetup.js')
  }
}

export default defineConfig(cfg)
