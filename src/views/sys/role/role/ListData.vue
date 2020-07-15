<template>
  <div class="role-table">
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
      ref="theTable"
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
      <template slot="roleName" slot-scope="scope">
        <span class="td-color" @click="roleEdit(scope.row, '编辑角色')">
          {{ scope.row.roleName }}
        </span>
      </template>

      <template slot="userType" slot-scope="scope">
        {{ swichText("sys_user_type", scope.row.userType, "未设置") }}
      </template>
      <template slot="isSys" slot-scope="scope">
        {{ swichText("sys_yes_no", scope.row.isSys, "") }}
      </template>
      <template slot="dataScope" slot-scope="scope">
        <!-- {{ scope.row.dataScope }} -->
        {{ swichText("sys_role_data_scope", scope.row.dataScope, "") }}
      </template>
      <template slot="bizScope" slot-scope="scope">
        <!-- {{ scope.row.bizScope }} -->
        {{ swichText("sys_role_biz_scope", scope.row.bizScope, "") }}
      </template>
      <template slot="status" slot-scope="scope">
        <span :style="[{ color: scope.row.status === '0' ? '#000' : '#f00' }]">
          {{ swichText("sys_search_status", scope.row.status, "未设置") }}
        </span>
      </template>
      <template slot="operate">
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="roleEdit(scope.row, '编辑角色')"
            >
              <i class="el-icon-edit" title="编辑"></i>
            </el-button>
            <el-button type="text" size="small" @click="stopUse(scope.row)">
              <i
                :class="[
                  scope.row.status === '0'
                    ? 'el-icon-video-pause'
                    : 'el-icon-circle-check'
                ]"
                :style="{
                  color: [scope.row.status === '0' ? '#f00' : '#69aa46']
                }"
                :title="scope.row.status === '0' ? '停用角色' : '启用角色'"
              ></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteHandleClick(scope.row)"
            >
              <i class="el-icon-delete" title="删除"></i>
            </el-button>
            <el-popover
              placement="right"
              trigger="hover"
              @show="moreHandleClick(scope.row)"
            >
              <div>
                <el-button
                  type="text"
                  size="small"
                  @click="accreditMenu(scope.row)"
                >
                  授权菜单
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
                  <i class="el-icon-circle-check"></i>
                </el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  size="small"
                  @click="allotUser(scope.row)"
                >
                  分配用户
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
    <RoleEditPanel
      ref="RoleEditPanel"
      :user-status-options="formInline[2].options"
      :role-type="roleType"
      @initPage="initPage"
    ></RoleEditPanel>
    <AccreditMenu
      ref="accreditMenuPanel"
      :title-name="'角色分配功能权限'"
      :column-bar-name="'授权功能菜单'"
      :t-name1="'主导航菜单'"
      :menu-tree1="menuTree1"
      :checked-memu1="checkedMemu"
      @checkTree="checkTreeVal"
    >
    </AccreditMenu>
    <DataRights ref="dataRightsPanel"></DataRights>
    <AllotUser ref="allotUserPanel"></AllotUser>
  </div>
