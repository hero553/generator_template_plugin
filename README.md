#### npm安装方式
`npm i generator_template_plugin`

#### generator_template_plugin
webpack添加插件处加入（先导入插件）：
`const GeneratorTemplatePlugin = require('generator_template_plugin/generator-template-plugin')`
vue.config.js中添加插件：
```javascript 
  chainWebpack(config) {
    config.plugin('generator-templatePlugin').use(new GeneratorTemplatePlugin({
      baseDir: './src',
      options: [{
        name: 'project', // 列表名称文件名称
        addName: 'addProject', // 添加/修改文件名称
        component: {
          primaryKey: 'id',
          model: [ // 数据模型
            {
              name: 'name',
              text: '姓名',
              isImage: true
            }, {
              name: 'sex',
              text: '性别',
              isImage: true
            }, {
              name: 'telephone',
              text: '手机号码',
              isSearchOptions: true
            }, {
              name: 'email',
              text: '邮箱',
              isSearch: true
            }, {
              name: 'address',
              text: '地址'
            }
          ]
        }
      }]
    }))
  }
```
webpack中添加插件：
```javascript
plugins:[new GeneratorTemplatePlugin({
      baseDir: './src',
      options: [{
        name: 'project',
        addName: 'addProject',
        component: {
          primaryKey: 'id',
          model: [
            {
              name: 'name',
              text: '姓名',
              isImage: true
            }, {
              name: 'sex',
              text: '性别',
              isImage: true
            }, {
              name: 'telephone',
              text: '手机号码',
              isSearchOptions: true
            }, {
              name: 'email',
              text: '邮箱',
              isSearch: true
            }, {
              name: 'address',
              text: '地址'
            }
          ]
        }
      }]
    })]
```
