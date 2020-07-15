<template>
  <div>
    <el-select :clearable="clearable" v-model="currentValue"
                :collapse-tags="tags"
                :multiple="multiple"
               :style="{ width : width}"
               @change="selectChanged"
               :disabled="currentDisabled" :placeholder="placeholder" no-data-text="加载中">
      <el-option v-for="item in options" :key="item.dictId" :label="item.dictName" :value="item.dictId">
      </el-option>
    </el-select>
    <input type="hidden" v-model="value"/>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      tags: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      value: {
        type: [Number, String, Array],
        default: function () {
          return null
        }
      },
      disabled: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      clearable: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      multiple: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      addItems: {
        type: Array,
        default: function () {
          return null
        }
      },
      exclude: {
        type: Array,
        default: function () {
          return []
        }
      },
      placeholder: {
        type: String,
        default: function () {
          return '请选择'
        }
      },
      sys: { // TODO 子系统，目前未区分
        type: [String, Number],
        default: function () {
          return null
        }
      },
      // 重新加载数据（每次取非即可）
      reload: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      width: {
        type: String,
        default: function () {
          return '100%'
        }
      },
      name: {
        type: String
      },
      // 查询参数
      queryParas: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
        'currentDisabled': this.disabled,
        'options': null,
        count: 0,
        oldValue: null
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.loadOptions()
      })
    },
    computed: {
      optionValues: {
        get: function () {
          return this.options
        },
        set: function (options) {
          let exclueds = this.exclude || []
          // 过滤要排除的
          let tmpOpts
          if (options) {
            if (exclueds && exclueds.length > 0) {
              tmpOpts = options.filter(item => {
                return !exclueds.some(e => e.dictId === item.dictId)
              })
            } else {
              tmpOpts = options
            }
          } else {
            this.options = []
            return
          }
          // 先添加要追加的
          if (this.addItem && this.addItem.length > 0) {
            tmpOpts.push(this.addItem)
          }
          this.options = tmpOpts
        }
      },
      currentValue: {
        get: function () {
          return this.buildCurrentValue(this.value)
        },
        set: function (value) {
          this.$emit('input', value)
        }
      }
    },
    methods: {
      loadOptions: function () {
        if (!this.UtilJs.isEmpty(this.queryParas.pid)) return
        let $this = this
        this.$store.dispatch('GetDictionary', {sys: this.sys, dictTypeCode: 'ZD0006'}).then(res => {
          let arr = res.filter(it => it.pid === this.queryParas.pid)
          $this.optionValues = arr
          this.getSelectChange(res)
        })
      },
      buildCurrentValue: function (value) {
        if (this.multiple && !this.UtilJs.isEmpty(value)) {
          return value
        }
        if (this.multiple && this.UtilJs.isEmpty(value)) {
          return []
        }
        return value
      },
      selectChanged: function (key) {
        var $this = this
        var selectItemts = null
        let addList = []
        let delList = []
        let mySet = new Set()
        if (this.count === 0) {
          $this.oldValue = $this.currentValue
          $this.count ++
        }
        if (!this.multiple) {
          selectItemts = this.optionValues.find(it => {
            return key === it['dictId']
          })
        } else {
          $this.oldValue.forEach(item => {
            let rs = key.some(it => { return item === it })
            if (!rs) {
              delList.push(item)
            }
            mySet.add(item)
          })
          key.forEach(item => {
            let rs = $this.oldValue.some(it => { return item === it })
            if (!rs) {
              addList.push(item)
            }
            mySet.add(item)
          })
          selectItemts = $this.optionValues.filter(it => {
            var isTrue = false
            Array.from(mySet).forEach(kit => {
              if (kit === it['dictId']) {
                isTrue = true
              }
            })
            return isTrue
          })
          selectItemts.forEach(item => {
            let rs = delList.some(it => { return it === item.dictId })
            let r = addList.some(it => { return it === item.dictId })
            if (rs) {
              item.statusFlag = '-1'
            }
            if (r) {
              item.statusFlag = '1'
            }
          })
        }
        if (!$this.UtilJs.isEmpty($this.name)) {
          $this.$emit('selectChanged', key, $this.name, selectItemts)
        }
      },
      getSelectChange (val) {
        let $this = this
        let selectItemts = null
        if (val.length > 0) {
          if (!this.multiple) {
            selectItemts = val.find(it => {
              return $this.currentValue === it['dictId']
            })
          } else {
            selectItemts = val.filter(it => {
              var isTrue = false
              $this.currentValue.forEach(kit => {
                if (kit === it['dictId']) {
                  isTrue = true
                }
              })
              return isTrue
            })
          }
          if (!$this.UtilJs.isEmpty($this.name)) {
            this.$emit('selectChanged', '', this.name, selectItemts)
          }
        }
      }
    },
    watch: {
      dictType: function (value, old) {
        this.loadOptions()
      },
      disabled: function (value) {
        this.currentDisabled = value
      },
      // 重载数据
      reload: function () {
        this.loadOptions()
      },
      queryParas: function (value) {
        if (!this.UtilJs.isEmpty(value.pid)) {
          let $this = this
          this.$store.dispatch('GetDictionary', {sys: this.sys, dictTypeCode: 'ZD0006'}).then(res => {
            let arr = res.filter(it => it.pid === value.pid)
            $this.optionValues = arr
            this.getSelectChange(arr)
          })
        } else {
          this.optionValues = []
        }
      }
    }
  }
</script>

<style>

</style>
