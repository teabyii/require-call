const fs = require('fs')

const call = require('../')
const crequire = require('crequire')
const detective = require('detective')

const Benchmark = require('benchmark')

const tests = {
  'deps': fs.readFileSync(__dirname + '/files/deps.js', 'utf8'),
  'async': fs.readFileSync(__dirname + '/files/async.js', 'utf8'),
  'generators': fs.readFileSync(__dirname + '/files/generators.js', 'utf8'),
  'ignore': fs.readFileSync(__dirname + '/files/ignore.js', 'utf8'),
  'nested': fs.readFileSync(__dirname + '/files/nested.js', 'utf8')
}

const results = {
  'deps': 6,
  'async': 0,
  'generators': 2,
  'ignore': 0,
  'nested': 3
}

Object.keys(tests).forEach(function(key) {
  const suite = new Benchmark.Suite
  const s = tests[key]
  // add tests
  suite
    .add('require-call: ' + key, function() {
      call(s).resource.length === results[key]
    })
    .add('crequire: ' + key, function() {
      crequire(s).length === results[key]
    })
    .add('detective: ' + key, function() {
      detective(s).length === results[key]
    })
    // add listeners
    .on('cycle', function(event) {
      console.log(String(event.target))
    })
    .on('complete', function() {
      console.log(this.filter('fastest').map('name'))
    })
    .run()
})
