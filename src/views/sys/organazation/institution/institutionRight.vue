<template>
  <div class="user-right-box">
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
    >
    </InputFilter>
    <TableTree
      ref="theTable"
      :table-head="tableHead"
      :table-data="tableData"
      :column-widths="columnWidths"
      :slot-columns="slotColumns"
      :table-fit="tableFit"
      style="margin-top: 10px;"
      :show-page="false"
      @requstLazyLoad="requstLazyLoad"
    >
      <template slot="officeName" slot-scope="scope">
        <span class="td-color" @click="institutionEdit(scope.row, '编辑机构')">
          {{ scope.row.officeName }}
        </span>
      </template>
      <template slot="status" slot-scope="scope">
        <span>
          {{ scope.row.status === "0" ? "正常" : "停用" }}
        </span>
      </template>
      <template slot="operate">
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="institutionEdit(scope.row, '编辑机构')"
            >
              <i class="el-icon-edit" title="编辑"></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="stopOfficeOrStart(scope.row)"
            >
              <i
                :class="[
                  scope.row.status === '0'
                    ? 'el-icon-circle-check'
                    : ' el-icon-video-pause'
                ]"
                :title="scope.row.status === '0' ? '正常' : '停用'"
              ></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteHandleClick(scope.row)"
            >
              <i class="el-icon-delete" title="删除"></i>
            </el-button>
            <el-button
              type="text"
              @click="institutionEdit(scope.row, '新增下级机构')"
            >
              <i class="el-icon-plus" size="small" title="新增下级机构"></i>
            </el-button>
          </template>
        </el-table-column>
      </template>
    </TableTree>
    <!-- 筛选搜索对话框 -->
    <DailogFrame
      :dialog-visible="showDailog"
      :title-name="titleName"
      @closeDialog="closeDialog"
    ></DailogFrame>
    <!-- table行点击对话框 -->
    <InstitutionEditPanel
      ref="institutionEditPanel"
      :office-options="officeOptions"
      @initPage="init"
    ></InstitutionEditPanel>
  </div>
