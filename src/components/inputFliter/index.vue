<template>
  <div class="input-filter">
    <el-form :inline="true" :model="formItem.value" class="demo-form-inline ">
      <el-form-item
        v-for="(item, index) in formItem"
        :label="`${item.label}：`"
        style="margin-right: 10px;"
      >
        <!-- :placeholder="`请输入${item.label}`" -->
        <!-- 普通输入框 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="item.value"
          :style="{
            width: item.width ? `${item.width}px` : `${defaultWidth}px`
          }"
          @keyup.enter.native="searchBtn"
        ></el-input>
        <!-- 下拉选择框 -->
        <el-select
          v-if="item.type === 'select'"
          v-model="item.value"
          clearable
          placeholder="请选择"
          :style="{
            width: item.width ? `${item.width}px` : `${defaultWidth}px`
          }"
          @change="changeResult($event, item)"
        >
          <el-option
            v-for="val in item.options"
            :key="val.value"
            :label="val.label"
            :value="val.value"
          >
          </el-option>
        </el-select>
        <!-- 带搜索按钮的框 -->
        <el-input
          v-if="item.type === 'searchInput'"
          v-model="item.value"
          class="search-input"
          :style="{
            width: item.width ? `${item.width}px` : `${defaultWidth}px`
          }"
          @focus="showChoosePanel(item)"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="showChoosePanel(item)"
          ></el-button>
        </el-input>
        <el-date-picker
          v-if="item.type === 'daterange'"
          v-model="item.value"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          style="vertical-align:middle;"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item v-show="showSearchBtn">
        <!-- 各页面按钮 -->
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="searchBtn"
        >
          查询
        </el-button>
        <el-button size="mini" @click="resetForm"> 重置 </el-button>
        <slot name="btnGroups"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "InputFilter",
  components: {},
  props: {
    formItem: {
      type: Array,
      default: () => []
    },
    showSearchBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultWidth: "140",
      selectOptions: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本周",
            onClick(picker) {
              const now = new Date();
              const nowDayOfWeek = now.getDay(); // 当前日
              const temp = nowDayOfWeek - 1; // 当前日和周一差几天
              const start = now - temp * 3600 * 1000 * 24;
              const end = start + 3600 * 1000 * 24 * 6;
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick(picker) {
              const now = new Date();
              const date = now.getDate(); // 当前日 14
              const temp = date - 1;
              const start = now - temp * 3600 * 1000 * 24;
              const end = start * 3600 * 1000 * 24 * 10;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本季度",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本季上月度",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  watch: {
    formItem(newVal, val) {
      this.selectOptions = newVal;
    }
  },
  methods: {
    /* 查询 */
    searchBtn() {
      console.log("searchBtn");
      this.$emit("searchBtn");
    },
    /* 重置 */
    resetForm() {
      this.$emit("resetForm");
    },
    changeResult(val, item) {
      // console.log(83, val, item);
      this.$emit("statusValChange", item);
    },
    showChoosePanel(item) {
      //   console.log(2343);
      this.$emit("filterPanel", item);
    }
  }
};
</script>
<style lang="scss">
.input-filter {
  .el-range-separator {
    line-height: 26px;
  }
}
</style>
<style lang="scss" scoped>
.input-filter {
  // display: inline-block;
  display: block;
  margin-top: 10px;
  .search-input {
    vertical-align: middle;
  }
}
</style>
