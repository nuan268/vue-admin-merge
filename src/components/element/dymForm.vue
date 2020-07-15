<template>
  <div>
    <el-row :gutter="10" class="clearfix">
      <el-col
        v-for="(it, ind) in componentList"
        :key="ind"
        :xs="it.cols[0]"
        :sm="it.cols[1]"
        :md="it.cols[2]"
        :lg="it.cols[3]"
      >
        <ColumnBar
          v-show="it.lineTips"
          :icon-tips="it.iconTips"
          :column-text="it.label"
          @showExtentionDetail="showExtentionDom"
        ></ColumnBar>
        <el-form-item
          v-if="
            it.showFlag === undefined || it.showFlag === true ? true : false
          "
          :label="it.label"
          :label-width="it.labelWidth"
          :prop="it.prop"
          :show-message="it.showMessage"
          :style="{ height: it.height }"
        >
          <i
            v-if="it.questionIcon"
            :title="it.questionText"
            class="question icon-question"
          ></i>
          <!-- 部分参数说明：1.showAlpha （el-color-picker）颜色选择器 是否启用rgba -->
          <!--questionIcon： 是否显示title 提示图标  width：控制相邻input宽度  inline：设置input盒模型 questionText：title 提示文本内容  -->
          <component
            :is="it.componentName"
            v-if="it.bySelf === true ? false : true"
            v-model="newFormValue[it.value]"
            :show-alpha="it.showAlpha"
            class="dymForm"
            
            :style="[{ width: it.width, display: it.inline }]"
            :placeholder="''"
            :clearable="it.clearable"
            :multiple="it.multiple"
            :options="it.options"
            :disabled="it.disabled || editModel === 'V' ? true : false"
            :collapse-tags="it.collapseTags"
            :type="it.type"
            :prop="it.prop"
            :name="it.name"
            :reload="it.reload"
            :query-paras="buildQueryParas(it.queryName, it.queryValue)"
            :cascader-props="it.cascaderProps"
            :selected-field="it.selectedField"
            :maxlength="it.maxlength"
            :minlength="it.minlength"
            :value-format="it.format"
            :picker-options="it.pickerOptions"
            :tag-id="it.tagId"
            :autosize="it.autosize"
            :dict-type-code="it.dictTypeCode"
            :api="it.api"
            :value-key="it.valueKey"
            :capital-source="it.capitalSource"
            :load-list="it.loadList"
            :account-width="it.accountWidth"
            :time-type="it.timeType"
            :time-size="it.timeSize"
            :format="it.format"
            :active-value="'1'"
            :inactive-value="'0'"
            :percent.sync="newFormValue[it.percent]"
            :reset-value.sync="it.resetValue"
            :amount.sync="newFormValue[it.amount]"
            :company-id="it.companyId"
            :start-placeholder="it.startPlaceholder"
            :end-placeholder="it.endPlaceholder"
            :rows="it.rowsSpan"
            :radios="it.radios"
            :checked-radio="it.checkedRadio"
            v-on="$listeners"
            @selectChanged="selectChanged"
            @focus="focus($event, it.prop)"
            @otherData="otherData"
            @blur="blur"
            @change="change"
            @onbackblankaccount="onbackblankaccount"
            @input="inputIt"
          >
            <!-- 设置带Icon 的input  tips: slot:append/prepend  icon:class类名-->
            <el-button
              v-show="it.addIcon"
              :slot="it.slotPosition"
              :icon="it.iconType"
              @click="btnClick(it.prop, 'inputSearch')"
            >
            </el-button>
            <!-- 当一个组件上存在第二个icon的时候使用 -->
            <el-button
              v-show="it.anotherIcon"
              :slot="it.anotherSlotPosition"
              :icon="it.anotherIconType"
              @click="anotherBtnClick(it.prop, 'iconType')"
            >
            </el-button>
          </component>
        </el-form-item>
        <slot v-else name="bySelf"> </slot>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ColumnBar from "@/components/commonColumn";
