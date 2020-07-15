<template>
  <div class="allot-user-panel">
    <DailogFrame
      :dialog-visible="showAssginRole"
      :title-name="'用户分配角色'"
      @closeDialog="colseAssignRole"
    >
      <template slot="content">
        <div>
          <div class="top-btn clearfix">
            <div class="fl">
              <i class="el-icon-user"></i>
              <span>
                角色分配用户（{{ roleForm.roleName }}-{{ roleForm.roleCode }}-{{
                  roleForm.userType
                }}）
              </span>
            </div>
            <div class="fr">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="addUser"
              >
                添加用户
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-circle-close"
                size="mini"
                @click="multipleCancel"
              >
                批量取消
              </el-button>
              <el-button type="primary" icon="el-icon-close" size="mini">
                关闭
              </el-button>
            </div>
          </div>
          <InputFliter
            :form-item="formInline"
            style="margin-bottom: 10px;"
            @searchBtn="searchBtn"
            @resetForm="resetForm"
          >
          </InputFliter>
          <TableTree
            ref="tableDomTree"
            :table-head="tableHead"
            :table-data="tableData"
            :slot-columns="slotColumns"
            :page-nation="pageNation"
            @tableCheckBox="tableCheckBox"
            @currentChange="currentChange"
          >
            <template slot="chechbox">
              <el-table-column type="selection" width="40"></el-table-column>
            </template>
            <template slot="status" slot-scope="scope">
              <span
                :style="[{ color: scope.row.status === '0' ? '#000' : '#f00' }]"
              >
                {{ swichText("sys_search_status", scope.row.status, "") }}
              </span>
            </template>
            <template slot="operate">
              <el-table-column
                fixed="right"
                label="操作"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="singleCancel(scope.row)"
                  >
                    <i title="取消授权" class="el-icon-circle-close"></i>
                  </el-button>
                </template>
              </el-table-column>
            </template>
          </TableTree>
          <AddUserPanel
            ref="showAddUserPanel"
            @reloadPage="reloadPage"
          ></AddUserPanel>
        </div>
      </template>
    </DailogFrame>
  </div>
</template>
<script>
import DailogFrame from "@/components/dailogPanel/frame";
import TableTree from "@/components/tableTree";
import InputFliter from "@/components/inputFliter";
import AddUserPanel from "./addUserPanel";
import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
import { roleApi } from "@/api/role";
export default {
  name: "AssignRole",
  components: {
    DailogFrame,
    TableTree,
    InputFliter,
    AddUserPanel
  },
  data() {
    return {
      pageNation: {
        total: null,
        pageNo: 1,
        pageSize: 20,
        ctrlPermi: 2,
        status: "0"
      },
      showAssginRole: false,
      roleForm: {
        roleName: "",
        roleCode: "",
        userType: ""
      },
      tableCheckBoxValue: [],
      slotColumns: ["status"],
      formInline: [
        {
          type: "input",
          value: "",
          key: "loginCode",
          label: "账号"
        },
        {
          type: "input",
          value: "",
          key: "userName",
          label: "昵称"
        },
        {
          type: "input",
          value: "",
          key: "emial",
          label: "邮箱"
        },
        {
          type: "input",
          value: "",
          key: "mobile",
          label: "手机"
        },
        {
          type: "input",
          value: "",
          key: "phone",
          label: "电话"
        }
      ],
      tableHead: {
        loginCode: "登录账号",
        userName: "用户昵称",
        email: "电子邮箱",
        mobile: "手机号码",
        phone: "办公电话",
        updateDate: "更新时间",
        status: "状态"
      },
      tableData: [],
      currentRow: {}
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.currentRow = row;
      this.roleForm = JSON.parse(JSON.stringify(row));
      this.showAssginRole = true;
      this.getFormAuthUser({});
    },
    getFormAuthUser(param) {
      const searchObj = {
        roleCode: this.currentRow.roleCode,
        userType: this.currentRow.userType,
        pageNo: this.pageNation.pageNo,
        pageSize: this.pageNation.pageSize,
        ctrlPermi: this.pageNation.ctrlPermi,
        status: this.pageNation.status
      };
      const obj = Object.assign(param, searchObj);
      roleApi.getFormAuthUser(obj).then(res => {
        this.tableData = res.list;
        this.pageNation.total = res.count;
      });
    },
    // 多选操作
    tableCheckBox(row) {
      this.tableCheckBoxValue = row;
      console.log("选中的row", row);
    },
    /* 添加用户 */
    addUser() {
      this.$refs.showAddUserPanel.show(this.roleForm);
    },
    /* 批量取消*/
    multipleCancel() {
      if (this.tableCheckBoxValue.length === 0) {
        this.$message({
          message: "请选择需要批量取消的数据",
          type: "warning"
        });
      } else {
        const arrId = [];
        for (let i = 0, len = this.tableCheckBoxValue.length; i < len; i++) {
          arrId.push(this.tableCheckBoxValue[i].id);
        }
        const obj = {
          roleCode: this.currentRow.roleCode,
          userRoleString: arrId
        };
        roleApi.deleteAuthUsers(obj).then(res => {
          if (res.result === "true") {
            this.$message.success(res.message);
            this.getFormAuthUser({});
          } else {
            this.$message.error(res.message);
          }
        });
        console.log(11, this.tableCheckBoxValue);
      }
    },
    /* 获取填入输入框的值  */
    searchBtn() {
      // console.log(valObj);
      const valObj = getInputVal(this.formInline);
      this.getFormAuthUser(valObj);
    },
    /* 清除输入框内的值 */
    resetForm() {
      this.getFormAuthUser({});
      clearFilterVal(this.formInline);
    },
    /* 列表文本转义 */
    swichText(type, val, other) {
      return dictTypeMap(type, val, other);
      // console.log(99, dictTypeMap(type, val, other));
    },
    /* 单个取消 */
    singleCancel(row) {
      // console.log(33, row);
      this.$alertMsgBox("确认要取消该用户角色吗？", "信息")
        .then(() => {
          const obj = {
            roleCode: this.currentRow.roleCode,
            userRoleString: row.id
          };
          roleApi.deleteAuthUser(obj).then(res => {
            if (res.result === "true") {
              this.$message.success(res.message);
              this.getFormAuthUser({});
            } else {
              this.$message.error(res.message);
            }
          });
        })
        .catch(() => {
          this.$message.info("取消");
        });
      console.log(row, "单个取消");
    },
    /* 保存 */
    saveAssignRole() {
      console.log(467, this.roleForm, this.tableCheckBoxValue);
      this.colseAssignRole();
    },
    colseAssignRole(formName) {
      this.showAssginRole = false;
      this.resetForm();
      this.tableCheckBoxValue = [];
    },
    currentChange(val) {
      const obj = {
        ctrlPermi: this.pageNation.ctrlPermi,
        pageSize: this.pageNation.pageSize,
        pageNo: val,
        status: this.pageNation.stauts
      };
      this.init(obj);
    },
    reloadPage() {
      this.getFormAuthUser({});
    }
  }
};
</script>
<style lang="scss" scoped>
.allot-user-panel {
  .top-btn {
    border-bottom: 1px solid #eee;
    height: 50px;
    line-height: 50px;
  }
}
</style>
