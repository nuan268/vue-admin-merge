/*新增/编辑字典数据*/
<template>
  <div>
    <DailogPanel
      :dialog-visible="showDailog"
      :title-name="titleName"
      :append-to-body="true"
      @closeDialog="closeDialog"
    >
      <template slot="content">
        <ColumnBar :column-text="'基本信息'"></ColumnBar>
        <el-form
          ref="areaForm"
          :model="areaForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
          :rules="areaFormRules"
        >
          <DymForm
            :edit-model="editModel"
            :component-list="componentList"
            :form-value.sync="areaForm"
            @focusIt="focusIt"
          >
          </DymForm>
        </el-form>
        <ChooseMenuTree
          ref="chooseMenuTree"
          :inner-dialog-visible="innerDialogVisible"
          :title-name="menuTreeTitle"
          :menu-data="menuData"
          :key-val="keyVal"
          :parent-node="true"
          :show-checkbox="showCheckbox"
          :expand-all="false"
          @closeInnerDialog="closeMuneTreeChoose"
          @on-change-keyVal="changeKeyVal"
          @clickNodeReslut="clickNodeReslut"
        ></ChooseMenuTree>
      </template>
      <template slot="footer">
        <el-button size="mini" type="primary" @click="saveBtn('areaForm')">
          保存
        </el-button>
        <el-button size="mini" @click="colseBtn">关闭</el-button>
      </template>
    </DailogPanel>
  </div>
