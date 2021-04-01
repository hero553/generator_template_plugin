const { utilAssign } = require('./utils/assign')
const { writeTemplate } = require('./utils/file')
const { utilGetName } = require('./utils/name')
const { MainViewTemplate } = require('./template/mainViewTemplate')
const { AddViewTemplate } = require('./template/addViewTemplate')
const { GneratorValidate } = require('./template/generatorValidate')
const { DefaultOption } = require('./default.config')
const { style } = require('./template/style.helper')
const { addStyle } = require('./template/addStyle.helper')
class TemplateExecute {
  constructor(param, basedir) {
    this.option = this.getOption(param)
    this.basedir = basedir
    this.name = utilGetName(this.option.name)
    this.addName = this.option.addName
  }
  getOption(param) {
    return utilAssign(DefaultOption, param)
  }
  writeView(viewTemplate) {
    writeTemplate(this.basedir + this.option.componentDir + `/${this.name}` + `/${this.name}`, this.name + '.vue', viewTemplate.getTemplate())
    writeTemplate(this.basedir + this.option.componentDir + `/${this.name}` + `/${this.name}`, this.name + '.scss', style)
  }
  weiteAddView(addViewTemplate, gneratorValidateTemplate) {
    writeTemplate(this.basedir + this.option.componentDir + `/${this.name}` + `/${this.addName}`, this.addName + '.vue', addViewTemplate.getTemplate())
    writeTemplate(this.basedir + this.option.componentDir + `/${this.name}` + `/${this.addName}`, this.addName + '.scss', addStyle)
    writeTemplate(this.basedir + this.option.componentDir + `/${this.name}` + `/${this.addName}`, this.addName + '.helper.js', gneratorValidateTemplate.generatorValidate())
  }
  execute() {
    const viewTemplate = new MainViewTemplate(this.option.component, this.option.name)
    const addViewTemplate = new AddViewTemplate(this.option.component, this.option.addName)
    const gneratorValidateTemplate = new GneratorValidate(this.option.component, this.option.name)
    this.writeView(viewTemplate)
    this.weiteAddView(addViewTemplate, gneratorValidateTemplate)
  }
}

module.exports = {
  TemplateExecute
}
