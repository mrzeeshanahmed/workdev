import('./backend/src/app.js')
  .then(() => console.log('app load ok'))
  .catch(err => { console.error(err); process.exit(1) })
