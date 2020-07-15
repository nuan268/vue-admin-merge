<template>
  <div class="post  wrapper_content">
    <TopBtns
      :btn-arr="btnArr"
      :left-mg="leftMg"
      @showSearch="showSearch"
      @handlerName="handlerName"
    ></TopBtns>
    <InputFilter
      v-show="showSearchVal"
      :form-item="formInline"
      @searchBtn="searchBtn"
      @resetForm="resetForm"
      @statusValChange="statusValChange"
    >
    </InputFilter>

    <TableTree
      :table-head="tableHead"
      :table-data="tableData"
      :column-widths="columnWidths"
      :column-text-postion="columnTextPostion"
      :slot-columns="slotColumns"
      :table-fit="tableFit"
      style="margin-top: 10px;"
      :page-nation="pageNation"
      :column-sortabel="columnSortabel"
      @sortChange="sortChange"
      @currentChange="currentChange"
    >
      <template slot="index">
        <el-table-column
          fixed
          label="序号"
          type="index"
          align="center"
          width="50"
        ></el-table-column>
      </template>

      <template slot="configName" slot-scope="scope">
        <span class="td-color tl" @click="menuEditAdd(scope.row, '编辑')">
          {{ scope.row.configName }}
        </span>
      </template>
      <template slot="isSys" slot-scope="scope">
        <span v-if="scope.row.isSys === '0'" class="no-color">
          {{ swichText("sys_yes_no", scope.row.isSys, "未安装") }}
        </span>
        <span v-else>
          {{ swichText("sys_yes_no", scope.row.isSys, "未安装") }}
        </span>
      </template>
      <template slot="operate">
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="menuEditAdd(scope.row, '编辑')"
            >
              <i class="el-icon-edit" title="编辑菜单"></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteConfig(scope.row)"
            >
              <i style="color:red;" class="el-icon-delete" title="删除菜单"></i>
            </el-button>
          </template>
        </el-table-column>
      </template>
    </TableTree>
    <ConfigEdit ref="configEditPanel" @initPage="initPage"></ConfigEdit>
  </div>
</template>
<script>
import TableTree from "@/components/tableTree";
import InputFilter from "@/components/inputFliter";
import ConfigEdit from "./configEdit";
import TopBtns from "@/components/componentBtns/topBtns/baseBtn";
import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
import { sysApi } from "../../../../api/systemSet";
// import { returnReg } from "@/utils/validate";
export default {
  name: "Config",
  inject: ["reload"],
  components: {
    TableTree,
    InputFilter,
    ConfigEdit,
    TopBtns
  },
  data() {
    return {
      showSearchVal: false,
      leftMg: {
        icon: "fa icon-wrench",
        text: "参数设置",
        class: "fa icon-question f14",
        showQuestIcon: true,
        title:
          "读取顺序：Environment --> JVM中启动的参数 --> application.yml --> 本参数设置中的参数，读取参数方法：Global.getConfig('参数键名')"
      },
      btnArr: [
        {
          handlerName: "View",
          btnText: "查询",
          class: "fa fa-search"
        },
        {
          handlerName: "AddNew",
          btnText: "新增",
          class: "fa fa-plus"
        },
        {
          handlerName: "ClearAll",
          btnText: "清理全部缓存",
          class: "fa fa-refresh"
        }
      ],
      formInline: [
        {
          type: "input",
          label: "参数名称",
          key: "configName",
          value: ""
        },
        {
          type: "input",
          label: "参数键名",
          key: "configKey_like",
          value: ""
        },
        {
          type: "select",
          label: "系统参数",
          options: this.getStatusOption("sys_yes_no"),
          key: "isSys",
          value: ""
        }
      ],
      columnTextPostion: {
        configName: "left"
      },
      columnWidths: {
        description: 400
      },
      columnSortabel: {
        configName: true,
        configKey: true,
        isSys: true
      },
      slotColumns: ["configName", "isSys"],
      tableHead: {
        configName: "参数名称",
        configKey: "参数键名",
        configValue: "参数键值",
        isSys: "系统参数"
      },
      tableData: [],
      pageNation: {
        configName: "",
        configKey_like: "",
        isSys: "",
        pageSize: 20,
        pageNo: 1,
        orderBy: "",
        total: 0
      },
      tableFit: true
    };
  },
  mounted() {
    this.init(this.pageNation);
  },
  methods: {
    showSearch(val) {
      this.showSearchVal = val;
    },
    handlerName(funcName) {
      this[funcName]();
    },
    initPage() {
      this.reload();
    },
    init(param) {
      // console.log(2222, param);
      sysApi.getConfig(param).then(res => {
        this.tableData = res.list;
        this.pageNation.total = res.count;
      });
    },
    /* 列表文本转义 */
    swichText(type, val, other) {
      return dictTypeMap(type, val, other);
    },
    /* 获取状态下拉框数据 */
    getStatusOption(type) {
      const selectTypeData = JSON.parse(
        sessionStorage.getItem("selectDicType")
      );
      return selectTypeData[type];
    },
    statusValChange(item) {
      this.searchBtn(item);
    },
    /* 获取填入输入框的值  */
    searchBtn(data = {}) {
      const valObj = Object.assign(
        this.pageNation,
        getInputVal(this.formInline)
      );
      this.init(valObj);
    },
    /* 清除输入框内的值 */
    resetForm() {
      clearFilterVal(this.formInline);
      this.pageNation.pageNo = 1;
      this.pageNation.configName = "";
      this.pageNation.configKey_like = "";
      this.pageNation.isSys = "";
      this.pageNation.orderBy = "";
      this.init(this.pageNation);
    },
    currentChange(val) {
      this.pageNation.pageNo = val;
      this.init(this.pageNation);
    },
    sortChange(sortVal) {
      this.pageNation.orderBy = sortVal;
      this.init(this.pageNation);
    },
    /* 编辑/新增下级表格 */
    menuEditAdd(row, type) {
      this.$refs.configEditPanel.show(row, type);
    },
    AddNew() {
      this.$refs.configEditPanel.show({}, "新增");
    },
    ClearAll() {
      sysApi.clearAll().then(res => {
        if (res.result === "true") {
          this.init(this.params);
          this.$message.success(res.message);
        } else {
          this.$message.waring(res.message);
        }
      });
    },
    deleteConfig(row) {
      this.$alertMsgBox("确认要删除该参数吗？", "信息")
        .then(() => {
          sysApi
            .deleteConfig({
              id: row.id
            })
            .then(res => {
              if (res.result === "true") {
                this.init(this.params);
                this.$message.success(res.message);
              } else {
                this.$message.waring(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    }
  }
};
</script>
<style lang="scss">
.tree-sort {
  margin: 0 auto;
  .el-input__inner {
    text-align: center;
    height: 20px;
    width: 80px;
  }
}
</style>
<style lang="scss" scoped>
.post {
  .current-type {
    height: 45px;
    line-height: 45px;
    // width: calc(100% -200px);
    // margin-right: 200px;
    border-bottom: 1px solid #eee;
  }
  .top-search {
    width: 100%;
    padding: 10px 10px 0;
  }
  .search {
    padding: 0 10px;
    // outline: 1px solid red;
  }
}
</style>
