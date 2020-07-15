/*带搜索图标输入框的选择弹窗模板 弹窗嵌套弹窗 背景遮罩问题 单独写
:modal-append-to-body="false"*/
<template>
  <div class="inner-dailog-box">
    <el-dialog
      ref="dialog__wrapper"
      v-dialogDrag
      :append-to-body="true"
      width="70%"
      :title="titleName + '字典数据'"
      :visible.sync="innerDialogVisible"
      :before-close="handleClose"
    >
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
      <!-- 第三层弹窗 引用组件的方式页面无法显示 故 复写 -->
      <el-dialog
        ref="dialog__wrapper"
        v-dialogDrag
        :append-to-body="true"
        width="30%"
        :title="menuTreeTitle"
        :visible.sync="dialogVisible"
        :before-close="handleCloseTree"
      >
        <div style="text-align: right; line-height: 40px;">
          <i
            v-show="showKeyVal"
            class="el-icon-caret-top"
            @click="expandFunc"
          ></i>
          <i
            v-show="!showKeyVal"
            class="el-icon-caret-bottom"
            @click="expandFunc"
          ></i>
        </div>
        <div :style="{ display: display }" style="text-align:center;">
          <span>关键字： </span>
          <el-input v-model="keyVal_" style="width: 200px;"> </el-input>
          <el-button type="primary" size="mini" @click="searchKey">
            搜索
          </el-button>
        </div>
        <el-row style="margin-top:20px;">
          <el-col :span="18">
            <MenuTree
              ref="menuTreeDom"
              :menu-data="menuData"
              :default-expand="defaultExpand"
              :expand-all="expandAll"
              :click-type="clickType"
              :show-checkbox="showCheckbox"
              @on-change-keyVal="changeKeyVal"
              @clickNodeReslut="clickNodeReslut"
            ></MenuTree>
          </el-col>
          <el-col :span="6">
            <span class="ctrol-btn" @click="switchStatus"> 展开 / 折叠 </span>
          </el-col>
        </el-row>
        <div class="btn-box">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            @click="sureAndCloseBtn"
          >
            确定
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-close"
            @click="handleCloseTree"
          >
            关闭
          </el-button>
        </div>
      </el-dialog>

      <div class="btn-box">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-check"
          @click="saveDictTypeData('dictTypeForm')"
        >
          确定
        </el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-close"
          @click="handleClose"
        >
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DymForm from "@/components/element/dymForm";
import ColumnBar from "@/components/commonColumn";
import ExtentionFeild from "@/components/extentionFeild";
import MenuTree from "@/components/menuTree";
import { toTreeData } from "@/utils/pubFunc";
import { sysApi } from "@/api/systemSet";
import { returnReg } from "@/utils/validate";
export default {
  name: "ChooseMenuTree",
  components: {
    DymForm,
    ColumnBar,
    ExtentionFeild,
    MenuTree
  },
  data() {
    return {
      dialogVisible: false,
      exHeight: "0px",
      editModel: "E",
      titleName: "新增",
      innerDialogVisible: false,
      dictTypeForm: {
        isNewRecord: false,
        parent: {
          id: "",
          dictLabelOrig: ""
        },
        superDictLabelOrig: "",
        //    parent.dictLabelOrig: 紧急
        // parent.id: 1277155218729738240
        dictCode: "",
        dictType: "",
        dictLabelOrig: "",
        dictValue: "",
        treeSort: "",
        "!isSys": "",
        isSys: "",
        description: "",
        cssStyle: "",
        cssClass: "",
        remarks: ""
      },
      componentList: [
        {
          label: "上级字典：",
          prop: "superDictLabelOrig",
          componentName: "el-input",
          labelWidth: "120px",
          cols: [24, 24, 24, 24],
          value: "superDictLabelOrig",
          width: "43%",
          addIcon: true,
          slotPosition: "append",
          iconType: "el-icon-search"
        },
        {
          label: "字典标签：",
          prop: "dictLabelOrig",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "dictLabelOrig"
        },
        {
          label: "字典键值：",
          prop: "dictValue",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "dictValue"
        },
        {
          label: "排序号：",
          prop: "treeSort",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "treeSort",
          questionIcon: true,
          width: "calc(100% - 28px)",
          inline: "inline-block",
          questionText: "当前字典树结构层次级别的排序号"
        },
        {
          label: "系统内置：",
          prop: "isSys",
          labelWidth: "120px",
          componentName: "RadioChoose",
          cols: [12, 12, 12, 12],
          value: "isSys",
          radios: this.getMenuType("sys_yes_no")
        },
        {
          label: "字典描述：",
          prop: "description",
          labelWidth: "120px",
          componentName: "el-input",
          type: "textarea",
          rowsSpan: 2,
          cols: [24, 24, 24, 24],
          value: "description",
          questionIcon: true,
          width: "calc(100% - 28px)",
          inline: "inline-block",
          questionText: "工具提示，如select鼠标放到option上去会显示该描述信息"
        },
        {
          label: "其他信息", // 授权功能菜单
          lineTips: true,
          cols: [24, 24, 24, 24],
          showFlag: false
        },
        {
          label: "CSS样式：",
          prop: "cssStyle",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "cssStyle",
          questionIcon: true,
          width: "calc(100% - 28px)",
          inline: "inline-block",
          questionText: "CSS样式（如：style=“color:red”, 请填写：color:red）"
        },
        {
          label: "CSS类名：",
          prop: "cssClass",
          labelWidth: "120px",
          componentName: "el-input",
          cols: [12, 12, 12, 12],
          value: "cssClass",
          questionIcon: true,
          width: "calc(100% - 28px)",
          inline: "inline-block",
          questionText: "CSS类名（如：class=“red”, 请填写：red）"
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
        },
        {
          label: "扩展字段", // 授权功能菜单
          lineTips: true,
          cols: [24, 24, 24, 24],
          showFlag: false,
          iconTips: true
        }
      ],
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
      dictTypeFormRules: {
        dictLabelOrig: [
          { required: true, message: "必填信息", trigger: "blur" }
        ],
        dictValue: [{ required: true, message: "必填信息", trigger: "blur" }],
        isSys: [{ required: true, message: "必填信息", trigger: "blur" }],
        treeSort: [
          { required: true, message: "必填信息", trigger: "blur" },
          {
            pattern: returnReg("positiveInteger"),
            message: "请输入一个正整数",
            trigger: "blur"
          }
        ]
      },
      currentType: "",
      innerDialogVisible2: false,
      menuTreeTitle: "上级字典",
      clickType: false,
      keyVal_: "",
      showKeyVal: true,
      display: "block",
      menuData: [],
      keyVal: "",
      defaultExpand: [],
      expandAll: false,
      showCheckbox: false,
      checkedMemu: [],
      nodeData: {}
    };
  },
  watch: {
    /* tree 搜索过滤 */
    keyVal_(val) {
      this.$refs.menuTreeDom.executeFilter(val);
    }
  },
  methods: {
    show(row, type) {
      // console.log(273, row);
      this.currentType = type;
      this.dictTypeForm.dictType = row.dictType;
      this.innerDialogVisible = true;
      this.titleName = "新增";
      // dictCode=1277155218645852160     dictType=${param.dictType} parentCode=1277155218515828736
      let param = `dictType=${row.dictType}`;
      if (type === "编辑") {
        param = `dictCode=${row.dictCode}`;
        this.titleName = "编辑";
      }
      if (type === "新增下级") {
        param += `&parentCode=${row.id}`;
        this.dictTypeForm.parent.id = row.id;
        this.dictTypeForm.parent.dictLabelOrig = row.dictLabelOrig;
        this.dictTypeForm.superDictLabelOrig = row.dictLabelOrig;
      }
      this.init(param);
    },
    init(param) {
      sysApi.initDictTypeAdd(param).then(res => {
        this.dictTypeForm.isNewRecord = res.dictData.isNewRecord;

        this.dictTypeForm.dictCode = res.dictData.dictCode || "";
        // this.dictTypeForm.dictType = res.dictData.dictType || "";
        this.dictTypeForm.dictLabelOrig = res.dictData.dictLabelOrig || "";
        this.dictTypeForm.dictValue = res.dictData.dictValue || "";
        this.dictTypeForm.treeSort = res.dictData.treeSort || "";
        this.dictTypeForm.isSys = res.dictData.isSys || "";
        this.dictTypeForm.description = res.dictData.description || "";
        this.dictTypeForm.cssStyle = res.dictData.cssStyle || "";
        this.dictTypeForm.cssClass = res.dictData.cssClass || "";
        this.dictTypeForm.remarks = res.dictData.remarks || "";
        this.dictTypeForm.parent.id = res.dictData.parentCode || "";
        if (this.currentType === "编辑") {
          for (const key in res.dictData.extend) {
            if (res.dictData.extend[key]) {
              this.extend[key] = res.dictData.extend[key];
            }
          }
          const tempOrig = res.dictData.treeNames.split("/");
          this.dictTypeForm.superDictLabelOrig =
            tempOrig[tempOrig.length - 2] || "";
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

    saveDictTypeData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = {};
          obj.isNewRecord = this.dictTypeForm.isNewRecord;
          obj["parent.id"] = this.dictTypeForm.parent.id;
          obj["area.dictLabelOrig"] = this.dictTypeForm.parent.dictLabelOrig;
          obj.dictCode = this.dictTypeForm.dictCode;
          obj.dictType = this.dictTypeForm.dictType;
          obj.dictLabelOrig = this.dictTypeForm.dictLabelOrig;
          obj.dictValue = this.dictTypeForm.dictValue;
          obj.treeSort = this.dictTypeForm.treeSort;
          obj.isSys = this.dictTypeForm.isSys;
          obj.description = this.dictTypeForm.description;
          obj.cssStyle = this.dictTypeForm.cssStyle;
          obj.cssClass = this.dictTypeForm.cssClass;
          obj.remarks = this.dictTypeForm.remarks;
          for (const key in this.extend) {
            obj["extend." + key] = this.extend[key];
          }
          sysApi.saveDictTypeData(obj).then(res => {
            if (res.result === "true") {
              this.$message.success(res.message);
              this.$emit("initPage");
              this.handleClose();
            } else {
              this.$message.warning(res.message);
              this.handleClose();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 关闭对话框选择 并清空值
    handleClose() {
      this.innerDialogVisible = false;
      for (const key in this.extend) {
        this.extend[key] = "";
      }
      this.dictTypeForm = {
        isNewRecord: false,
        parent: {
          id: "",
          dictLabelOrig: ""
        },
        superDictLabelOrig: "",
        dictCode: "",
        dictType: "",
        dictLabelOrig: "",
        dictValue: "",
        treeSort: "",
        "!isSys": "",
        isSys: "",
        description: "",
        cssStyle: "",
        cssClass: "",
        remarks: ""
      };
      //   this.$emit("closeInnerDialog");
    },
    /* 显示扩展字段 */
    showExtentionDom() {
      this.exHeight = this.exHeight === "0px" ? "480px" : "0px";
    },
    focusIt(keyName) {
      // this.$refs.chooseMenuTree.init();
      this.$nextTick(() => {
        if (keyName === "superDictLabelOrig") {
          this.menuTreeTitle = "上级字典";
          this.showCheckbox = false;
          this.getDictTypeTreeData();
        }
      });
    },
    /* 获取上级字典 菜单树数据 */
    getDictTypeTreeData() {
      // excludeCode=1277155218645852160&dictType=msg_inner_content_level&isShowNameOrig=true&t=1594345469703
      const param = `excludeCode=${this.dictTypeForm.dictCode}&dictType=${
        this.dictTypeForm.dictType
      }`;
      sysApi.getDictTypeTreeData(param).then(res => {
        const attributes = {
          id: "id",
          parentId: "pId",
          label: "name",
          rootId: "0"
        };
        this.menuData = toTreeData(res, attributes);
        this.dialogVisible = true;
      });
    },
    /* changeKeyVal */
    changeKeyVal(val) {
      // console.log(379, val);
      this.keyVal = val;
    },
    /* 菜单树中当前点击的树节点*/
    clickNodeReslut(data) {
      // console.log(555, data);
      this.nodeData = data.data;
      if (data.type === "dbclick") {
        this.nodeEvents(data.data);
      }
    },
    /* 根据树节点单双击确定触发事件 */
    nodeEvents(data) {
      this.dictTypeForm.parent.id = data.id;
      this.dictTypeForm.parent.dictLabelOrig = data.label;
      this.dictTypeForm.superDictLabelOrig = data.label;
      this.keyVal = "";
      this.dialogVisible = false;
    },
    /*  /* 关闭选择归属机构或者归属公司 */
    sureAndCloseBtn(val) {
      // console.log(510, val);
      this.nodeEvents(this.nodeData);
      this.dialogVisible = false;
    },
    /* 关闭上级字典菜单树 */
    handleCloseTree() {
      this.dialogVisible = false;
    },
    /* 展开或收起选项 */
    switchStatus() {
      // console.log(155);
      this.expandAll = !this.expandAll;
      this.$refs.menuTreeDom.showOrHiddenAllNodes();
    },
    /* 搜索关键字  */
    searchKey() {
      console.log("搜索关键字", this.keyVal_);
      this.$refs.menuTreeDom.executeFilter(this.keyVal_);
    },
    /* 收或展开 关键字搜素 */
    expandFunc() {
      this.showKeyVal = !this.showKeyVal;
      this.display = this.display === "block" ? " none" : "block";
    }
  }
};
</script>

<style lang="scss" scoped>
.inner-dailog-box {
  .el-dialog__header {
    padding: 0 10px;
    background: #fff;
  }
  .el-dialog__body {
    background: #f4f6f8;
    padding: 5px 20px;
    height: 300px;
    // position: relative;
  }
}
.ctrol-btn {
  cursor: pointer;
}
.btn-box {
  width: 100%;
  text-align: right;
  padding: 20px 10px;
}
</style>
