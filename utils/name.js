const name = function() {
  const nameObj = {}
  return function(name) {
    if (nameObj[name]) {
      nameObj[name] += 1
      return name + '_' + (nameObj[name] - 1)
    } else {
      nameObj[name] = 1
      return name
    }
  }
}
const utilGetName = name()
module.exports = { utilGetName }