</template>
<script>
import DymForm from "@/components/element/dymForm";
import DailogPanel from "@/components/dailogPanel/frame";
import ColumnBar from "@/components/commonColumn";
import ChooseMenuTree from "@/components/chooseMenuTree";
import { sysApi } from "@/api/systemSet";
// import { returnReg } from "@/utils/validate";
import { toTreeData } from "@/utils/pubFunc";
export default {
  name: "",
  components: {
    DailogPanel,
    DymForm,
    ColumnBar,
    ChooseMenuTree
  },
  data() {
    return {
      showDailog: false,
      titleName: "编辑区域",
      editModel: "E",
      areaForm: {
        superAreaName: "",
        parent: {
          id: "",
          areaName: ""
        },
        areaName: "",
        areaCode: "",
        areaType: "",
        treeSort: "",
        remarks: "",
        isNewRecord: false
      },
      componentList: [
        {
          label: "上级区域：",
          prop: "superAreaName",
          componentName: "el-input",
          labelWidth: "120px",
          cols: [24, 24, 24, 24],
          value: "superAreaName",
          width: "50%",
          addIcon: true,
          slotPosition: "append",
          iconType: "el-icon-search"
        },
        {
          label: "区域代码：",
          prop: "areaCode",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [24, 24, 24, 24],
          value: "areaCode",
          width: "50%",
          disabled: false
        },
        {
          label: "区域名称：",
          prop: "areaName",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [24, 24, 24, 24],
          value: "areaName",
          width: "50%"
        },
        {
          label: "区域类型：",
          prop: "areaType",
          labelWidth: "120px",
          componentName: "RadioChoose",
          cols: [24, 24, 24, 24],
          value: "areaType",
          width: "50%",
          radios: this.getMenuType("sys_area_type")
        },
        {
          label: "排序号：",
          prop: "treeSort",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [24, 24, 24, 24],
          value: "treeSort",
          width: "50%"
        },
        {
          label: "备注信息：",
          prop: "remarks",
          labelWidth: "120px",
          componentName: "el-input",
          type: "textarea",
          rowsSpan: 4,
          cols: [24, 24, 24, 24],
          value: "remarks"
        }
      ],
      currentRow: {},
      innerDialogVisible: false,
      showCheckbox: false,
      menuTreeTitle: "上级区域",
      keyVal: "",
      menuData: [],
      nodeData: {},
      areaFormRules: {
        areaCode: [{ required: true, message: "必填信息", trigger: "blur" }],
        areaName: [{ required: true, message: "必填信息", trigger: "blur" }],
        areaType: [{ required: true, message: "必填信息", trigger: "blur" }],
        treeSort: [{ required: true, message: "必填信息", trigger: "blur" }]
      }
    };
  },
  methods: {
    show(row, type) {
      //  areaCode=120000  parentCode=110000
      // console.log("319", type, row);
      this.componentList[1].disabled = false;
      this.areaForm.isNewRecord = true;
      this.currentRow = row;
      if (type === "新增") {
        this.initAreaEdit(type, "", {});
      }
      if (type === "新增下级") {
        this.initAreaEdit(type, `parentCode=${row.id}`, row);
      }
      if (type === "编辑") {
        this.areaForm.isNewRecord = false;
        this.componentList[1].disabled = true;
        this.initAreaEdit(type, `areaCode=${row.areaCode}`, row);
      }
    },
    /* 获取初始化页面数据 */
    initAreaEdit(type, param, row) {
      sysApi.initAreaEdit(param).then(res => {
        if (type === "编辑") {
          const tempParentAreaName = res.area.treeNames.split("/");
          this.areaForm.superAreaName =
            tempParentAreaName[tempParentAreaName.length - 2];
          this.areaForm.parent.areaName = this.areaForm.superAreaName;
        }
        if (type === "新增下级") {
          this.areaForm.parent.id = row.id;
          this.areaForm.parent.areaName = row.areaName;
          this.areaForm.superAreaName = row.areaName;
        }
        this.areaForm.areaCode = res.area.areaCode || "";
        this.areaForm.parent.id = res.area.parentCode;

        this.areaForm.areaName = res.area.areaName || "";
        this.areaForm.areaType = res.area.areaType || "";
        this.areaForm.treeSort = res.area.treeSort || "";
        this.areaForm.remarks = res.area.remarks || "";
        this.showDailog = true;
      });
    },
    saveBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = this.areaForm;
          obj["parent.id"] = this.areaForm.parent.id;
          obj["parent.areaName"] = this.areaForm.parent.areaName || "";
          sysApi.saveArea(obj).then(res => {
            if (res.result === "false") {
              this.$message.warning(res.message);
            } else {
              this.$message.success(res.message);
              this.closeDialog();
              this.$emit("initPage");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 列表文本转义 */
    getMenuType(type) {
      const selectTypeData = JSON.parse(
        sessionStorage.getItem("selectDicType")
      );
      return selectTypeData[type];
    },
    focusIt(keyName) {
      this.innerDialogVisible = false;
      this.$nextTick(() => {
        if (keyName === "superAreaName") {
          this.getAreaMenuTree();
        }
      });
    },
    getAreaMenuTree() {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      sysApi
        .getAreaMenuTree({ areaCode: this.currentRow.areaCode })
        .then(res => {
          this.innerDialogVisible = true;
          this.menuData = toTreeData(res, attributes);
          // this.companyListOrg = toTreeData(res, attributes);
        });
    },
    /* 菜单树中当前点击的树节点*/
    clickNodeReslut(data) {
      this.nodeData = data.data;
      if (data.type === "dbclick") {
        this.nodeEvents(data.data);
      }
    },
    /* changeKeyVal */
    changeKeyVal(val) {
      this.keyVal = val;
    },
    /* 关闭上级区域 */
    closeMuneTreeChoose(val) {
      if (val === "sure") {
        this.nodeEvents(this.nodeData);
      }
      this.innerDialogVisible = false;
    },
    nodeEvents(data) {
      // console.log(333344, data);
      this.areaForm.superAreaName = data.label;
      this.areaForm.parent.id = data.id;
      this.areaForm.parent.areaName = data.label;
      this.innerDialogVisible = false;
      this.keyVal = "";
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
      this.$refs["areaForm"].resetFields();
      // this.areaForm.areaName = "";
      // this.areaForm.areaType = "";
      // this.areaForm.areaCode = "";
    }
  }
};
</script>
<style lang="scss" scoped></style>
