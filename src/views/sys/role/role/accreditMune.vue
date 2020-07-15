<template>
  <div class="data-rights-panel">
    <DailogFrame
      :dialog-visible="showDataRights"
      :title-name="titleName"
      @closeDialog="colseDataRights"
    >
      <template slot="content">
        <div>
          <el-form
            ref="dataRightsForm"
            :model="dataRightsForm"
            label-width="100px"
            class="demo-ruleForm"
            size="mini"
            :rules="rules"
          >
            <dym-form
              :edit-model="editModel"
              :component-list="componentList"
              :form-value.sync="dataRightsForm"
            >
            </dym-form>
          </el-form>
          <ColumnBar :column-text="columnBarName"></ColumnBar>
          <!-- 授权一个  二级权限管理三个 -->
          <MenuRights
            ref="menuRights"
            :t-name1="tName1"
            :t-name2="tName2"
            :t-name3="tName3"
            :menu-tree1="menuTree1"
            :menu-tree2="menuTree2"
            :menu-tree3="menuTree3"
            :checked-memu1="checkedMemu1"
            :checked-memu2="checkedMemu2"
            :checked-memu3="checkedMemu3"
            @checkTree="checkTree"
          ></MenuRights>
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
// import { } from "module";

import dymForm from "@/components/element/dymForm";
import ColumnBar from "@/components/commonColumn";
import DailogFrame from "@/components/dailogPanel/frame";
import MenuRights from "@/components/menuRights";
import { roleApi } from "@/api/role";
export default {
  name: "DataRights",
  components: {
    DailogFrame,
    ColumnBar,
    MenuRights,
    dymForm
  },
  props: {
    columnBarName: {
      type: String,
      default: "板块标题"
    },
    tName1: {
      type: String,
      default: ""
    },
    tName2: {
      type: String,
      default: ""
    },
    tName3: {
      type: String,
      default: ""
    },
    titleName: {
      type: String,
      default: "提示"
    },
    menuTree1: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    menuTree2: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    menuTree3: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    checkedMemu1: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    checkedMemu2: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    checkedMemu3: {
      type: [Array],
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      editModel: "E",
      showDataRights: false,
      checked: true,
      dataRightsForm: {
        loginAccount: "",
        userAlias: ""
      },
      componentList: [
        {
          label: "角色名称：",
          prop: "roleName",
          labelWidth: "90px",
          disabled: true,
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          maxlength: "64",
          placeholder: "请输入",
          value: "roleName"
        },
        {
          label: "角色编码：",
          prop: "roleCode",
          labelWidth: "90px",
          disabled: true,
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "roleCode"
        }
      ],
      rules: {
        roleName: [{ required: true }],
        roleCode: [{ required: true }]
      },

      currentRow: {},
      roleMenuListJson: []
    };
  },
  computed: {
    checkedVals: {
      get() {
        return this.checkedMemu1;
      },
      set(val) {
        this.roleMenuListJson = val;
        // console.log(143, val);
      }
    }
  },
  methods: {
    init(row) {
      this.dataRightsForm = JSON.parse(JSON.stringify(row));
      this.showDataRights = true;
      this.currentRow = row;
      this.$nextTick(() => {
        // console.log(218, this.checkedMemu1);
        this.$refs.menuRights.setDefaultChecked();
      });
    },
    checkTree(param) {
      this.checkedVals = param.val;
      console.log("授权功能弹窗", param);
    },
    /* 保存 */
    saveDataRights() {
      console.log(207, this.roleMenuListJson);
      return;
      const obj = {
        op: "auth",
        oldRoleName: this.currentRow.roleName,
        roleName: this.currentRow.roleName,
        isNewRecord: false,
        roleCode: this.currentRow.roleCode,
        roleMenuListJson: JSON.stringify(this.roleMenuListJson)
      };
      roleApi.saveAuthorizeData(obj).then(res => {
        if (res.result === "true") {
          this.$message.success(res.message);
        }
        this.colseDataRights();
      });
    },
    colseDataRights(formName) {
      this.showDataRights = false;
      this.tableCheckBoxValue = [];
    }
  }
};
</script>
<style></style>
<style lang="scss" scoped>
.data-rights-panel {
  .ctrol-btn {
    cursor: pointer;
    line-height: 30px;
    display: inline-block;
    text-align: right;
    width: 85%;
  }
}
</style>
