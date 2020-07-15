<template>
    <el-autocomplete
      class="inline-input"
      v-model="selected"
      :fetch-suggestions="querySearch" @blur="blur"
      placeholder="请输入内容" :disabled="disabled"
      @select="handleSelect" :trigger-on-focus="triggerFocus"
    ></el-autocomplete>
</template>

<script>
  export default {
    // 自动补充输入框
    name: 'autocomplete',
    props: {
      // 传入数据
      value: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否点击后加载列表
      triggerFocus: {
        type: Boolean,
        default: true
      },
      // 数据源
      options: {
        type: Array,
        default: function () {
          return []
        }
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
      },
      querySearch (queryString, cb) {
        var options = this.options
        var results = queryString ? options.filter(this.createFilter(queryString)) : options
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect (item) {
        console.log('item', item)
      },
      blur () {
        this.$emit('blur', 'autoComplete')
      }
    }
  }
</script>
