<!-- 机构选择控件（公司+部门+用户） CascaderOrg -->
<template>
  <div>
    <el-cascader
      v-model="selected"
      clearable
      :props="{ multiple: multiple }"
      :disabled="disabled"
      :placeholder="''"
      :options="options"
      :show-all-levels="false"
      filterable
    ></el-cascader>
  </div>
</template>

<script>
// import { orgApi } from "@/api/component/componentApi";
export default {
  // 机构树（公司+部门+用户）
  name: "CascaderOrgUser",
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
    }
  },
  data() {
    return {
      options: [],
      selected: []
    };
  },
  watch: {
    value(val) {
      this.selected = val;
    },
    selected(val) {
      this.$emit("input", val);
    }
  },
  created() {
    this.selected = this.value;
    this.getData();
  },
  methods: {
    getData() {
      // orgApi.getOrgUserTreeData("0").then(res => {
      //   this.options = this.getTreeData(res.data);
      // });
    },
    // 递归方法
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    }
  }
};
</script>
