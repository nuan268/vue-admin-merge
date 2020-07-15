<template>
  <div class="institution">
    <div id="institutionLeft" class="institution-left">
      <InstitutionLeft
        id="bar"
        :inst-menu-data="instMenuData"
        :default-expand="defaultExpand"
        class="bar transition-box"
        @clickNodeReslut="clickNodeReslut"
      ></InstitutionLeft>
      <span id="btn" class="toglebtn">
        <i
          :class="arrow === true ? 'el-icon-caret-right' : 'el-icon-caret-left'"
          class="icon-position"
        ></i>
      </span>
    </div>
    <div id="institutionRight" class="institution-right">
      <InstitutionRight
        ref="institutionRight"
        :inst-menu-data="instMenuData"
      ></InstitutionRight>
    </div>
  </div>
</template>
<script>
import InstitutionLeft from "./institutionLeft";
import InstitutionRight from "./institutionRight";
import { orgApi } from "@/api/organization";
import { toTreeData } from "@/utils/pubFunc";
export default {
  name: "InstitutionManage",
  components: {
    InstitutionLeft,
    InstitutionRight
  },
  data() {
    return {
      arrow: true,
      instMenuData: [],
      defaultExpand: ""
    };
  },
  created() {
    this.$store.dispatch("publicData/getOfficeMenuTree");
  },
  mounted() {
    this.init();
    this.getInsMenuTree();
  },
  methods: {
    init() {
      const _this = this;
      const btn = document.getElementById("btn");
      const institutionLeft = document.getElementById("institutionLeft");
      const institutionRight = document.getElementById("institutionRight");
      const bar = document.getElementById("bar");
      btn.addEventListener(
        "click",
        function() {
          _this.arrow = !_this.arrow;
          const elWidth = institutionLeft.style.width;
          if (elWidth !== "0px") {
            bar.style.display = "none";
            institutionLeft.style.width = "0px";
            institutionRight.style.width = "100%";
          } else {
            institutionLeft.style.width = "200px";
            institutionRight.style.width = "calc(100% - 200px)";
            setTimeout(function() {
              bar.style.display = "block";
            }, 800); //
          }
        },
        false
      );
    },
    getInsMenuTree() {
      orgApi.getInstitutionMenuTree({ ctrlPermi: 2 }).then(res => {
        const attributes = {
          id: "id",
          parentId: "pId",
          label: "name",
          rootId: "0"
        };
        const treeData = toTreeData(res, attributes);
        this.instMenuData = treeData;
        this.defaultExpand = treeData[0].id;
        // console.log("treeData", treeData[0].id);
      });
    },
    // 单击树节点获取数据查询结果
    clickNodeReslut(data) {
      console.log("左侧树节点双击", data);
      if (data.type === "click") {
        this.$refs.institutionRight.searchBtn({
          officeCode: data.data.id,
          left: "left"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.institution {
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  .institution-left {
    width: 200px;
    position: relative;
    display: inline-block;
    height: 100%;
    border-right: 10px solid #fafafa;
    transition: width 1s;
    -webkit-transition: width 1s;
    .bar {
      width: 200px;
      height: 100%;
      // transition: width 1s;
      // -webkit-transition: width 1s;
    }
    .toglebtn {
      position: absolute;
      display: inline-block;
      top: 200px;
      left: 100%;
      background: #eee;
      height: 70px;
      width: 10px;
      line-height: 70px;
      .icon-position {
        margin-left: -3px;
      }
    }
  }
  .institution-right {
    display: inline-block;
    width: calc(100% - 200px);
  }
  .td-color {
    color: #1890ff;
    cursor: pointer;
  }
  .table-witth {
  }
}
</style>
