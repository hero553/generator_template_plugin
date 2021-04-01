const { DefaultComponentTemplate, DefaultItem } = require('../default.config')
const { utilAssign } = require('../utils/assign')

class AddViewTemplate {
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
  initialsUpper(filed) {
    return filed.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
  }
  getButtonContext() {
    return `
      <el-form-item class="el-form-botton">
        <div>
          <el-button type="info" @click="cancelSave${this.initialsUpper(this.fileName)}()">
            取消
          </el-button>
        </div>
        <div v-if="!isUpdate">
          <el-button :loading="loading" type="primary" class="save-button" @click="save${this.initialsUpper(this.fileName)}('ruleForm')">
            保存
          </el-button>
        </div>
        <div v-else>
          <el-button :loading="loading" type="danger" class="save-button" @click="save${this.initialsUpper(this.fileName)}('ruleForm')">
            更新
          </el-button>
        </div>
      </el-form-item>
    `
  }
  getFormItemContext() {
    return `
        ${this._getFormItemContext()}`
  }
  _getFormItemContext() {
    return this.component.model.map(item => {
      if (item.isImage) {
        return `
          <el-form-item label="${item.text}" prop="${item.name}">
              <UploadFile
                ref="${item.name}Upload"
                :key="${item.name}UploadKey"
                :upload-file-url="upload.uploadFilePath"
                :file-list="${item.name}ImageList"
                :upload-limit="1"
                :before-upload="${item.name}BeforeUpload"
                :upload-file-params="{}"
                @imageIsValidateSuccess="${item.name}ImageIsValidateSuccess"
                @removeImage="${item.name}RemoveImage"
            />
          </el-form-item>
        `
      } else if (item.isSearchOptions) {
        return `
        <el-form-item label="${item.text}" prop="${item.name}">
          <el-select v-model="listQuery.${item.name}" placeholder="请选择" style="width:300px">
            <el-option
              v-for="item in optiosConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        `
      } else {
        return `
          <el-form-item label="${item.text}" prop="${item.name}">
            <el-input
                  v-model="ruleForm.${item.name}"
                  placeholder="请填写${item.text}"
                  style="width:300px"
                  maxlength="50"
                  type="text"
            />
          </el-form-item>
        `
      }
    }).join('\n     ')
  }
  getFormItemModel() {
    const columns = this.component.model.filter(item => item.isEdit === true).map(item => `${item.name}:""`)
    columns.unshift(`${this.component.primaryKey}:""`)
    return columns.join(',\n          ')
  }
  // this.$refs.multipleUpload.submit()
  // this.$refs.singleUpload.submit()
  generatorUpload() {
    return this.component.model.filter(item => item.isImage === true).map(item => {
      return `
        this.$refs.${item.name}Upload.submit()
      `
    }).join(',\n').replace(/,/g, '')
  }
  generatorImageListForm() {
    return this.component.model.filter(item => item.isImage === true).map(item => {
      if (item.isImage) {
        return `${item.name}ImageList:[]`
      }
    }).join(',\n          ')
  }
  generatorUploadKey() {
    return this.component.model.filter(item => item.isImage === true).map(item => {
      if (item.isImage) {
        return `${item.name}UploadKey:0`
      }
    }).join(',\n          ')
  }
  generatorSaveValidate() {
    return `
    save${this.initialsUpper(this.fileName)}(formName) {
        this.$refs[formName].validate(async(valid) => {
            if(valid){
              console.log("valid",valid);
              ${this.generatorUpload()}
              if (!this.isUpdate) {
                // pass
              }else{
                // pass
              }
            }
        })
    }
    `
  }
  getUploadMethods() {
    return this.component.model.filter(item => item.isImage).map(item => {
      if (item.isImage) {
        return `
          ${item.name}BeforeUpload(){
            this.ruleForm.${item.name} = true
          },
          ${item.name}ImageIsValidateSuccess(validate){
            if (!validate) {
              this.${item.name}UploadKey += 1
              this.${item.name}ImageList = []
              return
            }
            this.$set(this.ruleForm, '${item.name}', 'success')
          },
          ${item.name}RemoveImage(){
            this.$set(this.ruleForm, '${item.name}', '')
          }
          `
      }
    }).join(',\n          ') + ','
  }
  hasUploadImage() {
    return this.component.model.some(item => item.isImage)
  }
  getTemplate() {
    return `
<template>
  <div>
    <div class="app-container">
        <el-row :gutter="20" type="flex" justify="center">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                <el-form
                  ref="ruleForm"
                  :model="ruleForm"
                  :rules="rules"
                  label-width="150px"
                >
                ${this.getFormItemContext()}
                ${this.getButtonContext()}
                </el-form>
            </el-col>
        </el-row>
    </div>
  </div>
</template>

<script>
${
  this.hasUploadImage() ? `import UploadFile from '@/components/UploadFile/MultipleUploadFile'` : ''
}
import { validateRules } from './${this.fileName}.helper.js'
  export default {
    components: {
      ${
  this.hasUploadImage() ? ` UploadFile
        ` : ''
}
    },
      data(){
        return {
          loading: false,
          isUpdate: false,
          ${this.generatorUploadKey()}
          ruleForm:{
            ${this.getFormItemModel()}
          },
          rules: validateRules,
          ${
  this.hasUploadImage() ? `upload: {
              uploadFilePath:''
            },` : ''
}
${
  this.hasUploadImage() ? this.generatorImageListForm() : ''
}
        }
      },
      created() {
        this.initRouteParams()
      },
      methods:{
        initRouteParams() {
          const isUpdate = this.$route.params.isUpdate ? this.$route.params.isUpdate : false
          if (isUpdate) {
            this.isUpdate = isUpdate
          }
        },
        ${this.getUploadMethods().length===1?this.getUploadMethods().replace(/,/,''):this.getUploadMethods()}
        ${this.generatorSaveValidate()}
      }
    }
  </script>
  <style lang="scss">
    @import './${this.fileName}.scss';
  </style>`
  }
}
module.exports = {
  AddViewTemplate
}
