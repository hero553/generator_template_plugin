
const { DefaultPluginParam } = require('./default.config')
const { TemplateExecute } = require('./templateExecute')
const { utilAssign } = require('./utils/assign')
class GeneratorTemplatePlugin {
  constructor(options) {
    this.initParams = this.getOption(options)
    console.log(this.initParams)
  }
  apply(compiler) {
    compiler.plugin('environment', () => {
      this.execute()
    })
  }
  getOption(param) {
    return utilAssign(DefaultPluginParam, param)
  }
  execute() {
    for (const opt of this.initParams.options) {
      const curdObj = new TemplateExecute(opt, this.initParams.baseDir)
      curdObj.execute()
    }
  }
}
module.exports = GeneratorTemplatePlugin
