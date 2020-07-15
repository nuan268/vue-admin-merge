<template>
  <div class="data-rights-panel">
    <DailogFrame
      :dialog-visible="showDataRights"
      :title-name="'用户分配数据权限'"
      @closeDialog="colseDataRights"
    >
      <template slot="content">
        <div>
          <el-form
            ref="formDetail"
            :model="formDetail"
            label-width="100px"
            class="demo-ruleForm"
            size="mini"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="登录账号：" prop="loginCode">
                  <el-input
                    v-model="formDetail.empUser.loginCode"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户昵称：" prop="userName">
                  <el-input
                    v-model="formDetail.empUser.userName"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <ColumnBar :column-text="'数据权限'"></ColumnBar>
          <el-row style="margin-top:20px;">
            <el-col :span="12">
              <el-row :gutter="200">
                <el-col :span="12">
                  <el-checkbox
                    v-model="checkAll1"
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
          </el-row>
        </div>
      </template>
      <template slot="footer">
        <div style="text-indent: 100px;">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="saveDataRights('userForm')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            size="mini"
            @click="colseDataRights('userForm')"
          >
            关闭
          </el-button>
        </div>
      </template>
    </DailogFrame>
  </div>
</template>
<script>
import ColumnBar from "@/components/commonColumn";
import DailogFrame from "@/components/dailogPanel/frame";
import MenuTree from "@/components/menuTree";
import { orgApi } from "@/api/organization";
import { pubApi } from "@/api/public_request";
import { toTreeData, resetVal } from "@/utils/pubFunc";
export default {
  name: "DataRights",
  components: {
    DailogFrame,
    ColumnBar,
    MenuTree
  },
  data() {
    return {
      showDataRights: false,
      checked: true,
      formDetail: {
        empUser: {
          loginCode: "",
          userName: ""
        }
      },
      officeMenuData: [],
      officeCheckedArr: [],
      officeCheckedArrSave: [],
      companyMenuData: [],
      companyCheckedArr: [],
      companyCheckedArrSave: [],
      checkAll1: false,
      checkAll2: false,
      defaultExpand1: [],
      defaultExpand2: [],
      expandAll1: false,
      expandAll2: false
    };
  },
  methods: {
    init(res) {
      console.log(164, this.$store.state.publicData);
      this.formDetail = JSON.parse(JSON.stringify(res));

      Promise.all([this.getCompanyMenuTree(), this.getOfficeMenuTree()]).then(
        res => {
          // 已经选择的 默认的
          const temp = this.formDetail.userDataScopeList;
          for (let i = 0, len = temp.length; i < len; i++) {
            if (temp[i]["ctrlType"] === "Company") {
              this.companyCheckedArr.push(temp[i].ctrlData);
            } else if (temp[i]["ctrlType"] === "Office") {
              this.officeCheckedArr.push(temp[i].ctrlData);
            }
          }
          this.showDataRights = true;
          this.$nextTick(() => {
            this.$refs.menuTreeDom1.expandFirst(this.officeMenuData);
            this.$refs.menuTreeDom2.expandFirst(this.companyMenuData);
          });
        }
      );
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

          resolve(res);
        });
      });
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
    /* 保存 */
    saveDataRights() {
      // [{"ctrlType":"Company","ctrlData":"SD"},{"ctrlType":"Office","ctrlData":"SDJN"}]
      const temp = this.officeCheckedArrSave.concat(this.companyCheckedArrSave);
      orgApi
        .saveDataRightDetail({
          userCode: this.formDetail.empUser.userCode,
          loginCode: this.formDetail.empUser.loginCode,
          userName: this.formDetail.empUser.userName,
          userDataScopeListJson: JSON.stringify(temp) || "[]"
        })
        .then(res => {
          if (res.result === "true") {
            this.$message.success(res.message);
            this.colseDataRights();
          } else {
            this.$message.warning(res.message);
          }
        });
    },
    colseDataRights(formName) {
      this.showDataRights = false;
      this.tableCheckBoxValue = [];
      this.$refs.menuTreeDom1.resetChecked();
      this.$refs.menuTreeDom2.resetChecked();
    },
    /* 设置全选反选 */
    handleCheckAllChange1(val) {
      this.$refs.menuTreeDom1.checkAll(val);
    },
    /* 设置全选反选 */
    handleCheckAllChange2(val) {
      this.$refs.menuTreeDom2.checkAll(val);
    },
    // 已选择机构
    officePassCheckedNode(data) {
      this.officeCheckedArrSave = resetVal(data, "Office");
    },
    // 已选择公司
    companyPassCheckedNode(data) {
      this.companyCheckedArrSave = resetVal(data, "Company");
    }
  }
};
</script>
<style lang="scss" scoped>
.data-rights-panel {
  .ctrol-btn {
    cursor: pointer;
    line-height: 30px;
  }
}
</style>
