
//take a buffer and break out the first partial line
//and the last partial line

module.exports = function () {
  var stream = through()

  stream.createStream = function () {
    return split(null, function (line) {
      stream.queue(line)
    })
  }
}