import BaseSelect from "@/components/element/BaseSelect";
import RadioChoose from "@/components/element/RadioChoose";
import CheckBoxChoose from "@/components/element/CheckBoxChoose";
import dict from "@/components/element/SelectDictionary.vue"; // 字典组件
// import officeTree from '@/components/element/officeTree.vue' // 公司树
// import orgTree from '@/components/element/orgTree.vue' // 根据公司树查询下面机构
// import orgTreeAll from '@/components/element/orgTreeAll.vue' // 查询所有机构
import BaseCascader from "@/components/element/BaseCascader.vue"; // 动态树base
import passwd from "@/components/element/passwd.vue"; // 密码
// import tinyEditor from "@/components/fileManage/tinyEditor.vue"; // 富文本编辑器
import autoComplete from "@/components/element/autoComplete.vue"; // 自动补充输入框
import reportPhase from "@/components/element/reportPhase.vue"; // 期数
import cascaderCompany from "@/components/element/CascaderCompany.vue"; // 公司选择
import cascaderDepartment from "@/components/element/CascaderDepartment.vue"; // 部门选择
import cascaderOrg from "@/components/element/CascaderOrg.vue"; // 机构选择（公司+部门）
import cascaderOrgUser from "@/components/element/CascaderOrgUser.vue"; // 机构选择（公司+部门+人员）
// import cascaderOrgDownload from "@/components/element/CascaderOrgDownload.vue"; // 机构选择（公司+部门+人员）
// import cascaderOrgDownloadUser from "@/components/element/CascaderOrgDownloadUser.vue"; // 机构选择（公司+部门+人员）
// import btnUpload from "@/components/button/btnUpload.vue"; // 机构选择（公司+部门+人员）

export default {
  components: {
    BaseSelect,
    RadioChoose,
    CheckBoxChoose,
    dict,
    // officeTree,
    // orgTree,
    // orgTreeAll,
    BaseCascader,
    passwd,
    // tinyEditor,
    autoComplete,
    reportPhase,
    cascaderCompany,
    cascaderDepartment,
    cascaderOrg,
    cascaderOrgUser,
    ColumnBar
    // cascaderOrgDownload,
    // cascaderOrgDownloadUser,
    // btnUpload
  },
  props: {
    componentList: {
      type: [Array],
      required: true
    },
    formValue: {
      type: [Object]
    },
    editModel: {
      type: [String],
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {
      selectObj: {}
    };
  },
  computed: {
    newFormValue: {
      get: function() {
        // console.log(222, "get", this.formValue);
        return this.formValue;
      },
      set: function(value) {
        // console.log(333, "set", this.formValue);
        this.$emit("update:formValue", value);
      }
    }
  },
  methods: {
    otherData(value) {
      this.$emit("otherData", value);
    },
    onbackblankaccount(value) {
      this.$emit("onbackblankaccount", value);
    },
    selectChanged(val, name, row) {
      // console.log("selectChanged", val, name, row);
      this.selectObj[name] = row;
      this.$emit("selectChanged", val, name, this.selectObj);
    },
    buildQueryParas(queryName, queryValue) {
      // console.log("buildQueryParas", queryName);
      const obj = {};
      if (typeof queryName === "string") {
        obj[queryName] = this.formValue[queryValue];
      } else if (queryName !== undefined) {
        const list = [];
        queryName.forEach((item, index) => {
          const v = queryValue[index];
          if (item === "enterpriseIds") {
            list.push(this.formValue[v]);
            obj[item] = list;
          } else {
            obj[item] = this.formValue[v];
          }
        });
      }
      // console.log(129, "obj", obj);
      return obj;
      // if (this.UtilJs.isEmpty(queryName) || this.UtilJs.isEmpty(queryValue)) {
      //   return
      // } else {
      //   let obj = {}
      //   obj[queryName] = this.formValue[queryValue]
      //   console.log(obj)
      //   return obj
      // }
    },
    /* 点击带图标的input 触发事件 ， iconType 设置触发icon点击事件类型  */
    btnClick(keyName, iconType) {
      // console.log(232, keyName, iconType);
      if (iconType === "inputSearch") {
        this.focus({}, keyName);
      }
    },
    /* 当一个组件前后都有icon 图标时 */
    anotherBtnClick(keyName, iconType) {
      // if (iconType === "inputSearch") {
      //   this.focus({}, keyName);
      // }
    },
    focus(event, keyName) {
      // console.log(240, event, keyName);
      // this.$emit('focus', keyName)
      this.$emit("focusIt", keyName);
    },
    blur(event) {
      // console.log('event', event)
      this.$emit("blur");
    },
    inputIt(val) {
      // console.log(2231, val);
    },
    change(val) {
      // console.log(201, val);
      this.selectObj[name] = val;
      this.$emit("selectChanged", val, name, this.selectObj);
    },
    /* 显示扩展字段 */
    showExtentionDom() {
      this.$emit("showExtentionDom");
    }
  }
};
</script>
<style scoped>
.question {
  margin: 7px 10px 0 0;
  float: left;
  width: 18px;
}
.div-box {
  width: calc(100%-18px);
  outline: 5px solid red;
  /* float: left; */
}
.dymForm {
  /* display: inline-block; */
  float: left;
  vertical-align: middle;
}
</style>
