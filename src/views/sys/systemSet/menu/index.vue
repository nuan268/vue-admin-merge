<template>
  <div class="post  wrapper_content">
    <TopBtns
      :btn-arr="btnArr"
      :left-mg="leftMg"
      @showSearch="showSearch"
      @handlerName="handlerName"
    ></TopBtns>
    <InputFilter
      :form-item="formInline"
      @searchBtn="searchBtn"
      @resetForm="resetForm"
    >
    </InputFilter>

    <TableTree
      :table-head="tableHead"
      :table-data="tableData"
      :column-widths="columnWidths"
      :column-text-postion="columnTextPostion"
      :slot-columns="slotColumns"
      :table-fit="tableFit"
      style="margin-top: 10px;"
      :page-nation="pageNation"
      :show-page="false"
      @currentChange="currentChange"
      @requstLazyLoad="requstLazyLoad"
    >
      <template slot="menuName" slot-scope="scope">
        <i :class="scope.row.menuIcon"></i>
        <span class="td-color tl" @click="menuEditAdd(scope.row, '编辑')">
          {{ scope.row.menuName }}
        </span>
      </template>
      <template slot="moduleCodes" slot-scope="scope">
        <span class="td-color">
          {{ scope.row.moduleCodes }}
        </span>
      </template>
      <template slot="Func" slot-scope="scope">
        <el-input
          v-model="scope.row.treeSort"
          class="tree-sort"
          @blur="treeSortFunc(scope.row)"
        ></el-input>
      </template>
      <template slot="weight" slot-scope="scope">
        <span v-if="scope.row.weight == '80'" style="color:#c243d6">
          {{ swichText("sys_menu_weight", scope.row.weight, "未设置") }}
        </span>
        <span v-else>
          {{ swichText("sys_menu_weight", scope.row.weight, "未设置") }}
        </span>
      </template>
      <template slot="menuType" slot-scope="scope">
        <span v-if="scope.row.menuType == '2'" style="color:#c243d6">
          {{ swichText("sys_menu_type", scope.row.menuType, "未设置") }}
        </span>
        <span v-else>
          {{ swichText("sys_menu_type", scope.row.menuType, "未设置") }}
        </span>
      </template>
      <template slot="isShow" slot-scope="scope">
        <span v-if="scope.row.isShow === '0'" class="no-color">
          {{ swichText("sys_show_hide", scope.row.isShow, "未设置") }}
        </span>
        <span v-else>
          {{ swichText("sys_show_hide", scope.row.isShow, "未设置") }}
        </span>
      </template>
      <template slot="operate">
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="menuEditAdd(scope.row, '编辑')"
            >
              <i class="el-icon-edit" title="编辑菜单"></i>
            </el-button>
            <el-button type="text" size="small" @click="deleteMenu(scope.row)">
              <i style="color:red;" class="el-icon-delete" title="删除菜单"></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="menuEditAdd(scope.row, '新增下级')"
            >
              <i class="fa fa-plus-square" title="新增下级菜单"></i>
            </el-button>
          </template>
        </el-table-column>
      </template>
    </TableTree>
    <menuEdit ref="secAdminEditPanel" @initPage="initPage"></menuEdit>
  </div>
