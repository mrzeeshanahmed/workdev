import path from 'path'

// Use project-based discovery to avoid duplicate test runs and to apply
// different environments per package (frontend -> jsdom, backend -> node).
const frontendNodeModules = path.resolve(__dirname, 'frontend', 'node_modules')

export default [
  {
    root: path.resolve(__dirname, 'frontend'),
    test: {
      include: ['src/**/*.test.@(ts|tsx)'],
      environment: 'jsdom',
      threads: false,
    },
    resolve: {
      alias: {
        react: path.join(frontendNodeModules, 'react'),
        'react-dom': path.join(frontendNodeModules, 'react-dom'),
      }
    }
  },
  {
    root: path.resolve(__dirname, 'backend'),
    test: {
      include: ['tests/**/*.(test|spec).@(js|ts)'],
      environment: 'node',
      globals: true,
      threads: false,
    }
  }
]
