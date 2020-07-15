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
          ref="dictTypeForm"
          :model="dictTypeForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
          :rules="dictTypeFormRules"
        >
          <DymForm
            :edit-model="editModel"
            :component-list="componentList"
            :form-value.sync="dictTypeForm"
          >
          </DymForm>
        </el-form>
      </template>
      <template slot="footer">
        <el-button size="mini" type="primary" @click="saveBtn('dictTypeForm')">
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
import { sysApi } from "@/api/systemSet";
import { returnReg } from "@/utils/validate";

export default {
  name: "",
  components: {
    DailogPanel,
    DymForm,
    ColumnBar
  },
  data() {
    return {
      showDailog: false,
      titleName: "编辑字典类型",
      editModel: "E",
      dictTypeForm: {
        id: "",
        dictName: "",
        dictType: "",
        isSys: "",
        remarks: "",
        isNewRecord: false
      },
      componentList: [
        {
          label: "字典名称：",
          prop: "dictName",
          componentName: "el-input",
          labelWidth: "120px",
          cols: [24, 24, 24, 24],
          value: "dictName",
          width: "50%"
        },
        {
          label: "字典类型：",
          prop: "dictType",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [24, 24, 24, 24],
          value: "dictType",
          width: "50%"
        },
        {
          label: "系统参数：",
          prop: "isSys",
          labelWidth: "120px",
          componentName: "RadioChoose",
          cols: [24, 24, 24, 24],
          value: "isSys",
          width: "50%",
          radios: this.getMenuType("sys_yes_no")
        },
        {
          label: "备注：",
          prop: "remarks",
          labelWidth: "120px",
          componentName: "el-input",
          type: "textarea",
          rowsSpan: 4,
          cols: [24, 24, 24, 24],
          value: "remarks"
        }
      ],
      dictTypeFormRules: {
        dictName: [{ required: true, message: "必填信息", trigger: "blur" }],
        isSys: [{ required: true, message: "必填信息", trigger: "blur" }],
        dictType: [
          { required: true, message: "必填信息", trigger: "blur" },
          {
            pattern: returnReg("letterNumber"),
            message: "请输入字母数字或下划线",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    show(row, type) {
      // console.log("319", type, row);
      if (type === "新增") {
        this.dictTypeForm.isNewRecord = true;
        this.initDictTypeEdit("initDictTypeEdit", { id: "" });
      }
      if (type === "编辑") {
        this.dictTypeForm.isNewRecord = false;
        this.initDictTypeEdit("initDictTypeEdit", {
          id: row.id
        });
      }
    },
    /* 获取初始化页面数据 */
    initDictTypeEdit(type, row) {
      sysApi[type](row).then(res => {
        this.dictTypeForm.id = res.dictType.id || "";
        this.dictTypeForm.dictName = res.dictType.dictName || "";
        this.dictTypeForm.dictType = res.dictType.dictType || "";
        this.dictTypeForm.isSys = res.dictType.isSys || "";
        this.dictTypeForm.remarks = res.dictType.remarks || "";
        this.showDailog = true;
      });
    },
    saveBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          sysApi.saveDictType(this.dictTypeForm).then(res => {
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
      this.dictTypeForm.dictName = "";
      this.dictTypeForm.dictType = "";
      this.dictTypeForm.isSys = "";
      this.dictTypeForm.currentVersion = "";
    }
  }
};
</script>
<style lang="scss" scoped></style>
