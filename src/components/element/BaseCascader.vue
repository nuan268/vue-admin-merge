<template>
  <el-cascader
    v-model="selected" clearable :props="cascaderProps" @focus="onfoucs" :placeholder="placeholder"
    :disabled="disabled"
    :options="options" :show-all-levels="false"></el-cascader>
</template>

<script>
  export default {
    // 动态树
    name: 'BaseCascader',
    props: {
      value: {
        type: [Array, String],
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      options: {
        type: Array,
        default: function () {
          return []
        }
      },
      cascaderProps: {
        type: Object,
        default: function () {
          return {}
        }
      },
      placeholder: {
        type: String,
        default: '请选择'
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
      onfoucs () {
        this.$emit('otherData')
      }
    }
  }
</script>
