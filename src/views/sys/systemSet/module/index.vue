<template>
  <div class="post  wrapper_content">
    <TopBtns
      :btn-arr="btnArr"
      :left-mg="leftMg"
      @showSearch="showSearch"
      @handlerName="handlerName"
    ></TopBtns>
    <InputFilter
      v-show="showSearchVal"
      :form-item="formInline"
      @searchBtn="searchBtn"
      @resetForm="resetForm"
      @statusValChange="statusValChange"
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
      :column-sortabel="columnSortabel"
      :page-nation="pageNation"
      @currentChange="currentChange"
      @sortChange="sortChange"
    >
      <template slot="index">
        <el-table-column
          fixed
          label="序号"
          type="index"
          align="center"
          width="50"
        ></el-table-column>
      </template>

      <template slot="moduleName" slot-scope="scope">
        <span class="td-color tl" @click="menuEditAdd(scope.row, '编辑')">
          {{ scope.row.moduleName }}
        </span>
      </template>
      <template slot="status" slot-scope="scope">
        <span v-if="scope.row.isLoader">
          正常
          <!--isLoader {{ swichText("sys_status", scope.row.status, "未安装") }} -->
        </span>
        <span v-else style="color:#f00;">
          未安装
          <!-- {{ swichText("sys_status", scope.row.status, "未安装") }} -->
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
            <el-button type="text" size="small" @click="stopOrStart(scope.row)">
              <i
                :class="[
                  scope.row.status === '0'
                    ? 'el-icon-video-pause'
                    : 'el-icon-circle-check'
                ]"
                :style="{
                  color: [scope.row.status === '0' ? '#f00' : '#69aa46']
                }"
                :title="scope.row.status === '0' ? '停用模块' : '启用模块'"
              ></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteModule(scope.row)"
            >
              <i style="color:red;" class="el-icon-delete" title="删除菜单"></i>
            </el-button>
          </template>
        </el-table-column>
      </template>
    </TableTree>
    <ModuleEdit ref="moduleEditPanel" @initPage="initPage"></ModuleEdit>
  </div>
</template>
<script>
import TableTree from "@/components/tableTree";
import InputFilter from "@/components/inputFliter";
import ModuleEdit from "./moduleEdit";
import TopBtns from "@/components/componentBtns/topBtns/baseBtn";
import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
import { sysApi } from "../../../../api/systemSet";
export default {
  name: "Menu",
  inject: ["reload"],
  components: {
    TableTree,
    InputFilter,
    ModuleEdit,
    TopBtns
  },
  data() {
    return {
      showSearchVal: false,
      leftMg: {
        icon: "fa icon-grid f14",
        text: "模块管理"
      },
      btnArr: [
        {
          handlerName: "View",
          btnText: "查询",
          class: "fa fa-search"
        },

        {
          handlerName: "AddNew",
          btnText: "新增",
          class: "fa fa-plus"
        }
      ],
      formInline: [
        {
          type: "input",
          label: "模块名称",
          key: "moduleName",
          value: ""
        },
        {
          type: "input",
          label: "主类全名",
          key: "mainClassName",
          value: ""
        },
        {
          type: "select",
          label: "状态",
          options: this.getStatusOption("sys_search_status"),
          key: "status",
          value: ""
        }
      ],
      columnTextPostion: {
        description: "left"
      },
      columnWidths: {
        description: 400
      },
      columnSortabel: {
        moduleName: true,
        moduleCode: true,
        description: true,
        currentVersion: true,
        status: true
      },
      slotColumns: ["moduleName", "status"],
      tableHead: {
        moduleName: "模块名称",
        moduleCode: "模块编码",
        description: "模块描述",
        currentVersion: "版本",
        status: "状态" // 1 菜单 2权限
      },
      tableData: [],
      pageNation: {
        moduleName: "",
        mainClassName: "",
        status: "",
        pageSize: 20,
        pageNo: 1,
        total: 0,
        orderBy: ""
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
      sysApi.getModule(param).then(res => {
        this.tableData = res.list;
        this.pageNation.total = res.count;
      });
    },

    /* 列表文本转义 */
    swichText(type, val, other) {
      return dictTypeMap(type, val, other);
    },
    /* 获取状态下拉框数据 */
    getStatusOption(type) {
      const selectTypeData = JSON.parse(
        sessionStorage.getItem("selectDicType")
      );
      return selectTypeData[type];
    },
    statusValChange(item) {
      this.searchBtn(item);
    },
    /* 获取填入输入框的值  */
    searchBtn(data = {}) {
      const valObj = Object.assign(
        this.pageNation,
        getInputVal(this.formInline)
      );
      this.init(valObj);
    },
    /* 清除输入框内的值 */
    resetForm() {
      clearFilterVal(this.formInline);
      this.pageNation.pageNo = 1;
      this.pageNation.moduleName = "";
      this.pageNation.mainClassName = "";
      this.pageNation.status = "";
      this.pageNation.orderBy = "";
      this.init(this.pageNation);
    },
    currentChange(val) {
      this.pageNation.pageNo = val;
      this.init(this.pageNation);
    },
    sortChange(sortVal) {
      this.pageNation.orderBy = sortVal;
      this.init(this.pageNation);
    },
    /* 编辑/新增下级表格 */
    menuEditAdd(row, type) {
      this.$refs.moduleEditPanel.show(row, type);
    },
    AddNew() {
      this.$refs.moduleEditPanel.show({}, "新增");
    },
    stopOrStart(row) {
      const typeText = row.isLoader ? "停用" : "启用";
      this.$alertMsgBox(`确认要${typeText}该模块吗?`, "信息")
        .then(() => {
          sysApi
            .setModuleStart({
              type: row.status === "0" ? "disable" : "enable",
              moduleCode: row.moduleCode
            })
            .then(res => {
              if (res.result === "true") {
                this.$message.success(res.message);
                this.init(this.pageNation);
              } else {
                this.$message.waring(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    deleteModule(row) {
      this.$alertMsgBox("确认要删除该模块吗？", "信息")
        .then(() => {
          sysApi
            .deleteModule({
              moduleCode: row.moduleCode
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
<style lang="scss" scoped>
.post {
  .current-type {
    height: 45px;
    line-height: 45px;
    // width: calc(100% -200px);
    // margin-right: 200px;
    border-bottom: 1px solid #eee;
  }
  .top-search {
    width: 100%;
    padding: 10px 10px 0;
  }
  .search {
    padding: 0 10px;
    // outline: 1px solid red;
  }
}
</style>
