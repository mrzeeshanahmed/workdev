import { defineConfig } from 'vitest/config'
import path from 'path'

// Keep Vite root as the frontend package so node_modules resolution works normally.
// Include tests under ../specs by using a relative include pattern from the frontend root.
const cfg: any = {
  root: path.resolve(__dirname),
  test: {
    include: [path.resolve(__dirname, '..', 'specs', '**', 'tests', '**', '*.test.@(ts|tsx)'), 'src/**/*.test.@(ts|tsx)'],
    environment: 'jsdom',
    globals: false,
    globalSetup: 'E:/workdev/specs/test-helpers/devServerSetup.js',
    globalTeardown: 'E:/workdev/specs/test-helpers/devServerSetup.js'
  }
}

export default defineConfig(cfg)
