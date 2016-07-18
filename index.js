'use strict'

module.exports = function parseDependencies(str, replace) {

  // Not string or not includes 'require'
  if (typeof str !== 'string' || str.indexOf('require') === -1) {
    return {
      code: str,
      resource: []
    }
  }

  const resource = [] // Put dependencies info
  const result = { code: str, resource } // To return
  const len = str.length
  const map = [] // all requires, should be filtered, just like temp
  const RE_REQUIRE = /require\s*(?:\/\*[\s\S]*?\*\/\s*)?[.\w$]*\s*(?:\/\*[\s\S]*?\*\/\s*)?\(\s*(['"])(.+?)\1\s*\)/g

  let re = null
  let index = 0
  let peek = str.charAt(index)

  // Move to next char to check
  function nextChar() {
    peek = str.charAt(++index)
  }

  // Use Regexp to find all requires
  while(re = RE_REQUIRE.exec(str)) {
    map.push({
      string: re[0],
      path: re[2],
      start: re.index,
      end: re.index + re[0].length
    })
  }

  // To locale requires which will be filtered
  let cursor = 0;
  let current = map[cursor]
  let regMark = false

  // Walking the string
  while(index < len) {
    if (isQuote()) {
      skipQuote()
    }

    if (isComment()) {
      skipComment()
    }

    if (isRegExp()) {
      skipRegExp()
    }

    // Hit, it should be the available require-call
    if (peek === 'r' && index === current.start) {
      resource.push(current)
      index = current.end + 1
    }

    move()
    nextChar()
  }

  if (typeof replace === 'function') {
    // Replace callback
    let last = 0
    const target = resource.reduce((target, item) => {
      const rep = replace(item)

      target += str.slice(last, item.start) + rep
      last = item.end

      return target
    }, '')

    result.code = target + str.slice(last)
  }

  // { code: new String(), resource: [ deps ] }
  return result

  // Move cursor to skip the disabled requires
  function move() {
    
    while(index > current.end) {
      current = map[++cursor]

      if (current === undefined) {
        index = len
        break
      }
    }
  }

  function isQuote() {
    return peek === '"' || peek === "'"
  }

  function skipQuote() {
    const start = index
    const quote = peek
    const end = str.indexOf(peek, index)

    if (end === -1) { // No another quote
      index = len
    } else if (str.charAt(end - 1) !== '\\') {
      index = end + 1
    } else {
      while(index < len) { // Lookup another quote
        nextChar()
        if (peek === '\\') {
          index++
        } else if (peek === quote) {
          break
        }
      }
    }
  }

  function isComment() {
    if (peek === '/') {
      nextChar()
      if (peek === '/' || peek === '*') {
        return true
      } else {
        // Not comment, so mark it as the Regexp
        regMark = true
      }
    }
  }

  function skipComment() {
    if (peek === '/') {
      index = str.indexOf('\n', index) // Skip this line
    }

    if (peek === '*') {
      index = str.indexOf('*/', index) + 1 // Skip to the */
    }

    if (index === -1) {
      index = len
    }
  }

  function isRegExp() {
    if (regMark) {
      regMark = false
      return true
    }
  }

  function skipRegExp() {
    // For \, [, ]
    index--
    while(index < len) {
      nextChar()
      if (peek === '\\') {
        index++
      } else if (peek === '/') {
        break
      } else if (peek === '[') {
        while(index < len) {
          nextChar()
          if (peek === '\\') {
            index++
          } else if (peek === ']') {
            break
          }
        }
      }
    }
  }
}
