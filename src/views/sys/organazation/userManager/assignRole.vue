<template>
  <div class="assign-role-panel">
    <DailogFrame
      :dialog-visible="showAssginRole"
      :title-name="'用户分配角色'"
      @closeDialog="colseAssignRole"
    >
      <template slot="content">
        <div>
          <el-form
            ref="roleForm"
            :model="roleForm"
            label-width="100px"
            class="demo-ruleForm"
            size="mini"
            :rules="rules"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="登录账号：" prop="loginCode">
                  <el-input v-model="roleForm.loginCode" :disabled="true">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户昵称：" prop="userName">
                  <el-input v-model="roleForm.userName" :disabled="true">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <AssignRoleDetail
            ref="tableCheckRef"
            :table-head="tableHead"
            :table-data="tableData"
            :table-check-box-value="tableCheckBoxValue"
            @tableCheckBoxVal="tableCheckBoxVal"
          ></AssignRoleDetail>
        </div>
      </template>
      <template slot="footer">
        <div style="text-indent: 100px;">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="saveAssignRole('userForm')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            size="mini"
            @click="colseAssignRole('roleForm')"
          >
            关闭
          </el-button>
        </div>
      </template>
    </DailogFrame>
  </div>
</template>
<script>
import DailogFrame from "@/components/dailogPanel/frame";
import AssignRoleDetail from "./assignRoleDetail";
import { orgApi } from "@/api/organization";
import { stringVal } from "@/utils/pubFunc";
export default {
  name: "AssignRole",
  components: {
    DailogFrame,
    AssignRoleDetail
  },
  data() {
    return {
      showAssginRole: false,
      roleForm: {
        loginCode: "",
        userName: ""
      },
      tableCheckBoxValue: [],
      userRoleString: "",
      rules: {
        loginAccount: [{ required: true }],
        userAlias: [{ required: true }]
      },
      tableHead: {
        name: "角色名称",
        id: "角色编码"
      },
      tableData: []
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.tableData = this.$store.state.role.roleList;
      this.roleForm = row;
      orgApi
        .getUserDetail({
          userCode: row.userCode,
          op: "auth"
        })
        .then(res => {
          const temp = JSON.parse(JSON.stringify(res.roleList));
          if (res.result === "false" || res.result === "login") {
            this.$message.warning(res.message);
          } else {
            this.showAssginRole = true;
            /* 控制表格回显 有显示 无清空*/
            this.$nextTick(() => {
              const tempArr = [];
              for (let i = 0, len = temp.length; i < len; i++) {
                tempArr.push({
                  id: temp[i].roleCode,
                  name: temp[i].roleName
                });
              }
              this.$refs.tableCheckRef.showHadCheckedRow(tempArr);
            });
          }
        });
    },
    // 多选操作
    tableCheckBoxVal(row) {
      this.userRoleString = stringVal(row, "id");
    },
    /* 保存 */
    saveAssignRole() {
      const obj = {
        op: "auth",
        userType: this.roleForm.userType,
        userCode: this.roleForm.userCode,
        oldLoginCode: this.roleForm.loginCode,
        loginCode: this.roleForm.loginCode,
        userName: this.roleForm.userName,
        userRoleString: this.userRoleString
      };
      orgApi.saveUserRole(obj).then(res => {
        if (res.result === "false") {
          this.$message.warning(res.message);
        } else {
          this.$message.success(res.message);
          this.colseAssignRole();
        }
      });
    },
    colseAssignRole(formName) {
      this.showAssginRole = false;
      this.$refs.roleForm.resetFields();
      this.tableCheckBoxValue = [];
      this.$refs.tableCheckRef.showHadCheckedRow([]);
    }
  }
};
</script>
<style lang="scss" scoped>
.assign-role-panel {
}
</style>
