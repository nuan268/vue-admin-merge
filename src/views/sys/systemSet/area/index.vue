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
      @requstLazyLoad="requstLazyLoad"
    >
      <template slot="areaName" slot-scope="scope">
        <span> （{{ scope.row.areaCode }}）</span>
        <span class="td-color tl" @click="areaEditAdd(scope.row, '编辑')">
          {{ scope.row.areaName }}
        </span>
      </template>
      <template slot="areaType" slot-scope="scope">
        {{ swichText("sys_area_type", scope.row.areaType, "未设置") }}
      </template>

      <template slot="status" slot-scope="scope">
        <span v-if="scope.row.status === '0'">
          {{ swichText("sys_status", scope.row.status, "未设置") }}
        </span>
        <span v-else class="r-btn">
          {{ swichText("sys_status", scope.row.status, "未设置") }}
        </span>
      </template>
      <template slot="operate">
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="areaEditAdd(scope.row, '编辑')"
            >
              <i class="el-icon-edit" title="编辑区域"></i>
            </el-button>
            <!-- 正常使用中0，已被停用2 -->
            <el-button
              type="text"
              size="small"
              @click="setAreaStart(scope.row)"
            >
              <i
                :class="[
                  scope.row.status === '0'
                    ? 'el-icon-video-pause'
                    : 'el-icon-circle-check'
                ]"
                :style="{
                  color: [scope.row.status === '0' ? '#f00' : '#69aa46']
                }"
                :title="scope.row.status === '0' ? '停用区域' : '启用区域'"
              ></i>
            </el-button>
            <el-button type="text" size="small" @click="deleteArea(scope.row)">
              <i
                style="color:red;"
                class="el-icon-delete"
                title="删除行政区划"
              ></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="AddNew(scope.row, '新增下级')"
            >
              <i class="fa fa-plus-square" title="新增下级区域"></i>
            </el-button>
          </template>
        </el-table-column>
      </template>
    </TableTree>
    <AreaEdit ref="areaEditPanel" @initPage="initPage"></AreaEdit>
  </div>
</template>
<script>
import TableTree from "@/components/tableTree";
import InputFilter from "@/components/inputFliter";
import AreaEdit from "./areaEdit.vue";
import TopBtns from "@/components/componentBtns/topBtns/baseBtn";
import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
import { sysApi } from "../../../../api/systemSet";
export default {
  name: "Area",
  inject: ["reload"],
  components: {
    TableTree,
    InputFilter,
    AreaEdit,
    TopBtns
  },
  data() {
    return {
      showSearchVal: false,
      leftMg: {
        icon: "fa icon-map",
        text: "行政区划"
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
      formInline: [
        {
          type: "input",
          label: "区域代码",
          key: "areaCode",
          value: ""
        },
        {
          type: "input",
          label: "区域名称",
          key: "areaName",
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
        areaName: "left"
      },
      columnWidths: {
        treeSort: 100,
        status: 80
      },
      columnSortabel: {},
      slotColumns: ["areaName", "areaType", "status"],
      tableHead: {
        areaName: "区域名称",
        areaType: "区域类型",
        remarks: "备注信息",
        treeSort: "排序号",
        status: "状态", // 1 菜单 2权限
        updateDate: "更新时间" // 1 菜单 2权限
      },
      tableData: [],
      pageNation: {
        areaCode: "",
        areaName: "",
        status: "",
        pageNo: 1,
        pageSize: 20,
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
      sysApi.getAreaList(param).then(res => {
        const resList = res.list;
        for (let i = 0, len = resList.length; i < len; i++) {
          if (resList[i].isTreeLeaf === false) {
            resList[i].hasChildren = true;
          }
        }
        this.tableData = resList;
        this.pageNation.total = res.count;
      });
    },
    // tree 懒加载
    requstLazyLoad(param) {
      const obj = {
        nodeid: param.tree.id,
        parentCode: param.tree.id,
        parentid: param.tree.parentCode,
        _search: false,
        pageSize: "",
        pageNo: 1
      };
      sysApi.getAreaList(obj).then(res => {
        for (let i = 0, len = res.list.length; i < len; i++) {
          if (!res.list[i].isTreeLeaf) {
            res.list[i].hasChildren = true;
          }
        }
        param.resolve(res.list);
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
      this.pageNation.areaCode = "";
      this.pageNation.areaName = "";
      this.pageNation.status = "";
      this.init(this.pageNation);
    },
    currentChange(val) {
      this.pageNation.pageNo = val;
      this.init(this.pageNation);
    },
    /* 编辑/新增下级表格 */
    areaEditAdd(row, type) {
      this.$refs.areaEditPanel.show(row, type);
    },
    AddNew(row = {}, type = "新增") {
      this.$refs.areaEditPanel.show(row, type);
    },
    setAreaStart(row) {
      const typeText = row.isLoader ? "停用" : "启用";
      this.$alertMsgBox(`确认要${typeText}该区域吗?`, "信息")
        .then(() => {
          sysApi
            .setAreaStart({
              type: row.status === "0" ? "disable" : "enable",
              areaCode: row.id
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
    deleteArea(row) {
      this.$alertMsgBox("确认要删除该行政区划吗？", "信息")
        .then(() => {
          sysApi
            .deleteArea({
              id: row.id
            })
            .then(res => {
              if (res.result === "true") {
                this.init(this.pageNation);
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
