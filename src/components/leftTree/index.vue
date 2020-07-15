<template>
  <div class="left-tree">
    <div class="part-left">
      <i class="fa icon-grid"></i>
      <span>{{ titleName }}</span>
      <i v-show="showEditBtn" class="el-icon-edit" @click="goTo"></i>
      <i
        :class="[expandAll ? 'fa fa-chevron-up' : 'fa fa-chevron-down']"
        @click="switchStatus"
      ></i>
      <i class="fa fa-refresh" @click="reSwitchStatus"></i>
    </div>
    <MenuTree
      ref="menuTreeDom"
      :expand-all="expandAll"
      :menu-data="menuData"
      :default-expand="[$attrs['default-expand']]"
      v-on="$listeners"
    ></MenuTree>
  </div>
</template>
<script>
import MenuTree from "@/components/menuTree";

export default {
  components: {
    MenuTree
  },
  props: {
    titleName: {
      type: String,
      default: ""
    },
    menuData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    showEditBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expandAll: false,
      // defaultExpand: ["YD"],
      menuData2: [
        {
          label: "苑东生物",
          id: "1",
          children: [
            {
              id: "1-1",
              label: "成都硕德",
              children: [
                {
                  id: "1-1-1",
                  label: "质量保证部"
                },
                {
                  id: "1-1-2",
                  label: "财务部"
                }
              ]
            },
            {
              id: "2-1",
              label: "成都优洛生物",
              children: [
                {
                  id: "2-1-1",
                  label: "质量保证部"
                },
                {
                  id: "2-1-2",
                  label: "财务部"
                },
                {
                  id: "2-1-3",
                  label: "生产技术部"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    goTo() {
      this.$emit("goToIt");
    },
    /* 展开或收起选项 */
    switchStatus() {
      this.expandAll = !this.expandAll;
      this.$refs.menuTreeDom.showOrHiddenAllNodes();
    },
    /* 指定展开一级 */
    reSwitchStatus() {
      this.$refs.menuTreeDom.expandFirst(this.menuData);
      // this.$refs.tree.store.nodesMap[data.id].expanded = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.left-tree {
  width: 100%;
  line-height: 45px;
  text-align: left;
  text-indent: 5px;
  // outline: 1px solid red;
  .part-left {
    border-bottom: 1px solid #eee;
    width: 200px;
  }
}
</style>
