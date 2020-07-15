<template>
  <el-cascader
    v-model="selected" clearable :disabled="disabled" :props="defaultParams"
    :options="options" :show-all-levels="false"></el-cascader>
</template>

<script>
  import platformApi from '@/api/platformApi'
  export default {
    // 组织机构树
    name: 'orgTree',
    props: {
      value: {
        type: [String, Array],
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      amount: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        options: [],
        selected: '',
        defaultParams: {
          checkStrictly: true
        }
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
        platformApi.orgTreeAll().then(res => {
          this.options = res.data
        })
      }
    }
  }
</script>
