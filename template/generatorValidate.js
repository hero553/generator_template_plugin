const { DefaultComponentTemplate, DefaultItem } = require('../default.config')
const { utilAssign } = require('../utils/assign')
class GneratorValidate {
  constructor(config, fileName) {
    this.component = utilAssign(DefaultComponentTemplate, config)
    this._assign()
    this.fileName = fileName
  }
  _assign() {
    for (const key in this.component.model) {
      const obj = Object.assign({}, this.component.model[key])
      this.component.model[key] = utilAssign(DefaultItem, obj)
    }
  }
  generatorValidate() {
    return `export const validateRules = {` + '\n   ' +
    this.component.model.filter(item => item.isEdit === true).map(item => {
      return `${item.name}:[
                    {required:true,message:${item.isImage ? `'请上传${item.text}'` : item.isSearchOptions ? `'请选择${item.text}'` : `'请填写${item.text}'`} ,trigger: 'blur'}
                ]`
    }).join(',\n       ') + '\n   ' +
    `}`
  }
}
module.exports = {
  GneratorValidate
}
