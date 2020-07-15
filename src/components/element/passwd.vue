<template>
  <el-input placeholder="请输入密码" v-model="selected" show-password @blur="otherData"></el-input>
</template>

<script>
  export default {
    // 组织机构树
    name: 'orgTree',
    props: {
      value: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
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
    },
    methods: {
      otherData () {
        this.$emit('otherData', this.selected)
      }
    }
  }
</script>
