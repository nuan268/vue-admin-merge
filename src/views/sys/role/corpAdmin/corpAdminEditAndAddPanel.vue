<template>
  <div class="user-edit-panel">
    <DailogFrame
      :dialog-visible="showEditDailog"
      :title-name="`${titleName}管理员`"
      @closeDialog="closeEditDialog"
    >
      <template slot="content">
        <div>
          <ColumnBar :column-text="'基本信息'"></ColumnBar>
          <el-form
            ref="form"
            :model="form"
            label-width="140px"
            class="demo-ruleForm"
            size="mini"
            :rules="rules"
          >
            <DymForm
              :edit-model="editModel"
              :component-list="componentList"
              :form-value.sync="form"
              @input="inputIt"
            >
            </DymForm>

            <TableTree
              ref="table"
              :table-head="tableHead"
              :table-data="roleChooseList"
              :default-height="150"
              :show-index="true"
              :show-page="false"
              @tableCheckBox="tableCheckBox"
            >
              <template slot="chechbox">
                <el-table-column type="selection" width="40"></el-table-column>
              </template>
            </TableTree>
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
            <!-- :extention-form="userForm.extentionForm" -->
          </el-form>
        </div>
      </template>

      <template slot="footer">
        <div style="text-indent: 100px;">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="submitForm('form')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            size="mini"
            @click="colseUser('form')"
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
import TableTree from "@/components/tableTree";
import ExtentionFeild from "@/components/extentionFeild";
import DymForm from "@/components/element/dymForm";
import { roleApi } from "@/api/role";
import { returnReg } from "@/utils/validate";
import { stringVal } from "@/utils/pubFunc";
import { pubApi } from "@/api/public_request";
export default {
  name: "UserEdit",
  components: {
    DailogFrame,
    DymForm,
    ColumnBar,
    TableTree,
    ExtentionFeild
    // AssignRoleDetail
  },
  data() {
    const validTelNumber = (rule, value, callback) => {
      const phoneReg = returnReg("phone");
      const telReg = returnReg("telNumber");
      if (!phoneReg.test(value) && !telReg.test(value) && value !== "") {
        callback(
          new Error(
            "请正确填写您的办公号码，固话为区号0(3-4位)号码-(7-9位),手机为1开头的11位手机号段"
          )
        );
      } else {
        callback();
      }
    };
    const validateLoginCode = (rule, value, callback) => {
      if (this.loginCodeHad) {
        callback(new Error("登录账号已存在"));
      } else {
        callback();
      }
    };
    return {
      op: "",
      loginCodeHad: "",
      oldLoginCode: "",
      titleName: "",
      editModel: "E",
      showEditDailog: false,
      exHeight: "0px",
      form: {
        userCode: "",
        corpCode_: "",
        corpName_: "",
        loginCode: "",
        userName: "",
        email: "",
        mobile: "",
        phone: "",
        userWeight: "",
        remarks: ""
      },
      componentList: [
        // {
        //   label: "租户代码：",
        //   prop: "corpCode_",
        //   labelWidth: "120px",
        //   componentName: "el-input",
        //   cols: [12, 12, 12, 12],
        //   placeholder: "请输入租户代码",
        //   value: "corpCode_",
        //   disabled: false
        // },
        // {
        //   label: "租户名称：",
        //   prop: "corpName_",
        //   labelWidth: "120px",
        //   componentName: "el-input",
        //   cols: [12, 12, 12, 12],
        //   placeholder: "请输入租户名称",
        //   value: "corpName_",
        //   disabled: false
        // },
        {
          label: "登录账号：",
          prop: "loginCode",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "loginCode"
        },
        {
          label: "用户昵称：",
          prop: "userName",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "userName"
        },
        {
          label: "电子邮箱：",
          prop: "email",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "email",
          addIcon: true,
          slotPosition: "prepend",
          iconType: "fa fa-fw fa-envelope"
        },
        {
          label: "手机号：",
          prop: "mobile",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "mobile",
          addIcon: true,
          slotPosition: "prepend",
          iconType: "fa fa-fw fa-mobile"
        },
        {
          label: "办公电话：",
          prop: "phone",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "phone",
          addIcon: true,
          slotPosition: "prepend",
          iconType: "fa fa-fw fa-phone"
        },
        {
          label: "权重（排序）：",
          prop: "userWeight",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "权重越大排名越靠前，请填写数字。",
          value: "userWeight"
        },
        {
          label: "备注信息：",
          prop: "remarks",
          labelWidth: "120px",
          componentName: "el-input",
          type: "textarea",
          cols: [24, 24, 24, 24],
          value: "remarks"
        },
        {
          label: "分配角色",
          lineTips: true,
          cols: [24, 24, 24, 24],
          showFlag: false
        }
      ],
      slotColumns: ["officeName", "postCode"],
      tableHead: {
        name: "角色名称",
        id: "角色编码"
      },
      roleChooseList: [],
      tableCheckBoxValueDetail: [],
      addCountIndex: 0,
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
      attchCurrentRow: {},
      rules: {
        // corpCode_: [
        //   { required: true, message: "请输入租户代码", trigger: "blur" },
        //   {
        //     pattern: returnReg("letterNumber"),
        //     message: "请输入字母数字或下划线",
        //     trigger: "blur"
        //   }
        // ],
        // corpName_: [
        //   { required: true, message: "请输入租户名称", trigger: "blur" }
        // ],
        loginCode: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          {
            min: 4,
            max: 20,
            message: "长度在 4 到 20 个字符",
            trigger: "blur"
          },
          {
            validator: validateLoginCode
          }
        ],
        userName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" }
        ],
        email: [
          {
            pattern: returnReg("email"),
            message: "请输入正确的邮箱",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            pattern: returnReg("phone"),
            message: "输入正确的手机号",
            trigger: "blur"
          }
        ],
        phone: [{ validator: validTelNumber, trigger: "blur" }],
        userWeight: [
          {
            validator: returnReg("positiveInteger"),
            message: "权重越大排名越靠前，请填写数字。",
            trigger: "blur",
            type: "number",
            transform(value) {
              // 用于解决数字非必填函数。如果没有该函数，该字段会在表单提交时候进行触发（形成必填字段）
              return Number(value);
            }
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    /* 获取编辑详情 */
    show(row, type) {
      console.log(298, row, type);
      this.titleName = type;
      pubApi.getRoleMenuTree({ isAll: true }).then(res => {
        this.roleChooseList = res;
      });
      if (type === "新增") {
        this.op = "addAdmin";
        this.showEditDailog = true;
        // this.componentList[0].disabled = false;
        // this.componentList[1].disabled = false;
      } else if (type === "行新增") {
        this.op = "addAdmin";
        // this.form.corpCode_ = row.corpCode_;
        // this.form.corpName_ = row.corpName_;
        // this.componentList[0].disabled = true;
        // this.componentList[1].disabled = true;
        this.showEditDailog = true;
      } else {
        this.op = "edit";
        // this.componentList[0].disabled = true;
        // this.componentList[1].disabled = true;
        this.oldLoginCode = row.loginCode;
        roleApi
          .getCorpAdminEdit({ op: "edit", userCode: row.userCode })
          .then(res => {
            this.form = res.user;
            // this.form.userWeight = String(res.user.userWeight);
            const extend = res.user.extend;
            for (const key in extend) {
              if (extend[key]) {
                this.extend[key] = extend[key];
              }
            }
            this.showEditDailog = true;
            this.showHadCheckedRow(res.roleList);
          });
      }
    },
    // 多选回显 有值设置默认选中 无值清空
    showHadCheckedRow(roleList) {
      const defaultChecked = [];
      for (let i = 0, len = roleList.length; i < len; i++) {
        defaultChecked.push({
          name: roleList[i].roleName,
          id: roleList[i].id
        });
      }
      this.$nextTick(() => {
        this.$refs.table.toggleSelection(defaultChecked);
      });
    },
    // 多选操作
    tableCheckBox(row) {
      this.tableCheckBoxValueDetail = [];
      for (let i = 0, len = row.length; i < len; i++) {
        this.tableCheckBoxValueDetail.push(row[i].id);
      }
    },
    // 清除checkedBox多选操作
    toggleSelection() {
      this.$refs.table.toggleSelection();
    },

    /* 显示扩展字段 */
    showExtentionDom() {
      this.exHeight = this.exHeight === "0px" ? "auto" : "0px";
    },
    /* 扩展字段值 */
    extentionFormVal(val) {
      this.extend = val;
    },
    /* 提交 */
    submitForm(formName) {
      // employeePosts
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = {};
          obj.op = this.op;
          obj.userRoleString = this.tableCheckBoxValueDetail.join(",");
          for (const key in this.extend) {
            obj["extend." + key] = this.extend[key];
          }
          obj.oldLoginCode = this.oldLoginCode;
          obj.loginCode = this.form.loginCode;
          obj.userType = "employee";
          obj.userCode = this.form.userCode;
          obj.corpCode_ = this.form.corpCode_;
          obj.corpName_ = this.form.corpName_;
          obj.userName = this.form.userName;
          obj.email = this.form.email;
          obj.mobile = this.form.mobile;
          obj.phone = this.form.phone;
          obj.userWeight = this.form.userWeight;
          obj.remarks = this.form.remarks;
          roleApi.saveCorpAdmin(obj).then(res => {
            if (res.result === "false") {
              this.$message.warning(res.message);
            } else {
              this.$message.success(res.message);
              this.closeEditDialog();
              this.$emit("initListPage");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 关闭编辑对话框 */
    colseUser() {
      this.closeEditDialog();
    },
    closeEditDialog() {
      this.showEditDailog = false;
      this.$refs["form"].resetFields();
      for (const key in this.extend) {
        this.extend[key] = "";
      }
      for (const key in this.form) {
        this.form[key] = "";
      }
      this.$emit("initListPage");
    },
    inputIt(val) {
      roleApi
        .validLoginCode({
          loginCode: val
        })
        .then(res => {
          if (!res) {
            this.loginCodeHad = true;
            console.log("false");
          } else {
            this.loginCodeHad = false;
          }
          this.$refs.form.validateField("loginCode");
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
