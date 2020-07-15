<template>
  <div class="user-edit-panel">
    <DailogFrame
      :dialog-visible="showEditDailog"
      :title-name="`${titleName}用户`"
      @closeDialog="closeEditDialog"
    >
      <template slot="content">
        <div>
          <ColumnBar :column-text="'基本信息'"></ColumnBar>
          <el-form
            ref="userForm"
            :model="userForm"
            label-width="140px"
            class="demo-ruleForm"
            size="mini"
            :rules="rules"
          >
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="归属机构：" prop="officeName">
                  <el-input
                    v-model="userForm['officeName']"
                    @focus="institutionChoose"
                  >
                    <el-button slot="append" icon="el-icon-search"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="归属公司：" prop="companyName">
                  <el-input
                    v-model="userForm['companyName']"
                    @focus="companyChoose"
                  >
                    <el-button slot="append" icon="el-icon-search"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="登录账号：" prop="loginCode">
                  <el-input v-model="userForm.loginCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户昵称：" prop="userName">
                  <el-input v-model="userForm.userName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="电子邮箱：" prop="email">
                  <el-input v-model="userForm.email">
                    <el-button slot="append" icon="el-icon-message"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号：" prop="mobile">
                  <el-input v-model="userForm.mobile">
                    <el-button
                      slot="append"
                      icon="el-icon-mobile-phone"
                    ></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="办公电话：" prop="phone">
                  <el-input v-model="userForm.phone">
                    <el-button slot="append" icon="el-icon-phone"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="权重（排序）：">
                  <el-input v-model="userForm.userWeight"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <ColumnBar :column-text="'详细信息'"></ColumnBar>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="员工工号：" prop="empNo">
                  <el-input v-model="userForm['empNo']"> </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="员工姓名：" prop="empName">
                  <el-input v-model="userForm['empName']"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="所在岗位：">
                  <el-select
                    v-model="employeePosts"
                    multiple
                    style="width:100%;"
                  >
                    <el-option
                      v-for="item in employeePostsOptions"
                      :key="item.postCode"
                      :label="item.postName"
                      :value="item.postCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="英文名：" prop="empNameEn">
                  <el-input v-model="userForm['empNameEn']"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="附属机构：" prop="englishName">
                  <TableTree
                    :table-head="tableHead"
                    :table-data="employeeOfficeList"
                    :slot-columns="slotColumns"
                    :show-overflow="false"
                    :default-height="50"
                    :show-index="false"
                    :show-page="false"
                  >
                    <template slot="officeName" slot-scope="scope">
                      <el-input
                        v-model="scope.row.officeName"
                        @focus="attchEmployeeChoose(scope.row)"
                      >
                        <el-button
                          slot="append"
                          icon="el-icon-search"
                        ></el-button>
                      </el-input>
                    </template>
                    <template slot="postCode" slot-scope="scope">
                      <el-select
                        v-model="scope.row.postCode"
                        style="width:100%;"
                      >
                        <el-option
                          v-for="item in employeePostsOptions"
                          :key="item.postName"
                          :label="item.postName"
                          :value="item.postCode"
                        />
                      </el-select>
                    </template>

                    <template slot="operate">
                      <el-table-column
                        fixed="right"
                        label="操作"
                        width="100"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <el-button
                            type="text"
                            size="small"
                            @click="deleteAdd(scope.row)"
                          >
                            <i class="el-icon-delete"></i>
                          </el-button>
                        </template>
                      </el-table-column>
                    </template>
                  </TableTree>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-button
                  type="primary"
                  size="mini"
                  class="el-icon-plus"
                  style="margin-left: 140px;"
                  @click="addNew"
                >
                  增行
                </el-button>
              </el-col>
            </el-row>
            <el-col>
              <el-row :span="24" style="margin-top: 20px;" :rows="4">
                <el-form-item label="备注信息：" prop="remarks">
                  <el-input
                    v-model="userForm.remarks"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <AssignRoleDetail
              v-if="titleName === '新增'"
              ref="roleDetail"
              :table-data="roleChooseList"
              @tableCheckBoxVal="getCheckVal"
            ></AssignRoleDetail>
            <!-- @click="showExtentionDetail" -->
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
          <ChooseMenuTree
            :inner-dialog-visible="innerDialogVisible"
            :title-name="menuTreeTitle"
            :menu-data="menuData"
            :key-val="keyVal"
            :default-expand="defaultExpand"
            @closeInnerDialog="closeMuneTreeChoose"
            @on-change-keyVal="changeKeyVal"
            @clickNodeReslut="clickNodeReslut"
          ></ChooseMenuTree>
        </div>
      </template>

      <template slot="footer">
        <div style="text-indent: 100px;">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="submitForm('userForm')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            size="mini"
            @click="colseUser('userForm')"
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
import ChooseMenuTree from "@/components/chooseMenuTree";
import { returnReg } from "@/utils/validate";
import { filterNokeyVal, stringVal } from "@/utils/pubFunc";
import { orgApi } from "@/api/organization";
import { pubApi } from "@/api/public_request";
import AssignRoleDetail from "./assignRoleDetail";
import { getOffceList, getCompanyList } from "@/js/publicData";
export default {
  name: "UserEdit",
  components: {
    DailogFrame,
    ColumnBar,
    TableTree,
    ExtentionFeild,
    ChooseMenuTree,
    AssignRoleDetail
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
    return {
      titleName: "",
      userDetail: {},
      test: [],
      exHeight: "0px",
      showEditDailog: false,
      innerDialogVisible: false,
      menuTreeTitle: "",
      keyVal: "",
      defaultExpand: ["1"],
      menuData: [],
      gutterVal: 100,
      stopOrStart: "",
      officeCodeClick: {},
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
      attchOfficeName: "",
      employeePostsOptions: [],
      employeePosts: [], // cfo 所在岗位
      userRoleString: "", // 新增-分配角色-保存字段
      employeeOfficeList: [], // 附属公司列表
      userForm: {
        op: "", // add  edit
        userType: "employee", // employee
        userCode: "",
        officeName: "", // 归属机构
        officeCode: "", //
        companyName: "", // 归属公司
        companyCode: "", //
        oldLoginCode: "",
        loginCode: "", // 登录账号
        userName: "", // 用户昵称
        email: "", //
        mobile: "", //
        phone: "", // 办公电话
        userWeight: "", // 权重
        empNo: "", // 员工编号
        empName: "", // 员工姓名
        empNameEn: "", // 英文名
        remarks: "" //
      },
      rules: {
        officeName: [
          { required: true, message: "请选择归属机构", trigger: "change" },
          {
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        loginCode: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          { min: 4, max: 20, message: "长度在 4 到 20 个字符", trigger: "blur" }
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
        phone: [{ validator: validTelNumber, trigger: "change" }],
        userWeight: [{ message: "请填入权重", trigger: "blur" }]
      },
      slotColumns: ["officeName", "postCode"],
      tableHead: {
        officeName: "附属机构",
        postCode: "附属岗位"
      },
      addCountIndex: 0,
      roleChooseList: [],
      offceList: [],
      companyList: [],
      nodeData: {}
    };
  },
  mounted() {
    getOffceList().then(res => {
      this.offceList = res;
      console.log(404, res);
    });

    getCompanyList().then(res => {
      this.companyList = res;
    });
  },
  methods: {
    /* 获取编辑详情 */
    /* 显示对话框 */
    show(row, type) {
      this.titleName = type;
      if (type === "新增") {
        this.userForm.op = "add";
        this.userForm.userType = "employee";
        this.userForm.userCode = "";
        pubApi.getEmployeePosts().then(res => {
          for (let i = 0, len = res.length; i < len; i++) {
            res[i].postName = res[i].name;
            res[i].postCode = res[i].id;
          }
          this.employeePostsOptions = res;
          this.showEditDailog = true;
        });
        /* 新增 分配角色 */
        pubApi.getRoleMenuTree().then(res => {
          this.roleChooseList = res;
        });
      } else {
        this.userForm.op = "edit";
        this.userForm.userType = "employee";
        const obj = {
          userCode: row.userCode,
          op: this.userForm.op
          // _layer: true
        };
        orgApi.getUserDetail(obj).then(res => {
          this.userForm.userCode = res.empUser.userCode;
          this.userForm.officeName = res.empUser.employee.office.officeName;
          this.userForm.officeCode = res.empUser.employee.office.officeCode;
          this.userForm.companyName = res.empUser.employee.company.companyName;
          this.userForm.companyCode = res.empUser.employee.company.companyCode;
          this.userForm.oldLoginCode = res.empUser.loginCode;
          this.userForm.loginCode = res.empUser.loginCode;

          this.userForm.userName = res.empUser.userName;
          this.userForm.email = res.empUser.email;
          this.userForm.mobile = res.empUser.mobile;
          this.userForm.phone = res.empUser.phone;
          this.userForm.userWeight = res.empUser.userWeight;
          this.userForm.empNo = res.empUser.employee.empNo;
          this.userForm.empName = res.empUser.employee.empName;
          this.userForm.empNameEn = res.empUser.employee.empNameEn;
          this.employeePostsOptions = res.postList; //  所在岗位选择
          this.employeePosts = res.empUser.employee.employeePosts; //  所在岗位回显
          this.userForm.remarks = res.empUser.remarks;
          this.employeeOfficeList = res.empUser.employee.employeeOfficeList;
          for (const key in res.empUser.extend) {
            this.extend[key] = res.empUser.extend[key];
          }
          this.showEditDailog = true;
        });
      }
    },
    /* 触发选择归属机构 */
    institutionChoose(typeText) {
      this.menuTreeTitle = "机构选择";
      this.getOfficeMenuTree();
    },
    /*  触发选择附属公司选择*/
    attchEmployeeChoose(row) {
      this.getOfficeMenuTree();
      this.menuTreeTitle = "附属机构选择";
      this.attchCurrentRow = row;
      // 选择之后值的归属问题
    },
    /* 获取归属机构列表 */
    getOfficeMenuTree() {
      // console.log(473, this.offceList);
      this.menuData = this.offceList;
      this.innerDialogVisible = true;
    },
    /*  触发选择归属公司*/
    companyChoose() {
      this.menuTreeTitle = "归属公司选择";
      this.menuData = this.companyList;
      this.innerDialogVisible = true;
    },

    /* changeKeyVal */
    changeKeyVal(val) {
      // console.log(379, val);
      this.keyVal = val;
    },
    /* 单击只选择节点  双击选择节点 并关闭弹窗 菜单树中当前点击的树节点*/
    clickNodeReslut(data) {
      this.nodeData = data.data;
      if (data.type === "dbclick") {
        this.nodeEvents(data.data);
      }
    },
    /* 关闭选择归属机构或者归属公司 */
    closeMuneTreeChoose(val) {
      if (val === "sure") {
        this.nodeEvents(this.nodeData);
      }
      this.innerDialogVisible = false;
    },
    /* 根据树节点单双击确定触发事件 */
    nodeEvents(data) {
      // console.log(506, data);
      if (this.menuTreeTitle === "机构选择") {
        this.userForm.officeName = data.label;
        this.userForm.officeCode = data.id;
        this.officeCodeClick = data;
      } else if (this.menuTreeTitle === "附属机构选择") {
        for (let i = 0, len = this.employeeOfficeList.length; i < len; i++) {
          if (
            this.attchCurrentRow.flagId === this.employeeOfficeList[i].flagId
          ) {
            this.employeeOfficeList[i].officeName = data.label;
            this.employeeOfficeList[i].officeCode = data.id;
            this.innerDialogVisible = false;
            return;
          }
        }
      } else {
        this.userForm.companyName = data.data.label;
        this.userForm.companyCode = data.data.id;
      }
      this.keyVal = "";
      this.innerDialogVisible = false;
    },
    /* 新增 */
    addNew() {
      const obj = {
        officeName: "",
        postCode: "",
        officeCode: "",
        flagId: this.addCountIndex
      };
      this.employeeOfficeList.push(obj);
      this.addCountIndex++;
    },
    /* 删除新增 */
    deleteAdd(row) {
      for (let i = 0, len = this.employeeOfficeList.length; i < len; i++) {
        console.log(542, row);
        if (row.flagId === this.employeeOfficeList[i].flagId) {
          this.employeeOfficeList.splice(i, 1);
          return;
        }
      }
    },
    /* 显示扩展字段 */
    showExtentionDom() {
      this.exHeight = this.exHeight === "0px" ? "auto" : "0px";
    },
    /* 扩展字段值 */
    extentionFormVal(val) {
      this.extend = val;
    },
    /* 获取角色checkbox  userRoleString 需要字符串格式*/
    getCheckVal(checkboxVal) {
      // this.employeePosts = checkboxVal;
      this.userRoleString = stringVal(checkboxVal, "id");
      // console.log(12345, this.employeePosts);
    },
    /* 提交 */
    submitForm(formName) {
      // employeePosts
      // console.log(9990, this.officeCodeClick);
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = {};
          if (this.userRoleString) {
            obj.userRoleString = this.userRoleString;
          }
          obj.extend = this.extend; // :filterNokeyVal();
          obj.op = this.userForm.op;
          obj.userType = this.userForm.userType;
          obj.userCode = this.userForm.userCode;
          obj.oldLoginCode = this.userForm.oldLoginCode;
          obj.loginCode = this.userForm.loginCode;
          obj.userName = this.userForm.userName;
          obj.email = this.userForm.email;
          obj.mobile = this.userForm.mobile;
          obj.phone = this.userForm.phone;
          obj.userWeight = this.userForm.userWeight;
          obj.remarks = this.userForm.remarks;
          obj.employee = {
            office: {
              officeCode: this.userForm.officeCode || "",
              officeName: this.userForm.officeName || ""
            },
            company: {
              companyName: this.userForm.companyName || "",
              companyCode: this.userForm.companyCode || ""
            },
            empNo: this.userForm.empNo || "",
            empName: this.userForm.empName || "",
            employeePosts: this.employeePosts || [],
            empNameEn: this.userForm.empNameEn || "",
            employeeOfficeList: this.employeeOfficeList || []
          };
          orgApi.addNewUser(obj).then(res => {
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
      this.$refs["userForm"].resetFields();
      this.attchCurrentRow = {};
      this.attchOfficeName = "";
      this.employeePosts = [];
      this.employeeOfficeList = [];
      for (const key in this.extend) {
        this.extend[key] = "";
      }
      for (const key in this.userForm) {
        this.userForm[key] = "";
      }
      this.$emit("initListPage");
      // this.$refs.roleDetail.toggleSelection();
    }
  }
};
</script>
<style lang="scss" scoped>
.user-edit-panel {
}
</style>
