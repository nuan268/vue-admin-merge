<template>
  <div class="role-edit-panel">
    <DailogFrame
      :dialog-visible="showEditDailog"
      :title-name="titleName"
      @closeDialog="closeEditDialog"
    >
      <template slot="content">
        <div>
          <el-form
            ref="roleForm"
            label-width="100px"
            class="demo-ruleForm small-space"
            size="mini"
            :rules="rules"
            :model="form"
            onsubmit="return false;"
          >
            <dym-form
              :edit-model="editModel"
              :component-list="componentList"
              :form-value.sync="form"
            >
            </dym-form>
            <ColumnBar
              :column-text="'扩展字段'"
              :icon-tips="true"
              @showExtentionDetail="showExtentionDom"
            ></ColumnBar>
            <ExtentionFeild
              ref="extentionDom"
              :style="{ height: exHeight }"
              style="overflow: hidden;"
              :extention-form="extend"
              @extentionFormVal="extentionFormVal"
            ></ExtentionFeild>
            <div v-if="titleName == '新增角色'">
              <ColumnBar :column-text="'授权功能菜单'"></ColumnBar>
              <MenuRights
                :menu-tree1="menuTree1"
                :t-name1="'主导航菜单'"
                @checkTree="checkTreeVal"
              ></MenuRights>
            </div>
          </el-form>
        </div>
      </template>
      <!-- 新增比编辑多授权功能选择项 -->
      <template slot="footer">
        <div style="text-indent: 100px;">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="submitForm('roleForm')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            size="mini"
            @click="colseRole('roleForm')"
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
import ColumnBar from "@/components/commonColumn";
import ExtentionFeild from "@/components/extentionFeild";
import MenuRights from "@/components/menuRights";

