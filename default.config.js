const DefaultPluginParam = {
  baseDir: './src',
  options: []
}

const DefaultComponentTemplate = {
  primaryKey: 'id',
  model: []
}

const DefaultOption = {
  name: 'default',
  addName: 'default',
  serviceDir: '/services',
  componentDir: '/views',
  service: ['list'],
  component: DefaultComponentTemplate
}

const DefaultItem = {
  name: '',
  text: '',
  isSearch: false,
  isEdit: true,
  isImage: false,
  isVideo: false,
  isSearchOptions: false
}
module.exports = { DefaultPluginParam, DefaultComponentTemplate, DefaultItem, DefaultOption }
