module.exports = function getDevlandFile (name) {
  return require(
    require.resolve(name, {
      paths: [ __dirname ]
    })
  )
}
