<template>
  <div class="user-right-box">
    <TopBtns
      :btn-arr="btnArr"
      :left-mg="leftMg"
      @showSearch="showSearch"
      @handlerName="handlerName"
    >
      <template slot="more">
        <el-dropdown size="mini" @click="showImportAndExport">
          <el-button type="primary" size="mini" title="更多">
            <i class="fa fa-navicon"></i>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" size="mini">
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item>导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </TopBtns>
    <div>
      <InputFilter
        v-show="showSearchVal"
        :form-item="formInline"
        @statusValChange="statusValChange"
        @searchBtn="searchBtn"
      >
        <template slot="btnGroups">
          <el-button size="mini" @click="getMore"> 更多 </el-button>
        </template>
      </InputFilter>
      <InputFilter
        v-show="showMore"
        :form-item="moreFormItem"
        :show-search-btn="false"
        @filterPanel="showFilterPanel"
        @statusValChange="statusValChange"
      />
    </div>
    <TableTree
      :table-head="tableHead"
      :table-data="tableData"
      :column-widths="columnWidths"
      :slot-columns="slotColumns"
      :table-fit="tableFit"
      style="margin-top: 10px;"
      :page-nation="pageNation"
      :column-sortabel="columnSortabel"
      @currentChange="currentChange"
      @sortChange="sortChange"
    >
      <template slot="loginCode" slot-scope="scope">
        <span class="td-color" @click="editHandleClick(scope.row, '编辑')">{{
          scope.row.loginCode
        }}</span>
      </template>
      <template slot="refName" slot-scope="scope">
        <span>{{ scope.row.refName }}</span>
      </template>
      <template slot="employee.empName" slot-scope="scope">
        {{ scope.row.employee.empName }}
      </template>
      <template slot="employee.company.companyName" slot-scope="scope">
        {{ scope.row.employee.company.companyName }}
      </template>
      <template slot="employee.office.officeName" slot-scope="scope">
        <span v-for="(value, key) in scope.row.employee.office" :key="key">
          <span v-if="key == 'officeName'"> {{ value }} </span>
        </span>
      </template>
      <template slot="status" slot-scope="scope">
        <span :style="[{ color: scope.row.status === '0' ? '#000' : '#f00' }]">
          {{ swichText("sys_user_status", scope.row.status, "未设置") }}
        </span>
      </template>
      <template slot="operate">
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="editHandleClick(scope.row, '编辑')"
            >
              <i class="el-icon-edit" title="编辑用户"></i>
            </el-button>
            <el-button type="text" size="small" @click="stopUse(scope.row)">
              <i
                :class="[
                  scope.row.status === '0'
                    ? 'el-icon-video-pause'
                    : 'el-icon-circle-check'
                ]"
                :title="scope.row.status === '0' ? '停用用户' : '启用用户'"
              ></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: red;"
              @click="deleteHandleClick(scope.row)"
            >
              <i class="el-icon-delete" title="删除用户"></i>
            </el-button>

            <el-popover
              placement="right"
              trigger="hover"
              @click="moreHandleClick(scope.row)"
            >
              <div>
                <el-button
                  type="text"
                  size="small"
                  @click="assignRole(scope.row)"
                >
                  分配角色
                  <i class="el-icon-user-solid"></i>
                </el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  size="small"
                  @click="dataRights(scope.row)"
                >
                  数据权限
                  <i style="color: #66b1ff;" class="el-icon-circle-check"></i>
                </el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  size="small"
                  @click="resetPassword(scope.row)"
                >
                  重置密码
                  <i class="el-icon-coin"></i>
                </el-button>
              </div>
              <el-button slot="reference" type="text" size="small">
                <i
                  :class="[
                    changeArrowDirection && currentId == scope.row.id
                      ? 'el-icon-d-arrow-left'
                      : 'el-icon-d-arrow-right'
                  ]"
                ></i>
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </template>
    </TableTree>
    <!-- table行点击对话框 -->
    <userEditPanel
      ref="userEditPanel"
      @initListPage="initListPage"
    ></userEditPanel>
    <AssignRole ref="assignRolePanel"></AssignRole>
    <DataRights ref="dataRightsPanel"></DataRights>
    <InAndCompany
      ref="inAndCompanyPanel"
      @getClickNode="getClickNode"
    ></InAndCompany>
  </div>
</template>
<script>
import TableTree from "@/components/tableTree";
import InputFilter from "@/components/inputFliter";
import TopBtns from "@/components/componentBtns/topBtns/baseBtn";
import UserEditPanel from "./userEditPanel";
import AssignRole from "./assignRole";
import DataRights from "./dataRights";
import InAndCompany from "./insAndcompanyPanel";

