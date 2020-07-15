<template>
  <div class="company-edit-panel">
    <DailogFrame
      :dialog-visible="showEditDailog"
      :title-name="titleType"
      @closeDialog="closeEditDialog"
    >
      <template slot="content">
        <el-form
          ref="companyForm"
          :model="companyForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
          :rules="companyFormRules"
        >
          <DymForm
            :edit-model="editModel"
            :component-list="componentList"
            :form-value.sync="companyForm"
            @focusIt="focusIt"
            @showExtentionDom="showExtentionDom"
          >
          </DymForm>
          <ExtentionFeild
            ref="extentionDom"
            :style="{ height: exHeight }"
            style="overflow: hidden;"
            :extention-form="extend"
          ></ExtentionFeild>
        </el-form>
        <ChooseMenuTree
          ref="chooseMenuTree"
          :inner-dialog-visible="innerDialogVisible"
          :title-name="menuTreeTitle"
          :menu-data="menuData"
          :key-val="keyVal"
          :default-expand="defaultExpand"
          :parent-node="true"
          :show-checkbox="showCheckbox"
          :checked-memu="checkedMemu"
          @closeInnerDialog="closeMuneTreeChoose"
          @on-change-keyVal="changeKeyVal"
          @clickNodeReslut="clickNodeReslut"
          @passCheckedNode="passCheckedNode"
        ></ChooseMenuTree>
      </template>
      <template slot="footer">
        <div style="text-indent: 100px;">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="submitForm('companyForm')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            size="mini"
            @click="colseOffice('companyForm')"
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
import DymForm from "@/components/element/dymForm";
import ChooseMenuTree from "@/components/chooseMenuTree";
import ExtentionFeild from "@/components/extentionFeild";
import { returnReg } from "@/utils/validate";
import { orgApi } from "../../../../api/organization";
import { pubApi } from "@/api/public_request";
import { toTreeData } from "@/utils/pubFunc";
export default {
  name: "UserEdit",
  components: {
    DailogFrame,
    DymForm,
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
    return {
      showEditDailog: false,
      innerDialogVisible: false,
      menuTreeTitle: "上级公司",
      menuData: [],
      keyVal: "",
      defaultExpand: [], // "1"
      showCheckbox: false,
      checkedMemu: [],
      editModel: "E",
      companyForm: {
        superCompanyName: "",
        isNewRecord: false,
        // 必填 名称 编码 全称 排序号
        parent: {
          id: "id", // 上级机构
          companyName: ""
        },
        companyOfficeListJson: "",
        companyOfficeListJsonId: [],
        areaName: "",
        area: {
          areaName: "",
          areaCode: ""
        },
        viewCode: "",
        companyName: "",
        fullName: "",
        treeSort: "",
        updateDate: "",
        remarks: ""
      },
      componentList: [
        {
          label: "上级公司：",
          prop: "superCompanyName",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "superCompanyName",
          addIcon: true,
          slotPosition: "append",
          iconType: "el-icon-search"
        },
        {
          label: "",
          prop: "",
          labelWidth: "90px",
          componentName: "",
          cols: [12, 12, 12, 12],
          placeholder: "",
          value: "",
          height: "28px"
        },
        {
          label: "公司名称：",
          prop: "companyName",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "companyName"
        },
        {
          label: "公司编码：",
          prop: "viewCode",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "viewCode"
        },
        {
          label: "公司全称：",
          prop: "fullName",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "fullName"
        },
        {
          label: "排序号：",
          prop: "treeSort",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "treeSort"
        },
        {
          label: "归属区域：",
          prop: "areaName",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "areaName",
          addIcon: true,
          slotPosition: "append",
          iconType: "el-icon-search"
        },
        {
          label: "包含机构：",
          prop: "companyOfficeListJson", // companyOfficeListJson
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "companyOfficeListJson",
          addIcon: true,
          slotPosition: "append",
          iconType: "el-icon-search"
        },
        {
          label: "备注信息：",
          prop: "remarks",
          componentName: "el-input",
          type: "textarea",
          cols: [24, 24, 24, 24],
          placeholder: "请输入",
          labelWidth: "90px",
          rowsSpan: 4,
          value: "remarks"
        },
        {
          label: "扩展字段", // 授权功能菜单
          lineTips: true,
          cols: [24, 24, 24, 24],
          showFlag: false,
          iconTips: true
        }
      ],
      titleType: "",
      exHeight: "0px",
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
      companyFormRules: {
        companyName: [{ required: true, message: "必填信息", trigger: "blur" }],
        include: [{ required: true, message: "必填信息", trigger: "blur" }],
        fullName: [{ required: true, message: "必填信息", trigger: "blur" }],
        viewCode: [{ required: true, message: "必填信息", trigger: "blur" }],
        treeSort: [
          { required: true, validator: treeSortValidator, trigger: "blur" }
        ]
      },
      chooseTypePanel: "",
      companyListOrg: [],
      nodeData: {}
    };
  },
  created() {
    this.getCompanyMenuTree();
  },
  mounted() {},
  methods: {
    /* 显示对话框  编辑机构  新增下级机构  新增机构*/
    show(row, type) {
      // console.log(285, row);
      this.showEditDailog = true;
      this.titleType = type;
      if (type === "新增公司") {
        orgApi.addInit().then(res => {
          this.companyForm.viewCode = res.company.viewCode;
          this.companyForm.treeSort = res.company.treeSort;
        });
      }
      if (type === "新增下级公司") {
        orgApi
          .addEditInit({
            key: "parentCode",
            val: row.companyCode
          })
          .then(res => {
            for (let i = 0, len = this.companyListOrg.length; i < len; i++) {
              if (this.companyListOrg[i].id === res.company.parentCode) {
                this.companyForm.superCompanyName = this.companyListOrg[i].name;
              }
            }
            // this.companyForm.superCompanyName = res.company.parentCode;
            this.companyForm.viewCode = res.company.viewCode;
            this.companyForm.treeSort = res.company.treeSort;
            this.companyForm.parent.companyName = row.companyName;
            this.companyForm.parent.id = row.id;
          });
      }
      if (type === "编辑公司") {
        // console.log(321, row);
        /* 获取机构详情 */
        orgApi
          .addEditInit({
            key: "companyCode",
            val: row.companyCode
          })
          .then(res => {
            // console.log(321, result); officeList officeName officeCode  extend
            const includName = [];
            const includCode = [];
            for (let i = 0, len = this.companyListOrg.length; i < len; i++) {
              if (this.companyListOrg[i].id === res.company.parentCode) {
                this.companyForm.superCompanyName = this.companyListOrg[i].name;
              }
            }
            for (const key in row.extend) {
              if (row.extend[key]) {
                this.extend[key] = row.extend[key];
              }
            }
            for (let i = 0, len = res.officeList.length; i < len; i++) {
              includName.push(res.officeList[i].officeName);
              includCode.push(res.officeList[i].officeCode);
            }
            const tempParentCompanyName = row.treeNames.split("/");
            this.companyForm.parent.id = row.parentCode;
            this.companyForm.parent.companyName =
              tempParentCompanyName[tempParentCompanyName.length - 2] || "";
            this.companyForm.superCompanyName =
              tempParentCompanyName[tempParentCompanyName.length - 2] || "";
            this.companyForm.viewCode = row.viewCode;
            this.companyForm.companyName = row.companyName;
            this.companyForm.companyCode = row.companyCode;
            this.companyForm.fullName = row.fullName;
            this.companyForm.treeSort = row.treeSort;
            this.companyForm.areaName = row.area.treeNames;
            this.companyForm.area.areaName = row.area.areaName;
            this.companyForm.area.areaCode = row.area.areaCode;
            this.companyForm.companyOfficeListJson = includName.join(",");
            this.companyForm.companyOfficeListJsonId = includCode;
            this.checkedMemu = includCode;
            this.companyForm.remarks = row.remarks;
            // console.log(includCode)
            // this.$refs.chooseMenuTree.setDefaultChecked(includCode);
          });
      }
    },
    focusIt(keyName) {
      this.chooseTypePanel = keyName;
      this.innerDialogVisible = false;
      this.$nextTick(() => {
        if (keyName === "superCompanyName") {
          this.menuTreeTitle = "上级公司";
          this.showCheckbox = false;
          this.getCompanyMenuTree();
        } else if (keyName === "areaName") {
          this.menuTreeTitle = "区域选择";
          this.showCheckbox = false;
          this.getAreaMenuTree();
        } else if (keyName === "companyOfficeListJson") {
          this.menuTreeTitle = "机构选择";
          this.showCheckbox = true;
          this.getOfficeMenuTree();
          this.$refs.chooseMenuTree.setDefaultChecked(
            this.companyForm.companyOfficeListJsonId
          );
          // this.innerDialogVisible = true;
        }
      });
    },
    getCompanyMenuTree() {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      pubApi.getCompanyMenuTree().then(res => {
        this.innerDialogVisible = true;
        this.menuData = toTreeData(res, attributes);
        this.companyListOrg = toTreeData(res, attributes);
      });
    },
    getAreaMenuTree() {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      pubApi.getAreaMenuTree().then(res => {
        this.menuData = toTreeData(res, attributes);
        this.innerDialogVisible = true;
      });
    },
    getOfficeMenuTree() {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      pubApi.getOfficeMenuTree({ ctrlPermi: 2, excludeCode: "" }).then(res => {
        this.menuData = toTreeData(res, attributes);
        this.innerDialogVisible = true;
      });
    },
    /* 复选框中的值 */
    passCheckedNode(val) {
      const idArr = [];
      const labelArr = [];
      if (val.length > 0) {
        for (let i = 0, len = val.length; i < len; i++) {
          if (val[i].children.length === 0) {
            idArr.push(val[i].id);
            labelArr.push(val[i].label);
          }
        }
      }
      this.companyForm.companyOfficeListJson = labelArr.join(",");
      this.companyForm.companyOfficeListJsonId = idArr;
      console.log("复选框中的值", val);
    },
    /* 菜单树中当前点击的树节点*/
    clickNodeReslut(data) {
      this.nodeData = data.data;
      if (data.type === "dbclick") {
        this.nodeEvents(data.data);
      }
    },
    /* 关闭编辑对话框 */
    closeEditDialog() {
      this.colseOffice("companyForm");
      this.showEditDailog = false;
    },
    /* 关闭上级机构选择 */
    closeMuneTreeChoose(val) {
      if (val === "sure") {
        this.nodeEvents(this.nodeData);
      }
      this.innerDialogVisible = false;
    },
    nodeEvents(data) {
      // console.log(333344, data);
      if (this.chooseTypePanel === "superCompanyName") {
        this.companyForm.superCompanyName = data.label;
        this.companyForm.parent.id = data.id;
        this.companyForm.parent.companyName = data.label;
      } else if (this.chooseTypePanel === "areaName") {
        this.companyForm.areaName = data.parent;
        this.companyForm.area.areaName = data.parent;
        this.companyForm.area.areaCode = data.id;
      } else if (this.chooseTypePanel === "includeOffice") {
        this.companyForm.area.areaCode = data.id;
      }
      this.innerDialogVisible = false;
      this.keyVal = "";
    },
    /* changeKeyVal */
    changeKeyVal(val) {
      this.keyVal = val;
    },
    /* 显示扩展字段 */
    showExtentionDom() {
      this.exHeight = this.exHeight === "0px" ? "480px" : "0px";
    },

    /* 提交 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = {};
          obj.companyName = this.companyForm.companyName;
          obj["parent.companyName"] = this.companyForm.parent.companyName;
          obj["parent.id"] = this.companyForm.parent.id;
          obj["area.areaName"] = this.companyForm.area.areaName || "";
          obj["area.areaCode"] = this.companyForm.area.areaCode;
          obj.viewCode = this.companyForm.viewCode;
          obj.fullName = this.companyForm.fullName;
          obj.treeSort = this.companyForm.treeSort;
          obj.remarks = this.companyForm.remarks;
          obj.companyOfficeListJson = JSON.stringify(
            this.companyForm.companyOfficeListJsonId
          );
          for (const key in this.extend) {
            obj["extend." + key] = this.extend[key];
          }
          if (this.titleType === "新增公司") {
            obj.isNewRecord = true;
          } else {
            obj.isNewRecord = false;
            obj.companyCode = this.companyForm.companyCode;
          }
          orgApi.addCompany(obj).then(res => {
            if (res.result === "true") {
              this.$message.success(res.message);
              this.$emit("initPage", {
                status: "",
                ctrlPermi: 2
              });
              this.colseOffice("companyForm");
            } else {
              this.$message.warning(res.message);
              this.colseOffice("companyForm");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    colseOffice(formName) {
      this.$refs[formName].resetFields(); // 清空表单
      this.showEditDailog = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.company-edit-panel {
}
</style>
