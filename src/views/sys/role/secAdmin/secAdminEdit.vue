/*新增用户*/
<template>
  <div class="add-user-box">
    <DailogPanel
      :dialog-visible="showDailog"
      :title-name="titleName"
      :app-to-body="true"
      @closeDialog="closeDialog"
    >
      <template slot="content">
        <el-form
          ref="secAdminForm"
          :model="secAdminForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
          :rules="secAdminFormRules"
        >
          <DymForm
            :edit-model="editModel"
            :component-list="componentList"
            :form-value.sync="secAdminForm"
          >
          </DymForm>
        </el-form>
        <ColumnBar :column-text="'可管理数据权限'"></ColumnBar>
        <el-row style="margin-top:20px;">
          <el-col :span="12">
            <el-row :gutter="200">
              <el-col :span="12">
                <el-checkbox
                  v-model="checkAll1"
                  :indeterminate="isIndeterminate1"
                  @change="handleCheckAllChange1"
                >
                  机构权限
                </el-checkbox>
              </el-col>
              <el-col :span="12">
                <span class="ctrol-btn" @click="switchStatus1">
                  展开 / 折叠
                </span>
              </el-col>
            </el-row>
            <el-row style="margin-top:20px;">
              <el-col :span="24">
                <MenuTree
                  ref="menuTreeDom1"
                  :menu-data="officeMenuData"
                  :default-expand="defaultExpand1"
                  :expand-all="expandAll1"
                  :show-checkbox="true"
                  :checked-arr="officeCheckedArr"
                  @passCheckedNode="officePassCheckedNode"
                ></MenuTree>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="200">
              <el-col :span="12">
                <el-checkbox
                  v-model="checkAll2"
                  :indeterminate="isIndeterminate2"
                  @change="handleCheckAllChange2"
                >
                  公司权限
                </el-checkbox>
              </el-col>
              <el-col :span="12">
                <span class="ctrol-btn" @click="switchStatus2">
                  展开 / 折叠
                </span>
              </el-col>
            </el-row>
            <el-row style="margin-top:20px;">
              <el-col :span="24">
                <MenuTree
                  ref="menuTreeDom2"
                  :menu-data="companyMenuData"
                  :default-expand="defaultExpand2"
                  :expand-all="expandAll2"
                  :show-checkbox="true"
                  :checked-arr="companyCheckedArr"
                  @passCheckedNode="companyPassCheckedNode"
                ></MenuTree>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="12">
            <el-row :gutter="200">
              <el-col :span="12">
                <!-- :checked="roleCheckedArr.length ===roleMenuData.length" -->
                <el-checkbox
                  v-model="checkAll3"
                  :indeterminate="isIndeterminate3"
                  @change="handleCheckAllChange3"
                >
                  角色权限
                </el-checkbox>
              </el-col>
              <el-col :span="12">
                <span class="ctrol-btn" @click="switchStatus3">
                  展开 / 折叠
                </span>
              </el-col>
            </el-row>
            <el-row style="margin-top:20px;">
              <el-col :span="24">
                <MenuTree
                  ref="menuTreeDom3"
                  :menu-data="roleMenuData"
                  :default-expand="defaultExpand3"
                  :expand-all="expandAll3"
                  :show-checkbox="true"
                  :checked-arr="roleCheckedArr"
                  @passCheckedNode="rolePassCheckedNode"
                ></MenuTree>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
      <template slot="footer">
        <el-button size="mini" type="primary" @click="saveBtn">保存</el-button>
        <el-button size="mini" @click="colseBtn">关闭</el-button>
      </template>
    </DailogPanel>
  </div>
</template>
<script>
import DymForm from "@/components/element/dymForm";
import DailogPanel from "@/components/dailogPanel/frame";
import ColumnBar from "@/components/commonColumn";
import MenuTree from "@/components/menuTree";
import {
  toTreeData,
  clearFilterVal,
  getInputVal,
  dictTypeMap,
  resetVal
} from "@/utils/pubFunc";
import { roleApi } from "@/api/role";
import { pubApi } from "@/api/public_request";

