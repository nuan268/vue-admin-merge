<!-- 部门选择控件 CascaderDepartment -->
<template>
  <el-cascader
    v-model="selected" clearable :props="{emitPath: false, checkStrictly: true}"
    :disabled="disabled" :placeholder="''"
    :options="options" :show-all-levels="false" filterable ></el-cascader>
</template>

<script>
  // import {orgApi} from '@/api/component/componentApi'
  export default {
    // 部门树
    name: 'cascaderDepartment',
    props: {
      value: {
        type: [Array, String],
        default: null
      },
      // 公司id
      companyId: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        options: [],
        selected: ''
      }
    },
    created () {
      this.selected = this.value
    },
    watch: {
      value (val) {
        this.selected = val
      },
      selected (val) {
        this.$emit('input', val)
      },
      companyId: {
        immediate: true,
        handler: function (val) {
          if (val == null || val === '') {
            this.options = []
          } else {
            this.getData()
          }
        }
      }
    },
    methods: {
      getData () {
        orgApi.getDepartmentTreeData(this.companyId).then(res => {
          this.options = res.data
        })
      }
    }
  }
</script>