</template>
<script>
import TopBtns from "@/components/componentBtns/topBtns/baseBtn";
import TableTree from "@/components/tableTree";
import InputFilter from "@/components/inputFliter";
import menuEdit from "./menuEdit";
import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
// import { orgApi } from "@/api/organization";
import { sysApi } from "../../../../api/systemSet";
import { returnReg } from "@/utils/validate";
export default {
  name: "Menu",
  inject: ["reload"],
  components: {
    TableTree,
    InputFilter,
    menuEdit,
    TopBtns
  },
  data() {
    return {
      showSearchVal: false,
      leftMg: {
        icon: "fa icon-book-open",
        text: "菜单管理"
      },
      btnArr: [
        {
          handlerName: "View",
          btnText: "查询",
          class: "fa fa-search"
        },
        {
          handlerName: "Reload",
          btnText: "刷新",
          class: "fa fa-refresh"
        },
        {
          handlerName: "Expand",
          btnText: "展开",
          class: "fa fa-angle-double-down"
        },
        {
          handlerName: "Folding",
          btnText: "折叠",
          class: "fa fa-angle-double-down"
        },
        {
          handlerName: "AddNew",
          btnText: "新增",
          class: "fa fa-plus"
        },
        {
          handlerName: "Sort",
          btnText: "保存排序",
          class: "fa fa-sort-amount-asc"
        }
      ],

      sortVal: {},
      TableTreeData: {
        ids: [],
        sorts: []
      },
      formInline: [
        {
          type: "input",
          label: "菜单名称",
          key: "menuName",
          value: ""
        }
      ],
      columnTextPostion: {
        menuName: "left"
      },
      columnWidths: {},
      slotColumns: [
        "menuName",
        "moduleCodes",
        "Func",
        "isShow",
        "menuType",
        "weight"
      ],
      tableHead: {
        menuName: "菜单名称",
        moduleCodes: "归属模块",
        menuHref: "链接",
        Func: "排序",
        menuType: "类型", // 1 菜单 2权限
        isShow: "可见", // 0 隐藏 1可见
        permission: "权限标志",
        weight: "菜单权重"
      },
      tableData: [],
      pageNation: {
        pageSize: 20,
        pageNo: 1
      },
      tableFit: true
    };
  },
  mounted() {
    this.init(this.pageNation);
  },
  methods: {
    showSearch(val) {
      this.showSearchVal = val;
    },
    handlerName(funcName) {
      this[funcName]();
    },
    initPage() {
      this.reload();
    },
    init(param) {
      // console.log(2222, param);
      sysApi.getMenu(param).then(res => {
        for (let i = 0, len = res.length; i < len; i++) {
          if (res[i].isTreeLeaf === false) {
            res[i].hasChildren = true;
            this.TableTreeData.ids.push(res[i].id);
            this.TableTreeData.sorts.push(res[i].treeSort);
          }
        }
        this.tableData = res;
      });
    },
    // tree 懒加载
    requstLazyLoad(param) {
      console.log(204, param);
      const obj = {
        nodeid: param.tree.id,
        parentCode: param.tree.id,
        parentid: param.tree.parentCode,
        _search: false,
        pageSize: "",
        pageNo: 1
      };
      sysApi.getMenu(obj).then(res => {
        for (let i = 0, len = res.length; i < len; i++) {
          this.TableTreeData.ids.push(res[i].id);
          this.TableTreeData.sorts.push(res[i].treeSort);
          if (!res[i].isTreeLeaf) {
            res[i].hasChildren = true;
          }
        }
        param.resolve(res);
      });
    },
    Sort() {
      const obj = {
        ids: this.TableTreeData.ids, //, JSON.stringify(this.sortVal.id),
        sorts: this.TableTreeData.sorts //, JSON.stringify(this.sortVal.treeSort + "")
      };
      sysApi.updateTreeSort(obj).then(res => {
        if (res.result === "true") {
          this.$message.success(res.message);
          this.reload();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    /* 排序 */
    treeSortFunc(val) {
      this.sortVal = val;
      for (let i = 0, len = this.TableTreeData.ids.length; i < len; i++) {
        if (this.TableTreeData.ids[i] === val.id) {
          this.TableTreeData.sorts[i] = val.treeSort;
        }
      }
      // if(!returnReg("positiveInteger").test(val)) {
      // }
    },
    /* 列表文本转义 */
    swichText(type, val, other) {
      return dictTypeMap(type, val, other);
    },
    /* 获取岗位下拉框数据 */
    getPostOption(type) {
      const selectTypeData = JSON.parse(
        sessionStorage.getItem("selectDicType")
      );
      return selectTypeData[type];
    },
    /* 获取状态下拉框数据 */
    getStatusOption(type) {
      const selectTypeData = JSON.parse(
        sessionStorage.getItem("selectDicType")
      );
      return selectTypeData[type];
    },
    /* 获取填入输入框的值  */
    searchBtn(data = {}) {
      // menuNameOrig 和 formInline 中的键名不一样 单独写
      const obj = {
        pageSize: this.pageNation.pageSize,
        pageNo: 1,
        sysCode: "default",
        moduleCodes: "",
        menuNameOrig: this.formInline[0].value
      };
      console.log(297, this.formInline);
      // const valObj = Object.assign(obj, getInputVal(this.formInline));
      this.init(obj);
    },
    /* 清除输入框内的值 */
    resetForm() {
      this.pageNation.status = "";
      const valObj = Object.assign(
        this.pageNation,
        clearFilterVal(this.formInline)
      );
      this.init(valObj);
    },
    currentChange(val) {
      this.pageNation.pageNo = val;
      this.init(this.pageNation);
    },
    /* 编辑/新增下级表格 */
    menuEditAdd(row, type) {
      this.$refs.secAdminEditPanel.show(row, type);
    },
    AddNew() {
      this.$refs.secAdminEditPanel.show({}, "新增");
    },

    deleteMenu(row) {
      this.$alertMsgBox("确认要删除该菜单及所有子菜单吗？", "信息")
        .then(() => {
          sysApi
            .deleteMenu({
              menuCode: row.menuCode
            })
            .then(res => {
              if (res.result === "true") {
                this.init(this.params);
                this.$message.success(res.message);
              } else {
                this.$message.waring(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    }
  }
};
</script>
<style lang="scss">
.tree-sort {
  margin: 0 auto;
  .el-input__inner {
    text-align: center;
    height: 20px;
    width: 80px;
  }
}
</style>
<style lang="scss" scoped></style>
