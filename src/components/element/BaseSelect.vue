<template>
  <div>
    <el-select
      ref="select"
      v-model="currentValue"
      :class="multiple ? 'multipleSelect' : 'baseSelect'"
      :clearable="clearable"
      :disabled="disabled"
      :placeholder="placeholder"
      :loading="currentLoading"
      :allow-create="allowCreate"
      :multiple="multiple"
      :no-data-text="noDataText"
      :filterable="filterable"
      :collapse-tags="collapseTags"
      :multiple-limit="multiplelimit"
      style="width:100%;"
      @change="selectChanged"
    >
      <el-option
        v-for="item in optionValues"
        :key="getKeyValue(item)"
        :label="getItemValue(item)"
        :value="getKeyValue(item)"
        :disabled="optionDisabled()(item)"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { pubApi } from "@/api/public_request";
export default {
  props: {
    // 远程获取数据的api地址
    api: {
      type: Object,
      default: null
    },
    selectOptions: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // api: {
    //   type: Function,
    //   default: null
    // },
    // 下拉中选择之后，进行显示的字段及其主键字段
    selectedField: {
      type: Array,
      default: function() {
        return ["value", "label"];
      }
    },
    prop: {
      type: String,
      default: ""
    },
    // v-model绑定的数据
    value: {
      type: [String, Number, Array],
      default: function() {
        return null;
      }
    },
    // 是否禁用修改
    disabled: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 是否可清除
    clearable: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 默认提示语
    placeholder: {
      type: String,
      default: function() {
        return "请选择数据";
      }
    },
    // 是否启用加载中显示（转圈圈）
    loading: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 是否启用多选
    multiple: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 多选时是否将选中值按文字的形式展示
    collapseTags: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 多选时用户最多可以选择的项目数，为 0 则不限制
    multiplelimit: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    // 可以利用搜索功能快速查找选项
    filterable: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 下拉数据源，不通过api加载
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 重新加载数据（每次取非即可）
    reload: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 查询参数
    queryParas: {
      type: Object,
      default: function() {
        return {};
      }
    },

    // 通过验证禁用某一项下拉数据
    optionDisabled: {
      type: Function,
      default: function() {
        return function(item) {
          return false;
        };
      }
    },
    // 列表查询调用的api字符串
    loadList: {
      type: String,
      default: function() {
        return "getList";
      }
    },
    allowCreate: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data: function() {
    return {
      optionValues: null,
      currentLoading: this.loading,
      noDataText: "加载中",
      count: 0,
      oldValue: null
    };
  },
  computed: {
    // 转换绑定的选中数据，与v-model同步
    currentValue: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.$emit("input", value);
      }
    },
    // 获取每一项下拉的key的字段名
    keyName() {
      return this.selectedField[0];
    },
    // 获取每一项下拉的显示值的字段名
    valueName() {
      return this.selectedField[1];
    }
  },
  watch: {
    loading: function(val) {
      this.currentLoading = val;
    },
    // 重载数据
    reload: function() {
      this.loadOptions();
    },
    options: function(val) {
      console.log(206, val);
      this.optionValues = val;
      this.currentLoading = false;
    },
    queryParas(val) {
      if (!this.UtilJs.isEmpty(val)) {
        this.loadOptions();
      }
    },
    selectOptions(val, oldVal) {
      console.log(215, val, oldVal);
    }
  },
  // 挂载后自动加载数据
  mounted: function() {
    this.loadOptions();
  },
  methods: {
    blur() {
      this.$refs.select.blur();
    },
    // 绑定每一项下拉的key
    getKeyValue: function(item) {
      // console.log(1, this.keyName);
      return item[this.keyName];
    },
    // 绑定每一项下拉的显示值
    getItemValue: function(item) {
      // console.log(2, this.valueName);
      return item[this.valueName];
    },
    // 加载下拉数据
    loadOptions: function() {
      const $this = this;
      this.currentLoading = true;
      if (this.options && this.options.length > 0) {
        this.optionValues = this.options;
        this.currentLoading = false;
        return;
      }
      if (this.api) {
        console.log(231, this.queryParas);
        this.api[this.loadList](this.queryParas).then(res => {
          console.log(234, res);
          if (res.msg === "执行成功" && res.data) {
            $this.optionValues = res.data;
            if (res.data.length === 0) {
              $this.noDataText = "无数据";
            }
            this.$emit("update:options", this.optionValues);
            this.$emit("loaded", this.optionValues);
          } else {
            $this.noDataHandle("加载失败");
          }
        });
      } else {
        let str = "数据源不合法";
        if (this.options.length === 0) {
          str = "无数据";
        }
        this.noDataHandle(str);
      }
      this.currentLoading = false;
    },
    selectChanged: function(key) {
      var $this = this;
      var selectItemts = null;
      const addList = [];
      const delList = [];
      const mySet = new Set();
      if (this.count === 0) {
        $this.oldValue = $this.currentValue;
        $this.count++;
      }
      if (!this.multiple) {
        selectItemts = this.optionValues.find(it => {
          return key === it[$this.keyName];
        });
      } else {
        if ($this.oldValue) {
          $this.oldValue.forEach(item => {
            const rs = key.some(it => {
              return item === it;
            });
            if (!rs) {
              delList.push(item);
            }
            mySet.add(item);
          });
          key.forEach(item => {
            const rs = $this.oldValue.some(it => {
              return item === it;
            });
            if (!rs) {
              addList.push(item);
            }
            mySet.add(item);
          });
          selectItemts = $this.optionValues.filter(it => {
            var isTrue = false;
            Array.from(mySet).forEach(kit => {
              if (kit === it[$this.selectedField[0]]) {
                isTrue = true;
              }
            });
            return isTrue;
          });
          selectItemts.forEach(item => {
            const rs = delList.some(it => {
              return it === item.keyId;
            });
            const r = addList.some(it => {
              return it === item.keyId;
            });
            if (rs) {
              item.statusFlag = "-1";
            }
            if (r) {
              item.statusFlag = "1";
            }
          });
        }
      }
      // 将this.prop地址返回给页面，用以区分不同的字段值
      this.$emit("selectChanged", key, this.prop, selectItemts);
    },
    // 没有数据的操作
    noDataHandle: function(text) {
      this.currentValue = null;
      this.optionValues = [];
      this.noDataText = text;
    }
  }
};
</script>
