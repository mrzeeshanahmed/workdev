(async ()=>{
  const mod = await import('./src/app.js')
  const app = mod.default || mod.app || mod
  const port = process.env.PORT || 3000
  const server = app.listen(port, () => console.log('Started app on', port))
})()
