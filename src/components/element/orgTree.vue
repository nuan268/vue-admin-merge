<template>
  <el-cascader
    v-model="selected" clearable :props="{emitPath: false}"
    :options="options" :show-all-levels="false"></el-cascader>
</template>

<script>
  export default {
    // 组织机构树
    name: 'orgTree',
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
    },
    watch: {
      value (val) {
        this.selected = val
      },
      selected (val) {
        this.$emit('input', val)
      }
    }
  }
</script>