export default {
  name: "",
  components: {
    DailogPanel,
    DymForm,
    ColumnBar,
    MenuTree
  },
  data() {
    return {
      showDailog: false,
      titleName: "二级管理员管理数据权限",
      editModel: "E",
      currentRow: {},
      secAdminForm: {
        loginCode: "",
        userName: "",
        userCode: ""
      },
      componentList: [
        {
          label: "登录账号：",
          prop: "loginCode",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "loginCode",
          disabled: true
        },
        {
          label: "用户昵称：",
          prop: "userName",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "userName",
          disabled: true
        }
      ],
      secAdminFormRules: {
        loginCode: [{ required: true, message: "必填信息", trigger: "blur" }],
        userName: [{ required: true, message: "必填信息", trigger: "blur" }]
      },
      isIndeterminate1: true,
      isIndeterminate2: true,
      isIndeterminate3: true,
      officeMenuData: [],
      officeMenuDataSource: [],
      officeCheckedArr: [],
      officeCheckedArrSave: [],
      companyMenuData: [],
      companyMenuDataSource: [],
      companyCheckedArr: [],
      companyCheckedArrSave: [],
      roleMenuData: [],
      roleMenuDataSource: [],
      roleCheckedArr: [],
      roleCheckedArrSave: [],
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      defaultExpand1: [],
      defaultExpand2: [],
      defaultExpand3: [],
      expandAll1: false,
      expandAll2: false,
      expandAll3: false
    };
  },
  methods: {
    show(row, type) {
      this.currentRow = row;
      this.init(row);
    },
    init(row) {
      this.secAdminForm.loginCode = row.loginCode;
      this.secAdminForm.userName = row.userName;
      this.secAdminForm.userCode = row.userCode;
      Promise.all([
        this.editInitSecAdmin(row),
        this.getCompanyMenuTree(),
        this.getOfficeMenuTree(),
        this.getRoleMenuTree()
      ]).then(res => {
        console.log(299, res);
      });
      // this.showDailog = true;
    },
    saveBtn() {
      const tempUserDataScopeListJson = Object.assign(
        this.companyCheckedArrSave,
        this.officeCheckedArrSave,
        this.roleCheckedArrSave
      );
      const obj = {
        userCode: this.secAdminForm.userCode,
        loginCode: this.secAdminForm.loginCode,
        userName: this.secAdminForm.userName,
        userDataScopeListJson: JSON.stringify(tempUserDataScopeListJson)
      };
      // console.log(77, obj);
      roleApi.saveSecAdmin(obj).then(res => {
        if (res.result === "true") {
          this.$message.success(res.message);
          this.$emit("initPage");
          this.showDailog = false;
        } else {
          this.$message.error(res.message);
        }
        console.log(231, this.roleCheckedArrSave);
      });
    },
    colseBtn() {
      this.closeDialog();
    },
    // 关闭对话框选择
    closeDialog() {
      this.resetForm();
      this.showDailog = false;
    },
    /* 清除输表单里的值 */
    resetForm() {
      this.secAdminForm.loginCode = "";
      this.secAdminForm.userName = "";
      this.companyCheckedArr = [];
      this.officeCheckedArr = [];
      this.roleCheckedArr = [];
    },
    /* 展开或收起选项 */
    switchStatus1() {
      this.expandAll1 = !this.expandAll1;
      this.$refs.menuTreeDom1.showOrHiddenAllNodes();
    },
    switchStatus2() {
      this.expandAll2 = !this.expandAll2;
      this.$refs.menuTreeDom2.showOrHiddenAllNodes();
    },
    switchStatus3() {
      this.expandAll3 = !this.expandAll3;
      this.$refs.menuTreeDom3.showOrHiddenAllNodes();
    },
    /* 设置全选反选 */
    handleCheckAllChange1(val) {
      this.$refs.menuTreeDom1.checkAll(val);
      this.isIndeterminate1 = false;
    },
    /* 设置全选反选 */
    handleCheckAllChange2(val) {
      this.$refs.menuTreeDom2.checkAll(val);
      this.isIndeterminate2 = false;
    },
    /* 设置全选反选 */
    handleCheckAllChange3(val) {
      this.$refs.menuTreeDom3.checkAll(val);
      this.isIndeterminate3 = false;
    },
    // 已选择机构
    officePassCheckedNode(data) {
      this.officeCheckedArrSave = resetVal(data, "Office");
      if (data.length === this.companyMenuDataSource.length) {
        this.expandAll1 = true;
        this.isIndeterminate1 = false;
      } else {
        this.expandAll1 = false;
        this.isIndeterminate1 = true;
      }
    },
    // 已选择公司
    companyPassCheckedNode(data) {
      this.companyCheckedArrSave = resetVal(data, "Company");
      if (data.length === this.companyMenuDataSource.length) {
        this.expandAll2 = true;
        this.isIndeterminate2 = false;
      } else {
        this.expandAll2 = false;
        this.isIndeterminate2 = true;
      }
    },
    // 已选用户
    rolePassCheckedNode(data) {
      this.roleCheckedArrSave = resetVal(data, "Role");
      if (data.length === this.roleMenuDataSource.length) {
        this.expandAll3 = true;
        this.isIndeterminate3 = false;
      } else {
        this.expandAll3 = false;
        this.isIndeterminate3 = true;
      }
    },
    /* 初始化页面 */
    editInitSecAdmin(row) {
      /* "Company" "Office"  "Role"*/
      return new Promise((resolve, reject) => {
        roleApi.editInitSecAdmin({ userCode: row.userCode }).then(res => {
          for (let i = 0, len = res.userDataScopeList.length; i < len; i++) {
            if (res.userDataScopeList[i].ctrlType === "Company") {
              this.companyCheckedArr.push(res.userDataScopeList[i].ctrlData);
            }
            if (res.userDataScopeList[i].ctrlType === "Office") {
              this.officeCheckedArr.push(res.userDataScopeList[i].ctrlData);
            }
            if (res.userDataScopeList[i].ctrlType === "Role") {
              this.roleCheckedArr.push(res.userDataScopeList[i].ctrlData);
            }
          }
          this.showDailog = true;
          resolve(res);
        });
      });
    },
    /* 获取全部公司 */
    getCompanyMenuTree() {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      return new Promise((resolve, reject) => {
        pubApi.getCompanyMenuTree().then(res => {
          this.companyMenuDataSource = JSON.parse(JSON.stringify(res));
          this.companyMenuData = toTreeData(res, attributes);
          if (
            this.companyCheckedArr.length === this.companyMenuDataSource.length
          ) {
            this.isIndeterminate2 = false;
            this.checkAll2 = true;
          } else if (this.companyMenuData === 0) {
            this.isIndeterminate2 = false;
            this.checkAll2 = false;
          } else {
            this.isIndeterminate2 = true;
            this.checkAll2 = false;
          }
          resolve(res);
        });
      });
    },
    /* 获取全部机构 */
    getOfficeMenuTree() {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      return new Promise((resolve, rejec) => {
        pubApi
          .getOfficeMenuTree({ ctrlPermi: 2, excludeCode: "" })
          .then(res => {
            this.officeMenuDataSource = JSON.parse(JSON.stringify(res));
            this.officeMenuData = toTreeData(res, attributes);
            if (
              this.officeCheckedArr.length === this.officeMenuDataSource.length
            ) {
              this.isIndeterminate1 = false;
              this.checkAll1 = true;
            } else if (this.officeMenuData === 0) {
              this.isIndeterminate1 = false;
              this.checkAll1 = false;
            } else {
              this.isIndeterminate1 = true;
              this.checkAll1 = false;
            }
            resolve(res);
          });
      });
    },

    /* 获取全部角色 */
    getRoleMenuTree() {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      return new Promise((resolve, reject) => {
        pubApi.getRoleMenuTree({ ctrlPermi: 2, excludeCode: "" }).then(res => {
          this.roleMenuDataSource = JSON.parse(JSON.stringify(res));
          this.roleMenuData = toTreeData(res, attributes);
          if (this.roleCheckedArr.length === this.roleMenuDataSource.length) {
            this.isIndeterminate3 = false;
            this.checkAll3 = true;
          } else if (this.roleCheckedArr === 0) {
            this.isIndeterminate3 = false;
            this.checkAll3 = false;
          } else {
            this.isIndeterminate3 = true;
            this.checkAll3 = false;
          }
          resolve(res);
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.choosed-data {
  border: 1px solid #eee;
  height: 100%;
  padding: 10px;
  border-radius: 4px;
}
.add-user-box {
}
</style>
