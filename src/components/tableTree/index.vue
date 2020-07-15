<template>
  <div>
    <el-table
      ref="tableDom"
      v-adaptive="{ bottomOffset: 50 }"
      :data="tableData"
      border
      stripe
      height="200"
      header-align="center"
      lazy
      :load="load"
      :fit="tableFit"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :empty-text="'暂无数据'"
      :select-on-indeterminate="selectOnIndeterminate"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @row-dblclick="rowDblclick"
      @sort-change="sortChange"
    >
      >
      <slot name="chechbox"></slot>
      <slot name="index"></slot>
      <!-- <el-table-column
        fixed
        label="序号"
        type="index"
        align="center"
        width="50"
      ></el-table-column> -->

      <el-table-column
        v-for="(value, key) in tableHead"
        :key="key"
        header-align="center"
        :sortable="columnSortabel[key] ? 'custom' : false"
        :prop="key"
        :label="value"
        :width="columnWidths[key]"
        :align="columnTextPostion[key] ? columnTextPostion[key] : 'center'"
        :show-overflow-tooltip="showOverflow"
      >
        <template slot-scope="scope">
          <!-- {{key}} -->
          <slot v-if="slotColumns.indexOf(key) > -1" :name="key" v-bind="scope">
          </slot>
          <!-- 用于某一列需要特殊处理  判断slotColumns传进来的值key里边是否存在 给调用他的父级传scope -->
          <template v-else>
            {{ scope.row[key] }}
          </template>
        </template>
      </el-table-column>
      <slot name="operate"></slot>
      <!-- <el-table-column fixed="right" label="操作" width="140" align="center">
        <template slot-scope="scope">
          <TableButton :row-data="scope.row" @editHandleClick="editHandleClick"></TableButton>
        </template>
      </el-table-column> -->
    </el-table>
    <Pagination
      v-show="showPage"
      :total="pageNation.total"
      :page-size="pageNation.pageSize"
      v-on="$listeners"
    ></Pagination>
  </div>
</template>
<script>
// import TableButton from "@/components/tableButton";
import Pagination from "../Pagination/index";
export default {
  components: {
    // TableButton,
    Pagination
  },
  props: {
    tableFit: {
      type: Boolean,
      default: true
    },
    tableHead: {
      type: Object,
      default: () => {}
    },
    tableData: {
      type: Array,
      default: () => []
    },
    columnWidths: {
      type: Object,
      default: () => ({})
    },
    columnTextPostion: {
      type: Object,
      default: () => ({})
    },
    columnSortabel: {
      type: Object,
      default: () => ({})
    },
    slotColumns: {
      type: Array,
      default: () => []
    },
    showOverflow: {
      type: Boolean,
      default: true
    },
    selectOnIndeterminate: {
      type: Boolean,
      default: false
    },
    showPage: {
      type: Boolean,
      default: true
    },
    pageNation: {
      type: Object,
      default: () => {
        return {
          total: 0,
          pageSize: 20,
          pageNo: 1
        };
      }
    }
  },
  data() {
    return {
      tablHeight: 500,
      tableDataMap: []
    };
  },
  watch: {
    tableData: {
      handler(newVal, val) {
        this.tableDataMap = newVal;
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    load(tree, treeNode, resolve) {
      console.log(tree, treeNode);
      this.$emit("requstLazyLoad", { tree, resolve });
    },
    /* row单击  */
    rowClick(row, column, event) {
      this.$emit("rowClick", row);
    },
    /* 表格排序 */
    sortChange(column) {
      console.log(157, column);
      if (column.order) {
        const param =
          "a." +
          this.toLine(column.prop) +
          " " +
          column.order.split("ending")[0];
        this.$emit("sortChange", param);
      }
    },
    // 驼峰转换下划线
    toLine(name) {
      return name.replace(/([A-Z])/g, "_$1").toLowerCase();
    },
    /* row双击  */
    rowDblclick(row, column, event) {
      this.$emit("rowDblclick", row);
    },
    handleSelectionChange(val) {
      console.log("tableCheckBox", val);
      this.$emit("tableCheckBox", val);
    },
    /* 回显或清除掉所有选中状态 */
    toggleSelection(rows) {
      // console.log(345, rows);
      /* 已经选择的数据 数据原来的数据数组 */
      if (rows.length) {
        const idArr = [];
        for (let i = 0, len = rows.length; i < len; i++) {
          idArr.push(rows[i].id);
        }
        this.$nextTick(() => {
          this.tableDataMap.forEach(row => {
            if (idArr.indexOf(row.id) !== -1) {
              this.$refs.tableDom.toggleRowSelection(row, true);
            }
          });
        });
      } else {
        this.$refs.tableDom.clearSelection(); // 清空选项，项目中：请求接口后，重新请求数据渲染页面的时候，使用此方式，清空选中勾选状态。
        // console.log("清空checkedbox", rows);
      }
    },
    expandFoldTable(arr, isExpand, flag = false) {
      arr.forEach(i => {
        this.$refs.tableDom.toggleRowExpansion(i, isExpand);
        if (flag) {
          this.$emit("loadSubTable", i);
        }
        if (i.children) {
          this.expandFoldTable(i.children, isExpand);
        }
      });
    },
    cancleChecked(tag) {
      this.$refs.tableDom.toggleRowSelection(tag[0], false);
    }
  }
};
</script>
<style>
.el-table--medium th {
  padding: 8px 0;
}
/* .el-table td,
.el-table th {
  padding: 8px 0;
} */
.el-table--medium td {
  padding: 2px 0;
}
</style>
