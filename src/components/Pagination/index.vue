<template>
  <!-- :hide-on-single-page="true" 当只有一页时，通过设置 hide-on-single-page 属性来隐藏分页。-->
  <div class="page-box">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      prev-text="上一页"
      next-text="下一页"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      //   currentPage: 2
    };
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.$emit("currentChange", val);
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
<style lang="scss">
.page-box {
  height: 30px;
  line-height: 30px;
  margin: 8px 0 0;
  // background: hotpink;
}
</style>
