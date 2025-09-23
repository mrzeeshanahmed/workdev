(async ()=>{
  const { run } = await import('vitest')
  // specify files
  const files = [
    'backend/src/__tests__/milestones.service.test.js',
    'specs/005-title-shared-project/tests/unit/milestone.state.test.ts',
    'specs/005-title-shared-project/tests/e2e/milestones.e2e.test.ts'
  ]
  const result = await run({ files, run: true, reporters: ['default'] })
  if (result || result === 0) process.exit(0)
  process.exit(1)
})()
