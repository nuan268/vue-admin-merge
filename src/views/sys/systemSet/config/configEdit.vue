/*新增/编辑模块*/
<template>
  <div>
    <DailogPanel
      :dialog-visible="showDailog"
      :title-name="titleName"
      :app-to-body="true"
      @closeDialog="closeDialog"
    >
      <template slot="content">
        <ColumnBar :column-text="'基本信息'"></ColumnBar>
        <el-form
          ref="configForm"
          :model="configForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
          :rules="menuFormRules"
        >
          <DymForm
            :edit-model="editModel"
            :component-list="componentList"
            :form-value.sync="configForm"
          >
          </DymForm>
        </el-form>
      </template>
      <template slot="footer">
        <el-button size="mini" type="primary" @click="saveBtn('configForm')">
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
      titleName: "编辑参数",
      editModel: "E",
      configForm: {
        id: "",
        configName: "",
        configKey: "",
        configValue: "",
        isSys: "",
        remarks: "",
        isNewRecord: false
      },
      componentList: [
        {
          label: "参数名称：",
          prop: "configName",
          componentName: "el-input",
          labelWidth: "120px",
          cols: [24, 24, 24, 24],
          value: "configName",
          width: "50%"
        },

        {
          label: "参数键名：",
          prop: "configKey",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [24, 24, 24, 24],
          width: "50%",
          value: "configKey"
        },

        {
          label: "参数键值：",
          prop: "configValue",
          labelWidth: "120px",
          componentName: "el-input",
          type: "textarea",
          rowsSpan: 4,
          cols: [24, 24, 24, 24],
          value: "configValue"
        },
        {
          label: "系统参数：",
          prop: "isSys",
          labelWidth: "120px",
          componentName: "RadioChoose",
          cols: [12, 12, 12, 12],
          value: "isSys",
          radios: this.getMenuType("sys_yes_no")
        },
        {
          label: "参数描述：",
          prop: "remarks",
          labelWidth: "120px",
          componentName: "el-input",
          type: "textarea",
          rowsSpan: 3,
          cols: [24, 24, 24, 24],
          value: "remarks"
        }
      ],
      menuFormRules: {
        configName: [{ required: true, message: "必填信息", trigger: "blur" }],
        configKey: [{ required: true, message: "必填信息", trigger: "blur" }],
        isSys: [{ required: true, message: "必填信息", trigger: "blur" }]
      }
    };
  },
  methods: {
    show(row, type) {
      // console.log("319", type, row);
      if (type === "新增") {
        this.configForm.isNewRecord = true;
        this.initConfigEdit("initConfigEdit", { id: "" });
      }
      if (type === "编辑") {
        this.configForm.isNewRecord = false;
        this.configForm.id = row.id;
        this.initConfigEdit("initConfigEdit", {
          id: row.id
        });
      }
    },
    /* 获取初始化页面数据 */
    initConfigEdit(type, row) {
      sysApi[type](row).then(res => {
        this.configForm.configName = res.config.configName || "";
        this.configForm.configKey = res.config.configKey || "";
        this.configForm.configValue = res.config.configValue || "";
        this.configForm.isSys = res.config.isSys || "";
        this.configForm.remarks = res.config.remarks || "";
        this.showDailog = true;
      });
    },
    saveBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          sysApi.saveConfig(this.configForm).then(res => {
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
      this.configForm.configName = "";
      this.configForm.configKey = "";
      this.configForm.configValue = "";
      this.configForm.isSys = "";
      this.configForm.remarks = "";
    },
    /* 列表文本转义 */
    getMenuType(type) {
      const selectTypeData = JSON.parse(
        sessionStorage.getItem("selectDicType")
      );
      return selectTypeData[type];
    }
  }
};
</script>
<style lang="scss" scoped></style>
