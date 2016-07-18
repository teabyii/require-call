'use strict'

const fs = require('fs')
const assert = require('assert')
const resolve = require('../')

describe('Dependencies', () => {
  const str = fs.readFileSync(__dirname + '/files/deps.js', 'utf8')
  const result = resolve(str, (item) => '123456')
  const resource = result.resource

  it('counts', () => {
    assert(resource.length === 6)
  })

  it('string', () => {
    assert(resource[0].string === 'require(\'foo\')')
    assert(resource[1].string === 'require("a")')
  })

  it('path', () => {
    assert(resource[2].path === 'b')
    assert(resource[3].path === './c.js')
  })

  it('callback', () => {
    let count = 0
    result.code.replace(/123456/g, () => {
      count++
    })

    assert(count === 6)
  })
})

describe('ignore', () => {
  const str = fs.readFileSync(__dirname + '/files/ignore.js', 'utf8')
  const result = resolve(str, (item) => '123456')
  const resource = result.resource

  it('counts', () => {
    assert(resource.length === 0)
  })

  it('callback', () => {
    assert.equal(str, result.code)
  })
})

describe('async', () => {
  const str = fs.readFileSync(__dirname + '/files/async.js', 'utf8')
  const result = resolve(str, (item) => {
    return item.string.match('.async') ?
      item.string : '123456'
  })
  const resource = result.resource

  it('counts', () => {
    assert(resource.length === 3)
  })

  it('path', () => {
    assert(resource[0].path === 'a')
    assert(resource[1].path === 'b')
    assert(resource[2].path === 'c')
  })

  it('callback', () => {
    assert(str === result.code)
  })
})

describe('generators', () => {
  const str = fs.readFileSync(__dirname + '/files/generators.js', 'utf8')
  const result = resolve(str)
  const resource = result.resource

  it('counts', () => {
    assert(resource.length === 2)
  })

  it('path', () => {
    assert(resource[0].path === 'a')
    assert(resource[1].path === 'b')
  })
})

describe('nested', () => {
  const str = fs.readFileSync(__dirname + '/files/nested.js', 'utf8')
  const result = resolve(str)
  const resource = result.resource

  it('counts', () => {
    assert(resource.length === 3)
  })

  it('path', () => {
    assert(resource[0].path === 'a')
    assert(resource[1].path === 'b')
    assert(resource[2].path === 'c')
  })
})
