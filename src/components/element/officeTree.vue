<template>
  <el-cascader
    v-model="value"
    clearable
    :props="{emitPath: false, checkStrictly: true}"
    :disabled="disabled"
    :options="options"
    :show-all-levels="false"
    filterable
  ></el-cascader>
</template>

<script>
// import componentApi from '@/api/component/componentApi'
export default {
  // 公司树
  name: 'OfficeTree',
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
  data() {
    return {
      options: []
      // selected: ''
    }
  },
  created() {
    // this.selected = this.value
    this.getData()
  },
  // watch: {
  //   value (val) {
  //     this.selected = val
  //   },
  //   selected (val) {
  //     this.$emit('input', val)
  //   }
  // },
  methods: {
    getData() {
      // componentApi.officeTree.getList().then(res => {
      //   this.options = res.data
      // })
    }
  }
}
</script>