</template>
<script>
import TopBtns from "@/components/componentBtns/topBtns/baseBtn";
import TableTree from "@/components/tableTree";
import InputFilter from "@/components/inputFliter";
import DailogFrame from "@/components/dailogPanel/frame";
import InstitutionEditPanel from "./institutionEditPanel";
// import { returnReg } from "@/utils/validate"; /* 表单正则验证 */
import { clearFilterVal, getInputVal } from "@/utils/pubFunc";
import { orgApi } from "../../../../api/organization";
import { pubApi } from "@/api/public_request";
export default {
  name: "UserRight",
  components: {
    TopBtns,
    TableTree,
    InputFilter,
    DailogFrame,
    InstitutionEditPanel
  },
  data() {
    return {
      showSearchVal: false,
      leftMg: {
        icon: "fa icon-grid",
        text: "机构管理"
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
        }
      ],
      showDailog: false,
      titleName: "",
      officeOptions: [], // 机构类型
      formInline: [
        {
          type: "input",
          label: "机构代码",
          key: "viewCode",
          value: ""
        },
        {
          type: "input",
          label: "机构名称",
          key: "officeName",
          value: ""
        },
        {
          type: "input",
          label: "机构全称",
          key: "fullName",
          value: ""
        },
        {
          type: "select",
          label: "机构类型",
          key: "officeType",
          options: [],
          value: ""
        },
        {
          type: "select",
          label: "状态",
          options: [
            {
              label: "正常",
              value: "0"
            },
            {
              label: "停用",
              value: "2"
            }
          ],
          key: "status",
          value: ""
        }
      ],
      showMore: false,
      tableFit: true,
      columnWidths: {
        officeName: 130
      },
      slotColumns: ["officeName", "status"],
      tableHead: {
        officeName: "机构名称",
        fullName: "机构全称",
        treeSort: "排序号",
        // institutionType: "机构类型",
        updateDate: "更新时间",
        // remarkMessage: "备注信息",
        status: "状态"
      },
      tableData: []
    };
  },

  created() {
    this.getOfficeType("sys_office_type");
    this.init({
      status: "",
      ctrlPermi: 2,
      pageNo: 1,
      officeCode: "",
      viewCode: "",
      officeName: "",
      fullName: "",
      officeType: "",
      pageSize: "",
      orderBy: ""
    });
  },
  methods: {
    showSearch(val) {
      this.showSearchVal = val;
    },
    handlerName(funcName) {
      this[funcName]();
    },
    init(param) {
      orgApi.getOfficeList(param).then(res => {
        // console.log(231, res);
        if (res.length && res[0].isTreeLeaf === false) {
          res[0].hasChildren = true;
        }
        //  this.tableData = statusMap(response.list, obj);
        this.tableData = res;
      });
    },
    /* 获取机构类型 */
    getOfficeType(dictType) {
      pubApi
        .getMapFieldList({
          dictType
        })
        .then(res => {
          for (let i = 0, len = res.length; i < len; i++) {
            res[i].label = res[i].name;
          }
          this.formInline[3].options = res;
          this.officeOptions = res || [];
        });
    },

    /* 获取填入输入框的值  */
    searchBtn(data = {}) {
      // console.log(214, data);
      const obj = {};
      if (data.left) {
        obj.officeCode = data.officeCode;
      }
      const valObj = Object.assign(obj, getInputVal(this.formInline));
      this.init(valObj);
    },
    /* 清除输入框内的值 */
    resetForm() {
      clearFilterVal(this.formInline);
      this.init({
        status: "",
        ctrlPermi: 2
      });
    },
    initPage() {
      this.$refs.theTable.expandFoldTable(this.tableData, false);
    },
    Expand() {
      this.$refs.theTable.expandFoldTable(this.tableData, true);
    },
    Folding() {
      this.$refs.theTable.expandFoldTable(this.tableData, false);
    },
    AddNew(row, type) {
      this.$refs.institutionEditPanel.show({}, "新增机构");
    },
    forArr(arr, isExpand) {
      arr.forEach(i => {
        this.$refs.theTable.toggleRowExpansion(i, isExpand);
        if (i.children) {
          this.forArr(i.children, isExpand);
        }
      });
    },

    // 显示对话框选择
    showFilterPanel(item) {
      this.showDailog = true;
      this.titleName = `${item.label}选择`;
    },
    // 关闭对话框选择
    closeDialog() {
      this.showDailog = false;
    },
    /* 编辑表格 */
    institutionEdit(row, type) {
      this.$refs.institutionEditPanel.show(row, type);
    },
    stopOfficeOrStart(row) {
      const typeText = row.status === "0" ? "停用" : "启用";
      this.$alertMsgBox(`确认要${typeText}该用户吗?`, "信息")
        .then(() => {
          orgApi
            .stopOfficeOrStart({
              officeCode: row.officeCode,
              type: row.status === "0" ? "disable" : "enable"
            })
            .then(res => {
              if (res.result === "true") {
                this.$message.success(res.message);
              } else {
                this.$message.waring(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消ds");
        });
    },
    deleteHandleClick(row) {
      this.$alertMsgBox("确认要删除该机构及其子机构吗？", "信息")
        .then(() => {
          orgApi
            .deleteOffice({
              officeCode: row.officeCode
            })
            .then(res => {
              if (res.result === "true") {
                this.init({
                  status: "",
                  ctrlPermi: 2
                });
                this.$message.success(res.message);
              } else {
                this.$message.waring(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    // tree 懒加载
    requstLazyLoad(param) {
      const obj = {
        ctrlPermi: 2,
        nodeid: param.tree.parentCode,
        parentCode: param.tree.id,
        parentid: param.tree.id,
        _search: false
      };
      orgApi.getOfficeList(obj).then(res => {
        for (let i = 0, len = res.length; i < len; i++) {
          if (!res[i].isTreeLeaf) {
            res[i].hasChildren = true;
          }
        }
        param.resolve(res);
      });
    }
  }
};
</script>
<style lang="scss">
.el-popover {
  min-width: 100px;
}
</style>
<style lang="scss" scoped>
.user-right-box {
  margin: 0 10px;
  .td-color {
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
