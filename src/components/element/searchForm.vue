<template>
  <div>
    <el-form :model="newFormValue" id="searchForm" ref="searchForm">
      <el-row  type="flex" align="bottom">
        <el-col class="formitem">
          <template v-for="(it, ind) in componentList">
            <el-col :xs="layout === false ? 12 : 24" :sm="layout === false ? 12 : 24" :md="layout === false ? 12 : 24"
                    :lg="layout === false ? 8 : 12" :xl="layout === false ? 8 : 12"  :key="ind">
              <el-form-item :label="it.label" :label-width="it.lableWidth ? it.lableWidth : '100px'" :prop="it.prop">
                <component class="searchForm" :placeholder="''"
                  :clearable="it.clearable"
                  :reload="it.reload"
                  :multiple="it.multiple" :options="it.options"
                  :disabled="it.disabled"
                  :type="it.type"
                  :tags="true"
                  :name="it.name"
                  :queryParas="buildQueryParas(it.queryName, it.queryValue)"
                  :cascaderProps="it.cascaderProps"
                  :selectedField="it.selectedField"
                  v-model="newFormValue[it.value]"
                  :value-format="it.format"
                  :is="it.componentName"
                  :collapsetags="true"
                  :dictTypeCode="it.dictTypeCode"
                  :amount.sync="newFormValue[it.amount]"
                  :api="it.api"
                  :tagCode="it.tagCode"
                  :default-time="it.defaultTime"
                  :start-placeholder="it.startPlaceholder"
                  :end-placeholder="it.endPlaceholder"
                  :loadList="it.loadList"
                  @selectChanged="selectChanged">
                </component>
              </el-form-item>
            </el-col>
          </template>
          <el-form-item class="formBottom">
            <auth-button size="small" v-if="isShowSearchBtn" type="primary" :label="'查询'" :menuCode="menuCode" :perms="searchPerms" icon="el-icon-search" @click="handleFilter"></auth-button>
            <auth-button size="small" v-if="isShowResetBtn" :label="'重置'" :menuCode="menuCode" :perms="resetPerms" icon="el-icon-refresh" @click="clearParam"></auth-button>
            <slot name="btnArea"></slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import BaseSelect from '@/components/element/BaseSelect'
  import AuthButton from '@/components/auth/authButton'
  import dict from '@/components/element/SelectDictionary.vue' // 字典组件
  // import officeTree from '@/components/element/officeTree.vue' // 公司树
  // import orgTree from '@/components/element/orgTree.vue' // 根据公司树查询下面机构
  // import orgTreeAll from '@/components/element/orgTreeAll.vue' // 查询所有机构
  import BaseCascader from '@/components/element/BaseCascader.vue' // 动态树base
  import passwd from '@/components/element/passwd.vue' // 密码
  import cascaderCompany from '@/components/element/CascaderCompany.vue' // 公司选择
  import cascaderDepartment from '@/components/element/CascaderDepartment.vue' // 部门选择
  import cascaderOrg from '@/components/element/CascaderOrg.vue' // 机构选择（公司+部门）
  export default {
    components: {
      BaseSelect,
      AuthButton,
      dict,
      // officeTree,
      // orgTree,
      // orgTreeAll,
      BaseCascader,
      passwd,
      cascaderCompany,
      cascaderDepartment,
      cascaderOrg
    },
    props: {
      // 所属菜单Code-->全局唯一
      menuCode: {
        type: String,
        default: null
      },
      // 搜索按钮权限标识，外部使用者传入
      searchPerms: {
        type: String,
        default: null
      },
      // 重置按钮权限标识，外部使用者传入
      resetPerms: {
        type: String,
        default: null
      },
      componentList: {
        type: [Array],
        required: false
      },
      formValue: {
        type: [Object]
      },
      // 布局
      layout: {
        type: Boolean,
        default: false
      },
      // 是否显示搜索按钮
      isShowSearchBtn: {
        type: Boolean,
        default: true
      },
      // 是否显示重置按钮
      isShowResetBtn: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        selectObj: {},
        // 是否显示所有查询数据条件
        showqQuery: true,
        // 列表实际显示的数据
        showComList: []
      }
    },
    computed: {
      newFormValue: {
        get: function () {
          return this.formValue
        },
        set: function (value) {
          this.$emit('update:formValue', value)
        }
      },
      rowCount () {
        let s = parseInt(this.componentList.length / 3)
        let y = this.componentList.length % 3
        if (y === 0) {
          return s
        } else {
          return s + 1
        }
      }
    },
    methods: {
      handleFilter () {
        this.$emit('handleFilter')
      },
      clearParam () {
        this.$emit('clearParam')
      },
      selectChanged (index, name, row) {
        this.selectObj[name + 'Info'] = row
        this.$emit('selectChanged', this.selectObj)
      },
      buildQueryParas (queryName, queryValue) {
        let obj = {}
        if (typeof (queryName) === 'string') {
          obj[queryName] = this.formValue[queryValue]
        } else if (queryName !== undefined) {
          let list = []
          queryName.forEach((item, index) => {
            let v = queryValue[index]
            if (item === 'enterpriseIds') {
              list.push(this.formValue[v])
              obj[item] = list
            } else {
              obj[item] = this.formValue[v]
            }
          })
        }
        return obj
      }
    }
  }
</script>
<style>
  #searchForm .el-form-item{
    margin-bottom: 10px;
  }
  #searchForm .formBottom {
    float: right;
    margin: 0;
  }
  #searchForm .formitem {
    position: relative;
  }
  #searchForm .updown {
    position: absolute;
    left: 50%;
    bottom: -15px;
    cursor: pointer;
    color: darkgrey;
    width: 100px;
    text-align: center;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
  }
  #searchForm .updown i {
    transition: .3s;
  }
  #searchForm .updown span {
    transform: translateY(20px);
    font-size: 14px;
    transition: .3s;
    display: inline-block;
    overflow: hidden;
    word-wrap: normal;
  }
  #searchForm .updown:hover {
    color: #409Eff;
  }
  #searchForm .updown:hover i {
    transform: translateY(-4px);
  }
  #searchForm .updown:hover span {
    transform: translateY(0px);
  }
</style>
