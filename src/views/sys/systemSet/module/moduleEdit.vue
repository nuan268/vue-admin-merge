/*新增/编辑模块*/
<template>
  <div class="add-user-box">
    <DailogPanel
      :dialog-visible="showDailog"
      :title-name="titleName"
      :app-to-body="true"
      @closeDialog="closeDialog"
    >
      <template slot="content">
        <ColumnBar :column-text="'基本信息'"></ColumnBar>
        <el-form
          ref="moduleForm"
          :model="moduleForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
          :rules="menuFormRules"
        >
          <DymForm
            :edit-model="editModel"
            :component-list="componentList"
            :form-value.sync="moduleForm"
          >
          </DymForm>
        </el-form>
      </template>
      <template slot="footer">
        <el-button size="mini" type="primary" @click="saveBtn('moduleForm')">
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
      titleName: "编辑模块",
      editModel: "E",
      currentRow: {},
      currentType: {},
      superMenuName: "",
      moduleForm: {
        moduleName: "",
        moduleCode: "",
        mainClassName: "",
        description: "",
        currentVersion: "",
        isNewRecord: false,
        lastUpdateDateTime: ""
      },
      componentList: [
        {
          label: "模块名称：",
          prop: "moduleName",
          componentName: "el-input",
          labelWidth: "120px",
          cols: [12, 12, 12, 12],
          value: "moduleName"
        },
        {
          label: "模块编码：",
          prop: "moduleCode",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "moduleCode",
          disabled: false
        },
        {
          label: "主类全名：",
          prop: "mainClassName",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [24, 24, 24, 24],
          value: "mainClassName",
          questionIcon: true,
          width: "calc(100% - 28px)",
          inline: "inline-block",
          questionText:
            "该模块的状态验证类，如果该类检测不存在，则该模块状态提示 “未安装” ，验证原理：Class.forName(\/"
        },
        {
          label: "模块描述：",
          prop: "description",
          labelWidth: "120px",
          componentName: "el-input",
          type: "textarea",
          rowsSpan: 4,
          cols: [24, 24, 24, 24],
          value: "description"
        },
        {
          label: "当前版本：",
          prop: "currentVersion",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "currentVersion"
        }
      ],
      menuFormRules: {
        moduleName: [{ required: true, message: "必填信息", trigger: "blur" }],
        moduleCode: [
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
      this.currentType = type;
      this.currentRow = row;
      if (type === "新增") {
        this.componentList[1].disabled = false;
        this.moduleForm.isNewRecord = true;
        this.initModuleEditAdd("initModuleAdd", {});
      }
      if (type === "编辑") {
        this.componentList[1].disabled = true;
        this.moduleForm.isNewRecord = false;
        this.initModuleEditAdd("initModuleEdit", {
          moduleCode: row.moduleCode
        });
      }
    },
    /* 获取初始化页面数据 */
    initModuleEditAdd(type, row) {
      sysApi[type](row).then(res => {
        this.moduleForm.moduleName = res.module.moduleName || "";
        this.moduleForm.moduleCode = res.module.moduleCode || "";
        this.moduleForm.mainClassName = res.module.mainClassName || "";
        this.moduleForm.description = res.module.description || "";
        this.moduleForm.currentVersion = res.module.currentVersion || "";
        this.showDailog = true;
      });
    },
    saveBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          sysApi.saveModule(this.moduleForm).then(res => {
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
      this.moduleForm.moduleName = "";
      this.moduleForm.moduleCode = "";
      this.moduleForm.description = "";
      this.moduleForm.currentVersion = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.choosed-data {
  border: 1px solid #eee;
  height: 100%;
  padding: 10px;
  border-radius: 4px;
}
.add-user-box {
}
</style>
