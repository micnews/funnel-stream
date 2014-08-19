'use strict'

var through = require('through')
var split = require('split')
var EventEmitter = require('events').EventEmitter

module.exports = function (mapper) {

  mapper = mapper || function (e) { return e }
  var buffer = ''
  var output = null
  var emitter = new EventEmitter()

  function push (line) {
    if(!line) return
    if(buffer || !output) buffer += line + '\n'
    else       output.queue(buffer)
  }

  emitter.createInput =
  emitter.createInputStream =
    function () {
      return split(null, function (data) {
        if(!data) return
        push(mapper(data))
      })
    }

  //okay so the output needs to know when the sink stream
  //has ended...
  emitter.createOutput =
  emitter.createOutputStream = function () {
    if(output) throw new Error('can only create one output stream at a time')

    output = through()
    output.pause()
    if(buffer) output.queue(buffer)
    buffer = ''

    process.nextTick(function () {
      output.resume()
    })

    var cleaned = false
    function cleanup () {
      if(cleaned) return
      cleaned = true
      output = null
    }

    var pipe = output.pipe
    output.pipe = function (dest, opts) {
      dest.on('end', cleanup)
      dest.on('error', cleanup)
      dest.on('close', cleanup)
      return pipe.call(this, dest, opts)
    }

    return output
  }

  emitter.end = function () {
    if(output) output.queue(null)
  }

  return emitter
}

