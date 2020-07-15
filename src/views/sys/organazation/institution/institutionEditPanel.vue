<template>
  <div class="user-edit-panel">
    <DailogFrame
      :dialog-visible="showEditDailog"
      :title-name="titleType"
      @closeDialog="closeEditDialog"
    >
      <template slot="content">
        <div>
          <ColumnBar :column-text="'基本信息'"></ColumnBar>
          <el-form
            ref="institutionForm"
            :model="institutionForm"
            label-width="100px"
            class="demo-ruleForm"
            size="mini"
            :rules="rules"
          >
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="上级机构：" prop="parent.officeName">
                  <el-input
                    v-model="institutionForm.parent.officeName"
                    @focus="institutionChoose"
                  >
                    <el-button slot="append" icon="el-icon-search"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="机构名称：" prop="officeName">
                  <el-input v-model="institutionForm.officeName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机构代码：" prop="viewCode">
                  <el-input v-model="institutionForm.viewCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="机构全称：" prop="fullName">
                  <el-input v-model="institutionForm.fullName"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序号：" prop="treeSort">
                  <el-input v-model="institutionForm.treeSort"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="机构类型：" prop="officeType">
                  <el-select
                    v-model="institutionForm.officeType"
                    style="width:100%;"
                  >
                    <el-option
                      v-for="item in officeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <ColumnBar :column-text="'详细信息'"></ColumnBar>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="负责人：" prop="leader">
                  <el-input v-model="institutionForm.leader"> </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="办公电话：" prop="phone">
                  <el-input v-model="institutionForm.phone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="联系地址：" prop="address">
                  <el-input v-model="institutionForm.address"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮政编码：" prop="zipCode">
                  <el-input v-model="institutionForm.zipCode"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutterVal">
              <el-col :span="12">
                <el-form-item label="电子邮箱：" prop="email">
                  <el-input v-model="institutionForm.email"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col>
              <el-row :span="24" style="margin-top: 20px;" :rows="4">
                <el-form-item label="备注信息：" prop="remarks">
                  <el-input
                    v-model="institutionForm.remarks"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <ColumnBar
              :column-text="'扩展字段'"
              :icon-tips="true"
              @showExtentionDetail="showExtentionDom"
            ></ColumnBar>
            <ExtentionFeild
              ref="extentionDom"
              :style="{ height: exHeight }"
              style="overflow: hidden;"
              :extention-form="institutionForm.extend"
              @extentionFormVal="extentionFormVal"
            ></ExtentionFeild>
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
            @click="submitForm('institutionForm')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            size="mini"
            @click="colseOffice('institutionForm')"
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
import ExtentionFeild from "@/components/extentionFeild";
import ChooseMenuTree from "@/components/chooseMenuTree";
import { returnReg } from "@/utils/validate";
import { orgApi } from "../../../../api/organization";
import { pubApi } from "@/api/public_request";
import { toTreeData } from "@/utils/pubFunc";
export default {
  name: "UserEdit",
  components: {
    DailogFrame,
    ColumnBar,
    ExtentionFeild,
    ChooseMenuTree
  },
  props: {
    officeOptions: {
      type: Array,
      default: () => {
        [];
      }
    }
  },
  data() {
    const treeSortValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("必填信息"));
      } else if (!returnReg("positiveInteger").test(value)) {
        callback(new Error("请输入一个正整数!"));
      } else {
        callback();
      }
    };
    const phoneValidator = (rule, value, callback) => {
      console.log(124, value);
      if (value && !returnReg("mobile").test(value)) {
        callback(
          new Error(
            "sdsd 请正确填写您的电话号码，固话为区号(3-4位)号码(7-9位),手机为13,14,15,16,17,18,19号段"
          )
        );
      } else if (value && !returnReg("phone").test(value)) {
        callback(
          new Error(
            "sdsd 请正确填写您的电话号码，固话为区号(3-4位)号码(7-9位),手机为13,14,15,16,17,18,19号段"
          )
        );
      } else {
        callback();
      }
    };
    return {
      titleType: "",
      exHeight: "0px",
      showEditDailog: false,
      innerDialogVisible: false,
      menuTreeTitle: "",
      keyVal: "",
      defaultExpand: ["1"],
      menuData: [],
      gutterVal: 100,
      institutionForm: {
        parent: {
          id: "id", // 上级机构
          officeName: ""
        },
        officeName: "", // 机构名称
        fullName: "", // 机构全称
        treeSort: "", // 排序号  字母 数字  下划线
        officeType: "", // 机构类型
        viewCode: "", // 机构代码
        leader: "", // 负责人
        phone: "", // 办公电话
        address: "", // 联系地址
        zipCode: "", // 邮政编码
        email: "", // 电子邮箱
        remarks: "", // 备注信息
        officeCode: "",
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
        }
      },
      rules: {
        // "parent.officeName": [
        //   { required: true, message: "必填信息", trigger: "change" },
        // ],
        viewCode: [{ required: true, message: "必填信息", trigger: "blur" }],
        officeName: [{ required: true, message: "必填信息", trigger: "blur" }],
        officeType: [{ required: true, message: "请选择", trigger: "change" }],
        fullName: [{ required: true, message: "必填信息", trigger: "blur" }],
        treeSort: [
          { required: true, validator: treeSortValidator, trigger: "blur" }
        ],
        email: [
          {
            pattern: returnReg("email"),
            message: "请输入正确的邮箱",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: false,
            validator: phoneValidator,
            trigger: "change"
          }
        ],

        weight: [{ message: "请选择活动资源", trigger: "change" }],
        desc: [{ message: "请填写活动形式", trigger: "blur" }]
      },
      officeSource: [],
      nodeData: {}
    };
  },
  created() {
    this.getOfficeMenuTree();
  },
  methods: {
    /* 显示对话框 */
    show(row, type) {
      // 编辑机构  新增下级机构  新增机构
      this.titleType = type;
      if (type === "新增机构") {
        this.showEditDailog = true;
      }
      if (type === "编辑机构" || type === "新增下级机构") {
        /* 获取机构详情 */
        orgApi
          .getOfficeDetail({
            officeCode: row.officeCode
          })
          .then(res => {
            // console.log(321, res);
            const result = JSON.parse(JSON.stringify(res.office));
            for (const key in res.office.extend) {
              result.extend[key] = res.office.extend[key];
            }
            if (res.office.parentCode) {
              const officeSource = this.officeSource.filter(item => {
                return item.id === res.office.parentCode;
              });
              result.parent = {
                id: officeSource[0].id,
                officeName: officeSource[0].name
              };
            } else {
              result.parent = {
                id: "",
                officeName: ""
              };
            }

            this.institutionForm = result;
            this.showEditDailog = true;
          });
      }
    },
    getOfficeMenuTree() {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      pubApi.getOfficeMenuTree().then(res => {
        this.officeSource = JSON.parse(JSON.stringify(res));
        this.menuData = toTreeData(res, attributes);
      });
    },
    /* 关闭编辑对话框 */
    closeEditDialog() {
      this.colseOffice("institutionForm");
      this.showEditDailog = false;
    },
    /* 触发选择上级机构 */
    institutionChoose() {
      this.innerDialogVisible = true;
    },

    /* changeKeyVal */
    changeKeyVal(val) {
      // console.log(379, val);
      this.keyVal = val;
    },
    /* 菜单树中当前点击的树节点*/
    clickNodeReslut(data) {
      this.nodeData = data.data;
      if (data.type === "dbclick") {
        this.nodeEvents(data.data);
      }
    },
    /* 根据树节点单双击确定触发事件 */
    nodeEvents(data) {
      // console.log(378, data);
      this.institutionForm.parent.id = data.id;
      this.institutionForm.parent.officeName = data.label;
      this.keyVal = "";
      this.innerDialogVisible = false;
    },
    /* 关闭上级机构选择 */
    closeMuneTreeChoose(val) {
      if (val === "sure") {
        this.nodeEvents(this.nodeData);
      }
      this.innerDialogVisible = false;
    },
    /* 新增 */
    addNew() {
      const obj = {
        affiation: "",
        jobs: "",
        id: this.addCountIndex
      };
      this.institutionForm.tableData.push(obj);
      this.addCountIndex++;
      // console.log(this.institutionForm.tableData);
    },
    /* 显示扩展字段 */
    showExtentionDom() {
      this.exHeight = this.exHeight === "0px" ? "480px" : "0px";
    },
    /* 扩展字段值 */
    extentionFormVal(val) {
      this.institutionForm.extend = val;
    },
    /* 提交 */
    submitForm(formName) {
      // console.log(1, formName, this.$refs[formName]);
      this.$refs[formName].validate(valid => {
        // console.log(2);
        if (valid) {
          // console.log(3);
          if (this.titleType === "新增机构") {
            this.institutionForm.isNewRecord = true;
          } else {
            this.institutionForm.isNewRecord = false;
          }
          orgApi.saveOfficeAdd(this.institutionForm).then(res => {
            if (res.result === "true") {
              this.$message.success(res.message);
              this.$emit("initPage", {
                status: "",
                ctrlPermi: 2
              });
              this.showEditDailog = false;
            } else {
              this.$message.warning(res.message);
            }
            this.colseOffice("institutionForm");
          });
        } else {
          // console.log(4);
          console.log("error submit!!");
          return false;
        }
      });
    },
    colseOffice(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields(); // 清空表单
        this.showEditDailog = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.user-edit-panel {
}
</style>
