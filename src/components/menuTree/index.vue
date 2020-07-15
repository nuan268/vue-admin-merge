<template>
  <div class="tree-menu">
    <el-tree
      ref="menuTreeNode"
      :data="menuData"
      :props="defaultProps"
      empty-text="暂无数据"
      :highlight-current="true"
      node-key="id"
      :check-strictly="checkStrictly"
      :default-expand-all="expandAll"
      :default-expanded-keys="defaultExpand"
      :filter-node-method="filterNode"
      :default-checked-keys="checkedArr"
      :show-checkbox="showCheckbox"
      :click-type="clickType"
      @node-click="handleNodeClick"
      @check="clickDeal"
    ></el-tree>
    <!-- @check-change="handleCheckChange" -->
  </div>
</template>
<script>
// import debounce from "lodash/debounce";
import { debounce } from '@/utils'
export default {
  name: "MenuTree",
  props: {
    /* 树节点的值 */
    menuData: {
      type: Array,
      default: () => []
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    defaultExpand: {
      type: Array,
      default: () => []
    },
    /* 显示复选框 */
    showCheckbox: {
      type: Boolean,
      default: false
    },
    checkedArr: {
      type: Array,
      default: () => []
    },
    titleName: {
      // 主要用来区分同个页面多个弹窗选择
      type: String,
      default: ""
    },
    clickType: {
      type: Boolean,
      default: true
    },
    clickResource: {
      type: String,
      default: ""
    },
    /* 需要获取全部祖父级节点事添加的属性 */
    parentNode: {
      type: Boolean,
      default: false
    }
    // checkStrictly: {
    //   // 子父级是否关联选中
    //   type: Boolean,
    //   default: true
    // }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
        titleNameVal: ""
      },
      clickCount: 0,
      dbIsTrue: false,
      checkStrictly: true
    };
  },
  watch: {
    clickType: {
      handler(newVal, val) {
        // this.dbIsTrue = newVal;
      },
      immediate: true
    },
    titleName: {
      handler(newVal, val) {
        this.titleNameVal = newVal;
      },
      immediate: true
    }
  },
  // updated() {
  //   // 给多选树设置默认值 参数 id 组成的数组
  //   console.log("this.checkedArr", this.checkedArr);
  //   this.$refs.menuTreeNode.setCheckedKeys(this.checkedArr);
  // },
  methods: {
    /* 当前点击的节点 */
    handleNodeClick(data) {
      // console.log(108); this.dbIsTrue
      // 发送双击事件
      // if (this.dbIsTrue) {
      const _this = this;
      this.clickCount++;
      var param = data;
      const fnEmitDblClick = debounce(() => {
        if (this.parentNode) {
          const selectNode = this.$refs.menuTreeNode.getNode(data.id);
          const selectedLabelArray = [];
          const recursionParent = function(node) {
            if (!node.parent) {
              return;
            }
            selectedLabelArray.push(node.label);
            recursionParent(node.parent);
          };
          recursionParent(selectNode);
          param.parent = selectedLabelArray.join("/");
        }
        if (this.clickCount > 1) {
          _this.$emit("clickNodeReslut", { data: param, type: "dbclick" });
        } else {
          _this.$emit("clickNodeReslut", { data: param, type: "click" });
        }
        // console.log(param, this.clickCount);
        _this.clickCount = 0;
      }, 500);
      fnEmitDblClick();
      // } else {
      //   console.log("click", data);
      //   this.$emit("clickNodeReslut", data);
      // }
    },
    // 递归获取父节点
    getParentNode(node) {
      console.log("node", node);
      const selectedLabelArray = [];
      const recursionParent = node => {
        if (!node.key) {
          return;
        }
        selectedLabelArray.push(node.label);
        recursionParent(node.parent);
      };
    },
    /* 搜索关键字 */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /* menu 搜索结果 */
    executeFilter(val) {
      this.$refs.menuTreeNode.filter(val);
    },
    /* 收起或者展开所有节点 */
    showOrHiddenAllNodes() {
      const allNodes = this.$refs.menuTreeNode.store._getAllNodes();
      for (let i = 0, len = allNodes.length; i < len; i++) {
        allNodes[i].expanded = this.expandAll;
      }
    },
    /* 展开第一级 */
    expandFirst(data) {
      // console.log(data[0].id, 2222);
      this.$refs.menuTreeNode.store.nodesMap[data[0].id].expanded = true;
    },

    /* 全选反选 */
    checkAll(val) {
      // console.log(133, "val", val, this.menuData);
      if (val) {
        this.checkStrictly = false;
        this.$nextTick(() => {
          this.$refs.menuTreeNode.setCheckedNodes(this.menuData);
          const checkedVal = this.$refs.menuTreeNode
            .getCheckedKeys()
            .concat(this.$refs.menuTreeNode.getHalfCheckedKeys());
          this.$emit("passCheckedNode", checkedVal);
        });
      } else {
        this.checkStrictly = true;
        this.$refs.menuTreeNode.setCheckedKeys([]);
      }
    },
    /* 获取当前选中节点   节点选中状态发生变化时的回调*/
    // handleCheckChange(data, checked, indeterminate) {
    //   const checkedNode = this.$refs.menuTreeNode.getCheckedNodes();
    //   this.$emit("passCheckedNode", checkedNode);
    // },
    /* 当复选框被点击的时候触发*/
    clickDeal(currentObj, treeStatus) {
      this.checkStrictly = true;
      console.log(153, "tree, currentObj, treeStatus", currentObj, treeStatus);
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj);
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true);
      } else {
        if (currentObj.parentId !== -1) {
          this.removeParent(currentObj, this.$refs.menuTreeNode);
        }
        // 未选中 处理子节点全部未选中
        if (currentObj.children.length !== 0) {
          this.uniteChildSame(currentObj, false);
        }
      }
      // const checkedVal = this.$refs.menuTreeNode
      //   .getCheckedKeys()
      //   .concat(this.$refs.menuTreeNode.getHalfCheckedKeys());
      // this.$emit("passCheckedNode", checkedVal);
      const checkedNode = this.$refs.menuTreeNode
        .getCheckedNodes(false)
        .concat(this.$refs.menuTreeNode.getHalfCheckedNodes(false));
      // console.log("checkedNode", checkedNode);
      this.$emit("passCheckedNode", checkedNode);
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      // console.log(171, "treeList, isSelected", treeList, isSelected);
      this.$refs.menuTreeNode.setChecked(treeList.id, isSelected);
      for (let i = 0; i < treeList.children.length; i++) {
        this.uniteChildSame(treeList.children[i], isSelected);
      }
    },
    // 统一处理父节点为选中  或不选
    selectedParent(currentObj) {
      console.log(179, "currentOb", currentObj);
      const currentNode = this.$refs.menuTreeNode.getNode(currentObj);
      if (currentNode.parent.key !== undefined) {
        this.$refs.menuTreeNode.setChecked(currentNode.parent, true);
        this.selectedParent(currentNode.parent);
      } else {
        this.$refs.menuTreeNode.setChecked(currentNode.parent, false);
      }
    },
    /* 清空所有节点选中状态 */
    resetChecked() {
      this.$refs.menuTreeNode.setCheckedKeys([]);
    },
    /**    子节点全没选中取消父级的选中状态   **/
    removeParent(currentObj, ref) {
      let a = 0;
      let b = 0;
      const currentNode = ref.getNode(currentObj);
      if (currentNode.parent !== null) {
        if (currentNode.parent.key !== undefined) {
          ref.setChecked(currentNode.parent, true); // 根节点
          this.removeParent(currentNode.parent, ref); // 递归判断子节点
        }
      }
      // 不为0表示为父节点
      if (currentNode.childNodes.length !== 0) {
        // 循环判断父节点下的子节点
        for (let i = 0; i < currentNode.childNodes.length; i++) {
          // 判断父节点下的子节点是否全为false
          if (currentNode.childNodes[i].checked === false) {
            ++a;

            // a === currentNode.childNodes.length 表明子节点全为false
            if (a === currentNode.childNodes.length) {
              // 等于 undefined 跳过,不等于继续执行
              if (currentNode.childNodes[i].parent.key !== undefined) {
                ref.setChecked(currentNode.childNodes[i].parent, false); // 父元素设置为false
                // 循环上级父节点下的子节点
                for (let i = 0; i < currentNode.parent.childNodes.length; i++) {
                  // 判断父节点下的子节点是否全为false
                  if (currentNode.parent.childNodes[i].checked === false) {
                    ++b;

                    // b === currentNode.parent.childNodes.length 表明子节点全为false
                    if (b === currentNode.parent.childNodes.length) {
                      ref.setChecked(currentNode.parent.key, false); // 父元素设置为false
                      return this.removeParent(currentNode.parent, ref); // 继续递归循环判断
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    /* 设置默认选中节点 */
    setDefaultChecked(checkedMemu) {
      console.log(255, checkedMemu);
      this.$refs.menuTreeNode.setCheckedKeys(checkedMemu);
    }
  }
};
</script>
<style>
.tree-menu {
  width: auto !important;
}
.el-tree {
  background: transparent;
}
</style>
<style lang="scss" scoped>
.tree-menu {
  width: 200px;
}
</style>
