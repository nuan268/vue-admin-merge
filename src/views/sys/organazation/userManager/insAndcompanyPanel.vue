<template>
  <!-- 筛选搜索对话框 -->
  <DailogFrame
    :dialog-visible="showDailog"
    :title-name="`${typeVal.label}选择`"
    @closeDialog="closeDialog"
  >
    <template slot="content">
      <div>
        <span>关键字： </span>
        <el-input v-model="keyVal_" style="width: 200px;"> </el-input>
        <el-button type="primary" size="mini" @click="searchKey">
          搜索
        </el-button>
      </div>
      <MenuTree
        :menu-data="menuData"
        :key-val="keyVal"
        :default-expand="defaultExpand"
        :click-type="clickType"
        @closeInnerDialog="closeMuneTreeChoose"
        @on-change-keyVal="changeKeyVal"
        @clickNodeReslut="clickNodeReslut"
      ></MenuTree>
    </template>
  </DailogFrame>
</template>
<script>
import DailogFrame from "@/components/dailogPanel/frame";
import MenuTree from "@/components/menuTree";
export default {
  components: {
    DailogFrame,
    MenuTree
  },
  props: {
    clickType: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showDailog: false,
      typeVal: {},
      menuTreeTitle: "",
      defaultExpand: ["1"],
      menuData: [],
      keyVal: "",
      keyVal_: ""
    };
  },
  methods: {
    show(item, menuData) {
      this.typeVal = item;
      this.menuData = menuData;
      this.showDailog = true;
    },
    // 关闭对话框选择
    closeDialog() {
      this.showDailog = false;
    },
    closeMuneTreeChoose() {
      this.showDailog = false;
    },
    /* changeKeyVal */
    changeKeyVal(val) {
      // console.log(379, val);
      this.keyVal = val;
    },
    /* 菜单树中当前点击的树节点*/
    clickNodeReslut(data) {
      // console.log(384, data);
      this.$emit("getClickNode", data, this.typeVal);
      this.closeMuneTreeChoose();
      this.keyVal = "";
    },
    /* 搜索关键字  */
    searchKey() {
      console.log("搜索关键字", this.keyVal_);
      // this.$refs.menuTreeDom.executeFilter(this.keyVal);
    }
  }
};
</script>
