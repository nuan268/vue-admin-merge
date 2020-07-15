<template>
  <el-dialog
    ref="dialog__wrapper"
    v-dialogDrag
    :visible.sync="dialogVisible"
    :width="width"
    :before-close="handleClose"
    :title="titleName"
    :append-to-body="appToBody"
  >
    <!-- // 这里的插槽会替换title显示的内容 -->
    <div
      slot="title"
      class="header-title"
      style="border-bottom: 1px solid #eee; padding-bottom: 10px;"
    >
      <slot name="title">{{ titleName }}</slot>
    </div>
    <div class="dialog-body">
      <el-backtop target=".el-dialog__body" :right="230" :bottom="120">
        <div class="back-top">
          <i class="el-icon-top"></i>
        </div>
      </el-backtop>
      <div>
        <slot name="content"> </slot>
      </div>
      <div class="dialog-footer">
        <slot name="footer"> </slot>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import draggable from "vuedraggable";
export default {
  name: "DailogPane",
  // components: {
  //   draggable
  // },
  props: {
    titleName: {
      type: String,
      default: "提示"
    },
    width: {
      type: String,
      default: "80%"
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    appToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //   dialogVisible: false,
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog");
    }
  }
};
</script>
<style lang="scss">
.el-dialog__header {
  padding: 15px 10px;
  background: #fff;
}
.el-dialog__body {
  position: relative;
  // background: #f4f6f8;
  padding: 5px 20px 20px;
  height: 70vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.dialog-footer {
  padding: 20px 0;
}
.back-top {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: #f2f5f6;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  text-align: center;
  line-height: 40px;
  border-radius: 4px;
  color: #1989fa;
}
</style>
<style lang="scss" scoped></style>
