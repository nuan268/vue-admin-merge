<template>
  <el-container class="crm-container">
    <el-header v-show="headerVisible" class="crm-header">
      {{ header }}
      <div style="float:right" v-if="isBack">
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          size="small"
          @click="back"
          >上一页</el-button
        >
      </div>
      <div style="float:right" v-if="isSearch">
        <el-button
          type="primary"
          icon="el-icon-arrow-up"
          :title="'隐藏查询条件'"
          v-if="handleFlag"
          @click="handleFlag = false"
          >隐藏</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-arrow-down"
          :title="'显示查询条件'"
          v-else
          @click="handleFlag = true"
          >查询</el-button
        >
      </div>
    </el-header>
    <transition name="fade" mode="out-in">
      <el-main class="crm-main" v-show="handleFlag">
        <div class="filter-container">
          <slot name="query"></slot>
        </div>
      </el-main>
    </transition>
    <hr class="hr-style" />
    <el-footer class="crm-footer">
      <slot name="table"></slot>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  components: {},
  props: {
    header: {
      type: [String],
      default() {
        return "";
      }
    },
    headerVisible: {
      type: Boolean,
      default() {
        return true;
      }
    },
    isBack: {
      type: Boolean,
      default: false
    },
    topath: {
      type: [String, Object],
      default: null
    },
    // 默认显示查询区域
    isSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      handleFlag: false
    };
  },
  computed: {
    curHandleFlag: {
      get: function() {
        return this.handleFlag;
      },
      set: function(value) {
        this.$emit("update:handleFlag", value);
      }
    }
  },
  methods: {
    back() {
      this.$emit("backMethod");
    }
  }
};
</script>
<style scope>
.hr-style {
  margin: 0px;
  height: 6px;
  border: 0px;
  color: rgb(198, 218, 255);
}
</style>
