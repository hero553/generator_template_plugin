const fs = require('fs')
const writeTemplate = function(dir, name, content) {
  return new Promise((resolve, reject) => {
    const path = dir + '/' + name
    hasNoFile(path)
      .then(() => createDir(dir))
      .then(() => writeFile(path, content))
      .then(() => resolve(`Info:${path}文件写入完成`))
      .catch((err) => reject(err))
  })
}
const createDir = function(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      err ? reject(err) : resolve()
    })
  })
}

const writeFile = function(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, 'utf8', (err) => {
      err ? reject(err) : resolve()
    })
  })
}

const hasNoFile = function(path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      err ? resolve() : reject(`Warn: ${path} 已存在`)
    })
  })
}

module.exports = { writeTemplate }
