const { DefaultComponentTemplate, DefaultItem } = require('../default.config')
const { utilAssign } = require('../utils/assign')
class MainViewTemplate {
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
  getSearchContext() {
    return `
    <div class="app-container">
      <div class="filter-container">
        ${this._getSearchContext()}
        <div class="filter-item">
          <el-button type="primary" @click="get${this.initialsUpper(this.fileName)}sHandle">查询</el-button>
        </div>
      </div>
    `
  }
  _getSearchContext() {
    return this.component.model.map(item => {
      if (item.isSearchOptions) {
        return `
            <div class="filter-item">
              <el-select v-model="listQuery.${item.name}" placeholder="请选择${item.name}" style="width:300px">
                <el-option
                  v-for="item in optiosConfig"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          `
      } else if (item.isSearch) {
        return `
            <div class="filter-item">
              <el-input v-model="listQuery.${item.name}" placeholder="请输入${item.name}" class="filter-item" type="primary" ></el-input>
            </div>
          `
      }
    }).join('\n      ')+`
    ${this.getButtonContext()}
    `
  }
  getButtonContext() {
    return `
      <div class="filter-item">
        <el-button @click="add${this.initialsUpper(this.fileName)}Handle"           
          type="primary"
          class="filter-item"
          icon="el-icon-plus"
        >新增</el-button>
      </div>
    `
  }

  getColumnsContext() {
    return `
        ${this._getColumnsContext()}`
  }
  _getColumnsContext() {
    return this.component.model.map(item => {
      if (item.isImage) {
        return `
        <el-table-column label="${item.text}" align="center">
          <template slot-scope="{row}" label="${item.text}">
            <el-image
              :preview-src-list="[row.${item.name}]"
              :src="row.${item.name}"
              class="course_image"
            />
          </template>
        </el-table-column>
        `
      } else if (item.isVideo) {
        return `
        <el-table-column label="${item.text}" align="center">
          <template slot-scope="{row}">
            <video :src="row.${item.name}" controls width="120px" height="100px" />
          </template>
        </el-table-column>
        `
      } else {
        return `
        <el-table-column label="${item.text}" align="center">
          <template slot-scope="{row}">
            <span>{{ row.${item.name} }}</span>
          </template>
        </el-table-column>
      `
      }
    }).join('\n     ')
  }
  getSearchItemModel() {
    return this.component.model.filter(item => item.isSearch === true || item.isSearchOptions).map(item => `${item.name}:""`).join(',\n          ')
  }
  initialsUpper(filed) {
    return filed.slice(0,1).toLocaleUpperCase()+filed.slice(1)
  }

  getTemplate() {
    return `<template>
    ${this.getSearchContext()}
      <el-table
        v-loading="listLoading"
        :data="${this.fileName}ListData"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        ${this.getColumnsContext()}
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-button type="warning" size="mini" @click="update${this.initialsUpper(this.fileName)}Handle(row)">
              修改
            </el-button>
            <el-button type="danger" size="mini" @click="delete${this.initialsUpper(this.fileName)}Handle(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
      v-show="totalPage>0"
      :total="totalPage"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="get${this.initialsUpper(this.fileName)}sHandle"
    />
    </div>
</template>
  
<script>
import Pagination from '@/components/Pagination'
  export default {
    components:{
      Pagination
    },
    data(){
      return {
        listLoading: false,
        ${this.fileName}ListData:[],
        totalPage: 0,
        listQuery:{
          pageNo: 1,
          pageSize: 20,
          ${this.getSearchItemModel()}
        },
      }
    },
    created(){
      this.get${this.initialsUpper(this.fileName)}sHandle()
    },
    methods:{
      async get${this.initialsUpper(this.fileName)}sHandle(params) {
        const { result: { records, total }} = await get${this.initialsUpper(this.fileName)}sImpl({ ...this.listQuery, ...params })
        this.${this.fileName}ListData = records || []
        this.totalPage = total
      },
      add${this.initialsUpper(this.fileName)}Handle() {
        this.$router.push({
          name: 'Add${this.initialsUpper(this.fileName)}'
        })
      },
      update${this.initialsUpper(this.fileName)}Handle(params) {
        this.$router.push({
          name: 'Update${this.initialsUpper(this.fileName)}',
          params: {
            isUpdate: true,
          }
        })
      },
      delete${this.initialsUpper(this.fileName)}Handle(params){
        // pass
      }
    }
  }
</script>

<style lang="scss">
  @import './${this.fileName}.scss';
</style>`
  }
}
module.exports = {
  MainViewTemplate
}
