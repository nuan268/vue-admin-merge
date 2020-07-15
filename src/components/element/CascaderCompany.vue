<!-- 公司选择控件 CascaderCompany -->
<template>
  <el-cascader
    v-model="selected" clearable :props="{emitPath: false, checkStrictly: true}"
    :disabled="disabled" :placeholder="''"
    :options="options" :show-all-levels="false" filterable ></el-cascader>
</template>

<script>
  // import {orgApi} from '@/api/component/componentApi'
  export default {
    // 公司树
    name: 'cscaderCompany',
    props: {
      value: {
        type: [Array, String],
        default: null
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
      this.getData()
    },
    watch: {
      value (val) {
        this.selected = val
      },
      selected (val) {
        this.$emit('input', val)
      }
    },
    methods: {
      getData () {
        // orgApi.getCompanyTreeData().then(res => {
        //   this.options = res.data
        // })
      }
    }
  }
</script>
