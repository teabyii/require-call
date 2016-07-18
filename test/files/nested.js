if (false) {
  (function() {
    var a = require('a')
  })()
}


var fn = () => {
  var x = 1

  switch(x) {
    case 1:
      require('b')
      break
    default:
      break
  }

  require(
    'c'
  )
}
