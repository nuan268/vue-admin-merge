/*组件名称*/
<template>
  <div class="column-text">
    <span> {{ columnText }} </span>
    <i v-if="iconTips" class="el-icon-plus" @click="showExtention"></i>
  </div>
</template>
<script>
// import xx from "@/xx";
export default {
  name: "CommonColumn",
  props: {
    columnText: {
      type: String,
      default: "",
      required: true
    },
    iconTips: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    showExtention() {
      this.$emit("showExtentionDetail");
    }
  }
};
</script>
<style lang="scss" scoped>
.column-text {
  font-size: 15px;
  font-style: oblique;
  color: #1890ff;
  border-bottom: 1px solid #ddd;
  margin: 8px 10px 25px 0;
  padding-bottom: 10px;
}
</style>
