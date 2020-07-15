<template>
  <div class="wrapper_content">
    <TopBtns
      :btn-arr="btnArr"
      :left-mg="leftMg"
      @showSearch="showSearch"
      @handlerName="handlerName"
    ></TopBtns>
    <InputFilter
      v-show="showSearchVal"
      :form-item="formInline"
      @resetForm="resetForm"
      @statusValChange="statusValChange"
      @searchBtn="searchBtn"
    >
    </InputFilter>

    <TableTree
      :table-head="tableHead"
      :table-data="tableData"
      :column-widths="columnWidths"
      :slot-columns="slotColumns"
      :table-fit="tableFit"
      style="margin-top: 10px;"
      :page-nation="pageNation"
      :column-sortabel="columnSortabel"
      @sortChange="sortChange"
      @currentChange="currentChange"
    >
      <template slot="postName" slot-scope="scope">
        <span class="td-color" @click="postEdit(scope.row, '编辑')">
          {{ scope.row.postName }}
        </span>
      </template>
      <template slot="postType" slot-scope="scope">
        {{ swichText("sys_post_type", scope.row.postType, "未设置") }}
      </template>
      <template slot="status" slot-scope="scope">
        <span
          :style="{
            color: [scope.row.status == '0' ? '#000' : '#f00']
          }"
        >
          {{ swichText("sys_search_status", scope.row.status, "未设置") }}
        </span>
      </template>
      <template slot="operate">
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="postEdit(scope.row, '编辑')"
            >
              <i class="el-icon-edit" title="编辑"></i>
            </el-button>
            <el-button type="text" size="small" @click="stopUsePost(scope.row)">
              <i
                :class="[
                  scope.row.status === '0'
                    ? 'el-icon-video-pause'
                    : 'el-icon-circle-check'
                ]"
                :style="{
                  color: [scope.row.status == '0' ? '#f00' : '#69aa46']
                }"
                :title="scope.row.status === '0' ? '停用岗位' : '启用岗位'"
              ></i>
            </el-button>
            <el-button type="text" size="small" @click="deleteBtn(scope.row)">
              <i class="el-icon-delete" style="color:#f00;" title="删除"></i>
            </el-button>
          </template>
        </el-table-column>
      </template>
    </TableTree>

    <AddAndEdit ref="postEditPanel" @initPage="initPage"></AddAndEdit>
  </div>
</template>
<script>
import TopBtns from "@/components/componentBtns/topBtns/baseBtn";
import TableTree from "@/components/tableTree";
import InputFilter from "@/components/inputFliter";
import AddAndEdit from "./addAndEdit";
import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
import { orgApi } from "@/api/organization";
export default {
  name: "PostManage",
  inject: ["reload"],
  components: {
    TopBtns,
    TableTree,
    InputFilter,
    AddAndEdit
  },
  data() {
    return {
      showSearchVal: false,
      leftMg: {
        icon: "fa icon-trophy",
        text: "岗位管理"
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
      stopOrStart: null,
      formInline: [
        {
          type: "input",
          label: "岗位编码",
          key: "postCode",
          value: ""
        },
        {
          type: "input",
          label: "岗位名称",
          key: "postName",
          value: ""
        },
        {
          type: "select",
          label: "岗位分类",
          key: "postType",
          value: "",
          options: this.getPostOption("sys_post_type")
        },
        {
          type: "select",
          label: "状态",
          options: this.getStatusOption("sys_search_status"),
          key: "status",
          value: ""
        }
      ],
      columnWidths: {
        updateDate: 130
        // email: 170
      },
      columnSortabel: {
        postName: true,
        postCode: true,
        postSort: true,
        postType: true,
        updateDate: true,
        remarks: true, // 无对应键名
        status: true // status
      },
      slotColumns: ["postName", "postType", "status"],
      tableHead: {
        postName: "岗位名称",
        postCode: "岗位编码",
        postSort: "排序号",
        postType: "岗位分类",
        updateDate: "更新时间",
        remarks: "备注信息", // 无对应键名
        status: "状态" // status
      },
      tableData: [],
      pageNation: {
        total: 0,
        pageSize: 20,
        pageNo: 1,
        orderBy: "",
        status: ""
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
      orgApi.getPostList(param).then(res => {
        this.pageNation.total = res.count;
        this.tableData = res.list;
      });
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
    stopUsePost(row) {
      if (row.status === "0") {
        this.stopOrStart = "disable";
        this.stopOrStartText = "停用";
      } else {
        this.stopOrStart = "enable";
        this.stopOrStartText = "起用";
      }
      this.$alertMsgBox(`确定要${this.stopOrStartText}该用户吗`, "信息")
        .then(() => {
          orgApi
            .stopUsePost({
              stopOrStart: this.stopOrStart,
              postCode: row.postCode
            })
            .then(res => {
              if (res.result === "true") {
                this.init(this.pageNation);
                this.$message.success(res.message);
              } else {
                this.$message.warning(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    deleteBtn(row) {
      this.$alertMsgBox(`此操作将永久删除该文件, 是否继续?`, "提示")
        .then(() => {
          orgApi
            .deletePost({
              postCode: row.postCode
            })
            .then(res => {
              if (res.result === "true") {
                this.init(this.pageNation);
                this.$message.success(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    /* 列表文本转义 */
    swichText(type, val, other) {
      return dictTypeMap(type, val, other);
      // console.log(99, dictTypeMap(type, val, other));
    },
    statusValChange(item) {
      this.searchBtn();
    },
    /* 获取填入输入框的值  */
    searchBtn(data = {}) {
      const obj = {
        total: this.pageNation.total,
        pageSize: this.pageNation.pageSize,
        pageNo: this.pageNation.pageNo,
        status: ""
      };
      const valObj = Object.assign(obj, getInputVal(this.formInline));
      this.init(valObj);
    },
    /* 清除输入框内的值 */
    resetForm() {
      this.pageNation.status = "";
      this.pageNation.orderBy = "";
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
    sortChange(sortVal) {
      this.pageNation.orderBy = sortVal;
      this.init(this.pageNation);
    },
    /* 编辑表格 */
    postEdit(row, type) {
      this.$refs.postEditPanel.show(row, type);
    },
    AddNew() {
      this.$refs.postEditPanel.show({}, "新增");
    }
  }
};
</script>
<style lang="scss" scoped></style>
