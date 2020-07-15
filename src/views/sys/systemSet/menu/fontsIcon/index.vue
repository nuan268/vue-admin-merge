<template>
  <div>
    <el-dialog
      ref="dialog__wrapper"
      v-dialogDrag
      :append-to-body="true"
      :visible.sync="innerVisible"
      :title="titleType"
      width="60%"
      @closeDialog="closeEditDialog"
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabArr"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <component
            :is="item.componentName"
            @iconChoose="iconChoose"
          ></component>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="color">
        提示：双击选择图标
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DailogFrame from "@/components/dailogPanel/frame";
import FontAwesomeIcons from "./fontAwesomeIcons";
import SimpleLineIcons from "./simpleLineIcons";
import Glyphicons from "./glyphicons";
export default {
  name: "FontIconChoose",
  components: {
    FontAwesomeIcons,
    SimpleLineIcons,
    Glyphicons,
    DailogFrame
  },
  props: {},
  data() {
    return {
      innerVisible: false,
      titleType: "图标选择",
      tabArr: [
        {
          label: "Simple Line Icons",
          name: "first",
          componentName: "SimpleLineIcons"
        },
        {
          label: "Font Awesome Icons",
          name: "second",
          componentName: "FontAwesomeIcons"
        },
        {
          label: "Glyphicons",
          name: "third",
          componentName: "Glyphicons"
        }
      ],
      activeName: "first"
    };
  },

  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /* 显示对话框  编辑机构  新增下级机构  新增机构*/
    show(row, type) {
      console.log(63);
      this.innerVisible = true;
    },
    iconChoose(iconName) {
      this.$emit("iconChoose", iconName);
      this.closeEditDialog();
    },
    // 关闭对话框选择
    closeEditDialog() {
      //   this.resetForm();
      this.innerVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.color {
  color: #f00;
  text-align: left;
}
</style>
