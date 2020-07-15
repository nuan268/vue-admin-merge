<template>
  <div class="company-edit-panel">
    <DailogFrame
      :dialog-visible="showEditDailog"
      :title-name="titleType"
      @closeDialog="closeEditDialog"
    >
      <template slot="content">
        <el-form
          ref="postForm"
          :model="postForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
          :rules="companyFormRules"
        >
          <DymForm
            :edit-model="editModel"
            :component-list="componentList"
            :form-value.sync="postForm"
          >
          </DymForm>
        </el-form>
      </template>
      <template slot="footer">
        <div style="text-indent: 100px;">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="submitForm('postForm')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            size="mini"
            @click="colseOffice('postForm')"
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
import DymForm from "@/components/element/dymForm";

import { dictTypeMap } from "@/utils/pubFunc";
import { returnReg } from "@/utils/validate";
import { orgApi } from "../../../../api/organization";
import { pubApi } from "@/api/public_request";
export default {
  name: "UserEdit",
  components: {
    DailogFrame,
    DymForm,
    ColumnBar
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
      showCheckbox: false,
      editModel: "E",
      postForm: {
        oldRoleName: "",
        postName: "",
        postCode: "",
        postType: "",
        postSort: "",
        remarks: "" // 无对应键名
      },
      componentList: [
        {
          label: "基本信息", // 授权功能菜单
          lineTips: true,
          cols: [24, 24, 24, 24],
          showFlag: false
        },
        {
          label: "岗位名称：",
          prop: "postName",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "postName"
        },
        {
          label: "岗位编码：",
          prop: "postCode",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "postCode",
          disabled: this.isNewRecord
        },
        {
          label: "岗位分类：",
          prop: "postType",
          labelWidth: "90px",
          componentName: "baseSelect",
          cols: [12, 12, 12, 12],
          placeholder: "请输选择",
          value: "postType",
          options: this.getPostOption("sys_post_type")
        },
        {
          label: "排序号：",
          prop: "postSort",
          labelWidth: "90px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          placeholder: "请输入",
          value: "postSort"
        },
        {
          label: "备注信息：",
          prop: "remarks",
          labelWidth: "90px",
          componentName: "el-input",
          rowsSpan: 4,
          type: "textarea",
          cols: [24, 24, 24, 24],
          placeholder: "请输入",
          value: "remarks"
        }
      ],
      titleType: "",
      isNewRecord: false,
      companyFormRules: {
        postName: [{ required: true, message: "必填信息", trigger: "blur" }],
        postCode: [{ required: true, message: "必填信息", trigger: "blur" }],
        postSort: [
          {
            required: false,
            pattern: returnReg("positiveInteger"),
            message: "请输入一个正整数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    isNewRecord1: {
      get() {
        return this.isNewRecord;
      },
      set(val) {}
    }
  },
  created() {},
  methods: {
    /* 显示对话框  编辑机构  新增下级机构  新增机构*/
    show(row, type) {
      // console.log(285, type, row);
      this.showEditDailog = true;
      this.titleType = type;
      if (type === "编辑") {
        this.componentList[2].disabled = true;
        orgApi
          .getPostEdit({
            key: "postCode",
            val: row.postCode
          })
          .then(res => {
            this.postForm = res.post;
            this.isNewRecord = res.post.isNewRecord;
            this.postForm.oldRoleName = this.postForm.postName;
          });
      } else {
        //  新增
        this.componentList[2].disabled = false;
        orgApi.getPostAdd().then(res => {
          this.isNewRecord = res.post.isNewRecord;
          this.postForm.postCode = res.post.postSort;
        });
      }
    },
    /* 获取岗位下拉框数据 */
    getPostOption(type) {
      const selectTypeData = JSON.parse(
        sessionStorage.getItem("selectDicType")
      );
      return selectTypeData[type];
    },
    /* 关闭编辑对话框 */
    closeEditDialog() {
      this.colseOffice("postForm");
      this.showEditDailog = false;
    },
    /* 提交 */
    submitForm(formName) {
      // console.log(3, this.postForm);
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = this.postForm;
          obj.isNewRecord = this.isNewRecord;
          orgApi.saveEdit(obj).then(res => {
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
            this.colseOffice("postForm");
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
      // this.postForm.parent.id = "";
      // this.postForm.parent.officeName = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.company-edit-panel {
}
</style>