// import { returnReg } from "@/utils/validate"; /* 表单正则验证 */
import {
  clearFilterVal,
  getInputVal,
  toTreeData,
  dictTypeMap
} from "@/utils/pubFunc";
import { orgApi } from "@/api/organization";

export default {
  name: "UserRight",
  components: {
    TableTree,
    InputFilter,
    TopBtns,
    UserEditPanel,
    AssignRole,
    DataRights,
    InAndCompany
  },
  props: {
    instMenuData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      showSearchVal: false,
      leftMg: {
        icon: "fa icon-user",
        text: "用户管理"
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
        // {
        //   handlerName: "More",
        //   btnText: "更多",
        //   class: "fa fa-navicon"
        // }
      ],
      btnText: "查询",
      sys_user_status: [], // 用户状态键值存储
      changeArrowDirection: false,
      currentId: null,
      stopOrStart: null,
      titleName: "",
      stopOrStartText: "", // 停用或者启用
      formInline: [
        {
          type: "input",
          label: "账号",
          key: "loginCode",
          value: "",
          width: 90
        },
        {
          type: "input",
          label: "昵称",
          key: "userName",
          value: "",
          width: 90
        },
        {
          type: "input",
          label: "姓名",
          key: "refName",
          width: 90,
          value: ""
        },
        {
          type: "input",
          label: "手机",
          key: "mobile",
          width: 90,
          value: ""
        },
        {
          type: "select",
          label: "状态",
          options: this.getStatusOption("sys_user_status"),
          key: "status",
          width: 90,
          value: ""
        }
      ],

      showMore: false,
      moreFormItem: [
        {
          type: "searchInput",
          label: "机构",
          key: "institution",
          width: 90,
          value: ""
        },
        {
          type: "searchInput",
          label: "公司",
          key: "company",
          width: 90,
          value: ""
        },
        {
          type: "input",
          label: "邮箱",
          key: "email",
          width: 90,
          value: ""
        },
        {
          type: "select",
          label: "岗位",
          key: "employee.postCode",
          options: [],
          width: 90,
          value: ""
        },
        {
          type: "input",
          label: "电话",
          key: "phone",
          width: 90,
          value: ""
        }
      ],
      tableFit: true,
      columnWidths: {
        updateDate: 130
        // email: 170
      },
      columnSortabel: {
        loginCode: true,
        userName: true
        // refName: true
      },
      slotColumns: [
        "loginCode",
        "refName",
        "employee.empName",
        "employee.company.companyName",
        "employee.office.officeName",
        "status"
      ],
      tableHead: {
        loginCode: "登录账号",
        userName: "用户昵称",
        "employee.empName": "员工姓名",
        "employee.company.companyName": "归属机构",
        "employee.office.officeName": "归属公司",
        email: "电子邮箱",
        mobile: "手机号",
        phone: "办公电话",
        updateDate: "更新时间",
        status: "状态" // status
      },
      tableData: [],
      statusOption: {},
      pageNation: {
        total: 0,
        pageSize: 20,
        pageNo: 1,
        ctrlPermi: 2,
        orderBy: ""
      },
      searchVal: {
        loginCode: null,
        refName: null,
        mobile: null,
        status: null,
        "employee.office.officeName": null, // 企管部
        "employee.office.officeCode": null, // SDJN01
        "employee.company.companyName": null, // 济南公司
        "employee.company.companyCode": null, // SDJN
        email: null, // 邮箱
        "employee.postCode": null, // ceo
        phone: null, // 08277648513
        orderBy: null //
      }
    };
  },
  created() {},
  mounted() {
    const obj = {
      pageSize: this.pageNation.pageSize,
      pageNo: this.pageNation.pageNo,
      status: "",
      orderBy: ""
    };
    this.init(obj);
    // 获取用户角色
    this.$store.dispatch("role/getRole");
    // console.log(397, '刚刚启动时进入页面')
  },
  methods: {
    showSearch(val) {
      this.showSearchVal = val;
    },
    handlerName(funcName) {
      this[funcName]();
    },
    async init(param) {
      await this.$store.dispatch("user/getUserMapFeild", "sys_user_status");
      await this.getPost();
      orgApi
        .getUserList(param)
        .then(response => {
          this.pageNation.total = response.count;
          this.tableData = response.list;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    initListPage() {
      this.init({
        pageSize: this.pageNation.pageSize,
        pageNo: this.pageNation.pageNo,
        status: "",
        orderBy: ""
      });
    },
    getPost() {
      orgApi.getEmployeePosts().then(res => {
        const postOptionArr = [];
        for (let i = 0, len = res.length; i < len; i++) {
          postOptionArr.push({
            label: res[i].name,
            value: res[i].id
          });
        }
        this.moreFormItem[3].options = postOptionArr;
        // console.log(400, postOptionArr);
        return postOptionArr;
      });
    },
    /* 获取状态下拉框数据 */
    getStatusOption(type) {
      const selectTypeData = JSON.parse(
        sessionStorage.getItem("selectDicType")
      );
      return selectTypeData[type];
    },
    /* 列表文本转义 */
    swichText(type, val, other) {
      return dictTypeMap(type, val, other);
      // console.log(99, dictTypeMap(type, val, other));
    },
    // select
    statusValChange(val) {
      this.searchBtn();
    },
    /* 获取填入输入框的值  */
    searchBtn(data = {}) {
      this.searchVal["employee.office.officeName"] = data.label;
      this.searchVal["employee.office.officeCode"] = data.id;
      this.searchVal = Object.assign(
        this.searchVal,
        this.pageNation,
        getInputVal(this.formInline),
        getInputVal(this.moreFormItem)
      );
      this.init(this.searchVal);
      console.log(666);
    },
    /* 清除输入框内的值 */
    resetForm() {
      clearFilterVal(this.formInline);
      clearFilterVal(this.moreFormItem);
      this.searchVal = {};
      const obj = {
        pageSize: this.pageNation.pageSize,
        pageNo: 1,
        status: null,
        orderBy: ""
      };
      this.init(obj);
      console.log(this.searchVal);
    },
    /* 切换显示更多条件筛选 */
    getMore() {
      this.showMore = !this.showMore;
    },
    // 显示带搜索图标的对话框
    showFilterPanel(item) {
      this.titleName = `${item.label}选择`;
      if (item.key === "institution") {
        this.$refs.inAndCompanyPanel.show(item, this.instMenuData);
      } else {
        orgApi.getCompanyMenuTree({ ctrlPermi: 2 }).then(res => {
          const attributes = {
            id: "id",
            parentId: "pId",
            label: "name",
            rootId: "YD"
          };
          const treeData = toTreeData(res, attributes);
          this.$refs.inAndCompanyPanel.show(item, treeData);
        });
      }
    },
    getClickNode(val, typeVal) {
      console.log("typeVal.key", val);
      if (typeVal.key === "institution") {
        this.moreFormItem[0].value = val.label;
        this.searchVal["employee.office.officeCode"] = val.id;
        this.searchVal["employee.office.officeName"] = val.label;
      } else {
        this.moreFormItem[1].value = val.label;
        this.searchVal["employee.company.companyCode"] = val.id;
        this.searchVal["employee.company.companyName"] = val.label;
      }
    },
    AddNew() {
      this.$refs.userEditPanel.show({}, "新增");
    },
    /* 编辑表格 */
    editHandleClick(row, type) {
      // console.log(11, row);
      this.$refs.userEditPanel.show(row, type);
    },
    showImportAndExport() {
      alert("button click");
    },
    /* 禁用启用 */
    stopUse(row) {
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
            .stopUseOrStart({
              stopOrStart: this.stopOrStart,
              userCode: row.userCode
            })
            .then(res => {
              if (res.result === "true") {
                const obj = {
                  pageSize: this.searchVal.pageSize,
                  pageNo: this.searchVal.pageNo,
                  status: ""
                };
                this.init(obj);
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
    deleteHandleClick(row) {
      this.$alertMsgBox("确认要删除该用户吗", "信息")
        .then(() => {
          orgApi.deleteUser(row.userCode).then(res => {
            if (res.result === "false") {
              this.$message.warning(res.message);
            } else {
              this.$message.success(res.message);
            }
          });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    assignRole(row) {
      this.$refs.assignRolePanel.init(row);
    },
    /* 数据权限 */
    dataRights(row) {
      orgApi
        .getDataRightDetail({
          userCode: row.userCode
        })
        .then(res => {
          this.$refs.dataRightsPanel.init(res);
        });
    },
    resetPassword(row) {
      this.$alertMsgBox(
        `确认要将 ${row.userCode} 用户密码重置到初始状态吗`,
        "信息"
      )
        .then(() => {
          orgApi.resetPw({ userCode: row.userCode }).then(res => {
            if (res.result === "true") {
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
    moreHandleClick(row) {
      this.currentId = row.id;
      this.changeArrowDirection = !this.changeArrowDirection;
    },
    currentChange(val) {
      this.pageNation.pageNo = val;
      this.init(this.pageNation);
    },
    sortChange(sortVal) {
      this.pageNation.orderBy = sortVal;
      this.init(this.pageNation);
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
  .current-type {
    height: 45px;
    line-height: 45px;
    // width: calc(100% -200px);
    // margin-right: 200px;
    border-bottom: 1px solid #eee;
  }
  .td-color {
    color: #1890ff;
    cursor: pointer;
  }
  .table-witth {
  }
}
</style>
