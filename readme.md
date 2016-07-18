# require-call

A more simple way to find all require() calls.

[![npm version](https://badge.fury.io/js/require-call.svg)](https://badge.fury.io/js/require-call)
[![Build Status](https://travis-ci.org/jsenjoy/require-call.svg?branch=master)](https://travis-ci.org/jsenjoy/require-call)

## Installation

```shell
npm install require-call
```

## Usage

### API

```
parseDependencies(code: String, replace: Function = null)
```

### Example

Source code:

```js
require('foo')
// require('bar')
```

```js
const fs = require('fs')
const resolve = require('require-call')

fs.readFile(file, 'utf8', (err, content) => {
  console.log(resolve(content, (item) => {
    return item.string
  }))
})
```

Output:

```js
{
  code: 'require(\'foo\')\n// require(\'bar\')\n',
  resource: [
    {
      string: 'require(\'foo\')',
      path: 'foo',
      start: 0,
      end: 14
    }
  ]
}
```

## Benchmark

```shell
require-call: deps x 170,457 ops/sec ±1.10% (84 runs sampled)
crequire: deps x 30,942 ops/sec ±1.05% (85 runs sampled)
detective: deps x 25,083 ops/sec ±4.37% (80 runs sampled)
[ 'require-call: deps' ]
require-call: async x 339,991 ops/sec ±1.85% (84 runs sampled)
crequire: async x 51,265 ops/sec ±3.44% (82 runs sampled)
detective: async x 33,586 ops/sec ±1.37% (82 runs sampled)
[ 'require-call: async' ]
require-call: generators x 220,163 ops/sec ±1.27% (85 runs sampled)
crequire: generators x 41,673 ops/sec ±1.22% (89 runs sampled)
detective: generators x 30,486 ops/sec ±4.88% (82 runs sampled)
[ 'require-call: generators' ]
require-call: ignore x 77,263 ops/sec ±1.11% (85 runs sampled)
crequire: ignore x 28,153 ops/sec ±1.08% (88 runs sampled)
detective: ignore x 19,288 ops/sec ±1.35% (83 runs sampled)
[ 'require-call: ignore' ]
require-call: nested x 73,550 ops/sec ±3.86% (82 runs sampled)
crequire: nested x 20,056 ops/sec ±1.70% (82 runs sampled)
detective: nested x 18,324 ops/sec ±3.06% (82 runs sampled)
[ 'require-call: nested' ]
```

## Development

```shell
npm run test
npm run benchmark
```

## Thanks

- [crequire](https://github.com/seajs/crequire)
- [node-detective](https://github.com/substack/node-detective)

## License

MIT
