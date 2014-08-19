var tape = require('tape')
var concat = require('concat-stream')

var funnel = require('../')

tape('simple', function (t) {

  var f = funnel()

  var input = f.createInput()

  input.write('hello\n')
  input.write('world\n')

  f.createOutput()
    .on('data', console.log)
    .pipe(concat(function (data) {
    t.equal(data, 'hello\nworld\n')
    t.end()
  }))

  f.end()

})

tape('two-streams', function (t) {

  var f = funnel()

  var input1 = f.createInput()
  var input2 = f.createInput()

  input1.write('hello\n')
  input2.write('world\n')

  f.createOutput()
    .on('data', console.log)
    .pipe(concat(function (data) {
    t.equal(data, 'hello\nworld\n')
    t.end()
  }))

  f.end()

})