</template>
<script>
import TopBtns from "@/components/componentBtns/topBtns/baseBtn";
import TableTree from "@/components/tableTree";
import InputFilter from "@/components/inputFliter";
import RoleEditPanel from "./roleEditPanel";
import AccreditMenu from "./accreditMune";
import DataRights from "./dataRights";
import AllotUser from "./allotUser";
// import { returnReg } from "@/utils/validate"; /* 表单正则验证 */
import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
import { roleApi } from "@/api/role";
import { pubApi } from "@/api/public_request";
import { statusMap } from "@/utils/pubFunc";
import { toTreeData } from "@/utils/pubFunc";
export default {
  name: "RoleTable",
  components: {
    TopBtns,
    TableTree,
    InputFilter,
    RoleEditPanel,
    AccreditMenu,
    DataRights,
    AllotUser
  },
  data() {
    return {
      showSearchVal: false,
      leftMg: {
        icon: "fa icon-people",
        text: "角色管理"
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
      changeArrowDirection: false,
      currentId: null,
      total: "",
      pageNation: {
        total: 0,
        pageNo: 1,
        pageSize: 20,
        ctrlPermi: 2,
        status: "",
        orderBy: ""
      },
      formInline: [
        {
          type: "input",
          label: "角色名称",
          key: "roleName_like",
          value: "",
          width: 120
        },
        {
          type: "input",
          label: "角色编码",
          key: "roleCode_like",
          value: "",
          width: 120
        },
        {
          type: "select",
          label: "用户类型",
          options: this.getMenuType("sys_user_type"),
          key: "userType",
          width: 120,
          value: ""
        },
        {
          type: "select",
          label: "系统角色",
          options: this.getMenuType("sys_yes_no"),
          key: "isSys",
          value: "",
          width: 120
        },
        {
          type: "select",
          label: "状态",
          options: this.getMenuType("sys_search_status"),
          key: "status",
          width: 120,
          value: ""
        }
      ],
      showMore: false,
      tableFit: true,
      columnWidths: {
        institutionName: 130,
        number: 130,
        format: 130
      },
      columnSortabel: {
        roleName: true,
        roleCode: true,
        roleSort: true,
        isSys: true,
        userType: true,
        dataScope: true,
        bizScope: true,
        updateDate: true,
        remarks: true,
        status: true
      },
      slotColumns: [
        "roleName",
        "userType",
        "isSys",
        "dataScope",
        "bizScope",
        "status"
      ],
      tableHead: {
        roleName: "角色名称",
        roleCode: "角色编码",
        roleSort: "排序号",
        isSys: "系统角色", // 暂无字段
        userType: "用户类型", // 暂无字段
        dataScope: "数据范围", // 暂无字段
        bizScope: "业务范围", // 没有显示未设置
        updateDate: "更新时间",
        remarks: "备注信息",
        status: "状态"
      },
      tableData: [],
      statusMapKey: [],
      roleType: [],
      menuTree1: [], // 授权菜单
      checkedMemu: [] // 回显用
    };
  },
  mounted() {
    this.$nextTick(() => {
    /* 获取用户类型 */
      this.dictTypeFunc({
        dictType: "sys_user_type",
        status: ""
      });

      // /* 获取 角色分类*/
      this.dictTypeFunc({
        dictType: "sys_role_type",
        status: ""
      });
      this.init({
        status: "",
        pageSize: this.pageNation.pageSize,
        pageNo: this.pageNation.pageNo,
        ctrlPermi: this.pageNation.ctrlPermi
      });
    });
  },
  methods: {
    showSearch(val) {
      this.showSearchVal = val;
    },
    handlerName(funcName) {
      this[funcName]();
    },
    async init(obj) {
      /* 获取角色状态 */
      await this.dictTypeFunc({
        dictType: "sys_search_status",
        status: ""
      });
      roleApi.getRoleManageList(obj).then(res => {
        const temp = JSON.parse(JSON.stringify(res.list));
        const obj = {};
        for (let i = 0, len = temp.length; i < len; i++) {
          obj[temp[i].value] = temp[i].label;
        }
        this.tableData = statusMap(res.list, this.statusMapKey);
        this.pageNation.total = res.count;
      });
    },
    dictTypeFunc(param) {
      pubApi.dictTypeFunc(param).then(res => {
        const userOptions = [];
        for (let i = 0, len = res.length; i < len; i++) {
          if (res[i].status === "0") {
            userOptions.push({
              label: res[i].dictLabel,
              value: res[i].dictValue
            });
          }
        }
        if (param.dictType === "sys_search_status") {
          const obj = {};
          for (let i = 0, len = userOptions.length; i < len; i++) {
            obj[userOptions[i].value] = userOptions[i].label;
          }
          this.statusMapKey = obj;
          // console.log(278, this.statusMapKey);
        }
        if (param.dictType === "sys_role_type") {
          this.roleType = userOptions;
        }
      });
    },
    getMenuType(type) {
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

    statusValChange(item) {
      this.searchBtn();
    },
    /* 获取填入输入框的值  */
    searchBtn() {
      const valObj = Object.assign(getInputVal(this.formInline), {
        pageSize: this.pageNation.pageSize,
        pageNo: 1
      });
      this.init(valObj);
    },
    /* 清除输入框内的值 */
    resetForm() {
      this.init({
        pageSize: this.pageNation.pageSize,
        pageNo: 1,
        ctrlPermi: this.pageNation.ctrlPermi,
        orderBy: ""
      });
      clearFilterVal(this.formInline);
    },
    AddNew() {
      // console.log(row, type);
      this.$refs.RoleEditPanel.show({}, "新增角色");
    },
    moreHandleClick(row) {
      this.currentId = row.id;
      this.changeArrowDirection = !this.changeArrowDirection;
    },
    /* 授权菜单 */
    accreditMenu(row) {
      this.checkedMemu = []; // 清空默认选中的选项
      roleApi
        .getAuthorizeData({ roleCode: row.roleCode, op: "auth" })
        .then(res => {
          const attributes = {
            id: "id",
            parentId: "pId",
            label: "title",
            rootId: "0"
          };
          for (let i = 0, len = res.roleMenuList.length; i < len; i++) {
            this.checkedMemu.push(res.roleMenuList[i].id);
          }
          this.menuTree1 = toTreeData(res.menuMap.default, attributes);
          this.$refs.accreditMenuPanel.init(row);
        });
    },
    dataRights(row) {
      this.$refs.dataRightsPanel.init(row);
    },
    allotUser(row) {
      this.$refs.allotUserPanel.init(row);
    },

    /* 编辑表格 */
    roleEdit(row, type) {
      // console.log(321, row, type);
      this.$refs.RoleEditPanel.show(row, type);
    },
    stopUse(row) {
      // disable enable
      const obj = {
        roleCode: row.roleCode,
        type: ""
      };
      if (row.status === "0") {
        obj.type = "disable";
      }
      if (row.status === "2") {
        obj.type = "enable";
      }
      this.$alertMsgBox(
        `确认要${row.status === "0" ? "停" : "启"}用该用户吗`,
        "信息"
      )
        .then(() => {
          roleApi.stopOrStartRole(obj).then(res => {
            if (res.result === "true") {
              this.init(this.pageNation);
              this.$message.success(res.maessage);
            } else {
              this.$message.error(res.maessage);
            }
          });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    deleteHandleClick(row) {
      // ${row.roleName}
      this.$alertMsgBox(`确认要删除该角色吗`, "信息")
        .then(() => {
          roleApi
            .deleteRole({
              roleCode: row.roleCode
            })
            .then(res => {
              if (res.result === " true") {
                this.init(this.pageNation);
                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    currentChange(val) {
      this.pageNation.pageNo = val;
      this.init(this.pageNation);
    },
    sortChange(sortVal) {
      this.pageNation.orderBy = sortVal;
      this.init(this.pageNation);
    },
    initPage() {
      this.init({
        pageSize: this.pageNation.pageSize,
        pageNo: this.pageNation.pageNo,
        ctrlPermi: this.pageNation.ctrlPermi,
        status: this.pageNation.status
      });
    },
    checkTreeVal(param) {
      this.checkedMemu = param.val;
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
.role-table {
  margin: 0 10px;

  .td-color {
    color: #1890ff;
    cursor: pointer;
  }
  .table-witth {
  }
}
</style>
