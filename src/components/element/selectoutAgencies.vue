<!-- 律所下拉框 -->
<template>
  <div>
    <base-select v-model="currentValue"
                 :clearable="clearable"
                 :filterable="filterable "
                 :multiple="multiple"
                 :api="api"
                 :options.sync="options"
                 :queryParas="queryParas"
                 :collapsetags="collapsetags"
                 :selectedField="selectedField"
                 :disabled="disabled"
                 :reload="reload"
                 @loaded="loaded"
                  loadList="getAgencies"
                 :placeholder="placeholder"
                 @select-changed="selectChanged"
                 no-data-text="数据加载中或加载失败">
    </base-select>
  </div>
</template>
                

<script>
  import sysApi from '@/api/sysApi'
  import assetRegisterApi from '@/api/assetRegisterApi'

  import BaseSelect from '@/components/element/BaseSelect'
  export default {
    components: {
      BaseSelect
    },
    props: {
      // v-model绑定的数据
      value: {
        type: [Array, String],
        default: function () {
          return null
        }
      },
      // 是否禁用修改
      disabled: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      // 是否可多选
      multiple: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      // 重新加载数据（每次取非即可）
      reload: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      // 是否可搜索
      filterable: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      // 是否可清除
      clearable: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      // 多选折叠
      collapsetags: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      // 默认提示语
      placeholder: {
        type: String,
        default: function () {
          return '请选择'
        }
      },
      name: {
        type: String,
        require: false
      }
    },
    data () {
      return {
        // 下拉列表数据
        'options': [],
        selectedField: ['keyId', 'institutionName'],
        queryParas: {
        }
      }
    },
    // 创建后自动加载数据
    created () {
      // this.$nextTick(function () {
      //   this.loadOptions()
      // })
    },
    computed: {
      // 转换绑定的选中数据，与v-model同步
      currentValue: {
        get: function () {
          return this.value
        },
        set: function (value) {
          this.$emit('input', value)
        }
      },
      api: function () {
        return assetRegisterApi.projectAssetOthers
      },
      nonameApi () {
        return sysApi
      }
    },
    methods: {
      selectChanged (val, row) {
        this.$emit('selectChanged', val, this.name, row)
      },
      loaded (val) {
        let $this = this
        let selectItemts = null
        if (val.length > 0) {
          if (!this.multiple) {
            selectItemts = val.find(it => {
              return $this.currentValue === it[$this.selectedField[0]]
            })
          } else {
            selectItemts = val.filter(it => {
              var isTrue = false
              $this.currentValue.forEach(kit => {
                if (kit === it[$this.selectedField[0]]) {
                  isTrue = true
                }
              })
              return isTrue
            })
          }
          this.$emit('selectChanged', '', this.name, selectItemts)
        }
      }
      // 加载下拉数据
      // loadOptions () {
      //   let $this = this
      //   sysApi.lawFirm.getList(this.params).then(response => {
      //     if (response && response.data) {
      //       $this.options = response.data
      //     }
      //   })
      // }
    },
    watch: {
      // options (val, old) {
      //   let $this = this
      //   let selectItemts = null
      //   if (val.length > 0 && old.length !== val.length) {
      //     if (!this.multiple) {
      //       selectItemts = val.find(it => {
      //         return $this.currentValue === it[$this.selectedField[0]]
      //       })
      //     } else {
      //       selectItemts = val.filter(it => {
      //         let isTrue = false
      //         $this.currentValue.forEach(kit => {
      //           if (kit === it[$this.selectedField[0]]) {
      //             isTrue = true
      //           }
      //         })
      //         return isTrue
      //       })
      //     }
      //     this.$emit('selectChanged', '', this.name, selectItemts)
      //   }
      // }
    }
  }
</script>