import dymForm from "@/components/element/dymForm";
import { returnReg } from "@/utils/validate";
import { roleApi } from "@/api/role";
import { pubApi } from "@/api/public_request";
import { formExtendMap, formExtendClear, toTreeData } from "@/utils/pubFunc";
export default {
  name: "RoleEdit",
  components: {
    DailogFrame,
    ColumnBar,
    ExtentionFeild,
    MenuRights,
    dymForm
  },
  props: {
    userStatusOptions: {
      type: Array,
      default: () => {
        return [];
      }
    },
    roleType: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      editModel: "E",
      titleName: "",
      exHeight: "0px",
      showEditDailog: false,
      menuTreeTitle: "",
      gutterVal: 100,
      options: [],
      form: {
        roleName: "",
        oldRoleName: "",
        roleCode: "",
        roleSort: "",
        userType: "",
        isSys: "",
        roleType: "",
        remarks: ""
      },
      extend: {
        extendS1: "",
        extendS2: "",
        extendS3: "",
        extendS4: "",
        extendS5: "",
        extendS6: "",
        extendS7: "",
        extendS8: "",
        extendI1: "",
        extendI2: "",
        extendI3: "",
        extendI4: "",
        extendF1: "",
        extendF2: "",
        extendF3: "",
        extendF4: "",
        extendD1: "",
        extendD2: "",
        extendD3: "",
        extendD4: ""
      },
      componentList: [
        {
          label: "基本信息", // 授权功能菜单
          lineTips: true,
          cols: [24, 24, 24, 24],
          showFlag: false
        },
        {
          label: "角色名称：",
          prop: "roleName", // 表单验证传入的值
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          maxlength: "64",
          placeholder: "请输入",
          value: "roleName" // 字段显示的值
        },
        {
          label: "角色编码：",
          prop: "roleCode", // 表单验证传入的值
          labelWidth: "90px",
          disabled: true,
          componentName: "el-input", // BaseSelect
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "roleCode"
        },
        {
          label: "排序号：",
          prop: "roleSort",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "roleSort"
        },
        {
          label: "用户类型：",
          prop: "userType",
          labelWidth: "90px",
          componentName: "BaseSelect",
          options: [], // this.roleType
          cols: [12, 12, 12, 12],
          placeholder: "请选择",
          value: "userType",
          width: "100%"
        },
        {
          label: "系统角色：",
          prop: "isSys",
          labelWidth: "90px",
          componentName: "RadioChoose",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "isSys", // radioVal
          // value: "2",
          // checkedRadio: "",
          radios: [
            {
              label: "1",
              labelName: "是"
            },
            {
              label: "0",
              labelName: "否"
            }
          ]
        },
        {
          label: "角色分类：",
          prop: "roleType",
          labelWidth: "90px",
          componentName: "BaseSelect",
          options: [], // this.userStatusOptions,
          //  selectedField: ['id', 'name'],
          cols: [12, 12, 12, 12],
          placeholder: "请选择",
          value: "roleType",
          width: "100%"
        },
        {
          label: "备注信息：",
          prop: "remarks",
          labelWidth: "90px",
          componentName: "el-input",
          rowsSpan: 4,
          cols: [24, 24, 24, 24],
          type: "textarea",
          placeholder: "请输入",
          value: "remarks"
        }
      ],
      rules: {
        roleName: [
          {
            // pattern: returnReg("otaGrade"),
            required: true,
            message: "必填信息",
            trigger: "blur"
          }
        ],
        roleCode: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        roleSort: [
          {
            required: true,
            pattern: returnReg("positiveInteger"),
            message: "请输入一个正整数",
            trigger: "blur"
          }
        ],
        isSys: [
          {
            required: true,
            message: "请选择系统角色",
            trigger: "change"
          }
        ],
        menuMapDefault: []
      },
      menuTree1: [],
      checkTree1: [],
      checkTree2: [],
      checkTree3: [],
      roleMenuListJson: []
    };
  },
  watch: {
    userStatusOptions: {
      handler(val, oldVal) {
        this.componentList[4].options = val;
      },
      // 监听到数据变化时立即调用
      immediate: true
    },
    roleType: {
      handler(val, oldVal) {
        this.componentList[6].options = val;
      },
      // 监听到数据变化时立即调用
      immediate: true
    }
  },
  mounted() {},
  methods: {
    init() {
      if (this.form.id) {
        this.add = true;
        this.addLineForm = this.form.extend;
      } else {
        this.form.id = "";
        this.add = false;
      }
    },
    /* 显示对话框 */
    show(row, type) {
      this.titleName = type;
      if (type === "编辑角色") {
        this.componentList[2].disabled = true;
        roleApi
          .editAndAddRole({ roleCode: row.roleCode, op: "edit" })
          .then(res => {
            this.form.roleName = res.role.roleName;
            this.form.oldRoleName = res.role.roleName;
            this.form.roleCode = res.role.roleCode;
            this.form.roleSort = res.role.roleSort;
            this.form.userType = res.role.userType;
            this.form.isSys = res.role.isSys;
            this.form.roleType = res.role.roleType;
            this.form.remarks = res.role.remarks;
            this.extend = formExtendMap(this.extend, res.role.extend);
            this.showEditDailog = true;
          });
      }
      if (type === "新增角色") {
        this.getAuthorizeData();
        roleApi.editAndAddRole({ op: "add" }).then(res => {
          this.form.roleSort = res.role.roleSort;
          this.form.isSys = res.role.isSys;
          this.form.userType = res.role.userType;
        });
        this.componentList[2].disabled = false;
        this.showEditDailog = true;
        this.form.oldRoleName = "";
      }
    },
    /* 获取用户列表 */
    getUserStatusOptions() {
      const userOptions = [];
      pubApi.dictTypeFunc({ dictType: "sys_user_type" }).then(res => {
        for (let i = 0, len = res.length; i < len; i++) {
          if (res[i].status === "0") {
            userOptions.push({
              label: res[i].dictLabel,
              value: res[i].dictValue
            });
          }
        }

        return userOptions;
      });
    },
    /* 显示扩展字段 */
    showExtentionDom() {
      this.exHeight = this.exHeight === "0px" ? "480px" : "0px";
    },
    /* 扩展字段值 */
    extentionFormVal(val) {
      this.roleForm.extentionForm = val;
    },
    /* 获取授权菜单 */
    getAuthorizeData() {
      roleApi.getAuthorizeData({ roleCode: "" }).then(res => {
        console.log(359, "获取授权菜单", res);
        const attributes = {
          id: "id",
          parentId: "pId",
          label: "title",
          rootId: "0"
        };
        this.menuTree1 = toTreeData(res.menuMap.default, attributes);
      });
    },
    checkTreeVal(param) {
      const idArr = [];
      for (let i = 0, len = param.val.length; i < len; i++) {
        idArr.push(param.val[i].id);
      }
      switch (param.current) {
        case 1:
          this.checkTree1 = idArr || [];
          break;
        case 2:
          this.checkTree2 = idArr || [];
          break;
        case 3:
          this.checkTree3 = idArr || [];
          break;
      }
    },
    changeSystem(val) {
      // this.roleForm.isSys = val;
      console.log(272, val);
    },
    /* 提交 */
    submitForm(formName) {
      console.log(397, this.checkTree1);
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = {};
          if (this.titleName === "新增角色") {
            obj.op = "add";
            obj.isNewRecord = true;
          } else {
            obj.op = "edit";
            obj.isNewRecord = false;
          }
          for (const key in this.extend) {
            obj["extend." + key] = this.extend[key];
          }
          obj.oldRoleName = this.form.oldRoleName;
          obj.roleName = this.form.roleName;
          obj.roleCode = this.form.roleCode;
          obj.roleSort = this.form.roleSort;
          obj.userType = this.form.userType;
          obj.isSys = this.form.isSys;
          obj.roleType = this.form.roleType;
          obj.remarks = this.form.remarks;
          /* roleMenuListJson 新增时候的授权列表["1244877435923841024","1244877436259385344"]*/
          obj.roleMenuListJson = JSON.stringify(this.checkTree1);
          // if (this.checkTree2.length) {
          //   obj.roleMenuListJson = this.checkTree1.concat(this.checkTree2);
          // }
          // if (this.checkTree3.length) {
          //   obj.roleMenuListJson = this.checkTree1.concat(this.checkTree3);
          // }
          roleApi.addRole(obj).then(res => {
            if (res.result === "true") {
              this.$message.success(res.message);
              this.$emit("initPage");
            } else {
              this.$message.warning(res.message);
            }
          });
          this.closeEditDialog();
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      //       op: add
      // oldRoleName:
      // roleName: 角色名称
      // isNewRecord: true
      // roleCode: ROELCODE
      // roleSort: 40
      // userType: employee
      // isSys: 1
      // roleType:
      // remarks
      // roleMenuListJson:[]
    },
    /* 关闭编辑对话框 */
    closeEditDialog() {
      this.showEditDailog = false;
      this.$refs.roleForm.resetFields();
      this.extend = formExtendClear(this.extend);
    },
    /* 关闭按钮 */
    colseRole(formName) {
      this.closeEditDialog();
    }
  }
};
</script>
<style lang="scss" scoped>
.role-edit-panel {
}
</style>
