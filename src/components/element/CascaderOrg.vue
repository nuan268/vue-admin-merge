<!-- 机构选择控件（公司+部门） CascaderOrg -->
<template>
  <el-cascader
    v-model="selected" clearable :props="{emitPath: emitPath, checkStrictly: checkStrictly, multiple: multiple}"
    :disabled="disabled" :placeholder="''"
    :options="options" :show-all-levels="false" filterable ></el-cascader>
</template>

<script>
  // import {orgApi} from '@/api/component/componentApi'
  export default {
    // 机构树（公司+部门）
    name: 'cascaderOrg',
    props: {
      value: {
        type: [Array, String],
        default: null
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      emitPath: {
        type: Boolean,
        default: false
      },
      checkStrictly: {
        type: Boolean,
        default: true
      },
      tagId: {
        type: String,
        default: ''
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
        // orgApi.getOrgTreeData(this.tagId).then(res => {
        //   this.options = res.data
        // })
      }
    }
  }
</script>
