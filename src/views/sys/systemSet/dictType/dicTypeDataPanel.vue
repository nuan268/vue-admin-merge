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
          :show-page="false"
          @requstLazyLoad="requstLazyLoad"
        >
          <template slot="dictLabel" slot-scope="scope">
            <span
              class=" tl"
              :class="scope.row.dictLabel == '紧急' ? 'r-btn' : 'td-color'"
              @click="AddNewSub(scope.row, '编辑')"
            >
              {{ scope.row.dictLabel }}
            </span>
          </template>
          <template slot="dictType" slot-scope="scope">
            {{ scope.row.dictType }}
          </template>
          <template slot="isSys" slot-scope="scope">
            {{ swichText("sys_yes_no", scope.row.isSys, "未安装") }}
          </template>

          <template slot="status" slot-scope="scope">
            <span v-if="scope.row.status === '0'">
              {{ swichText("sys_status", scope.row.status, "未设置") }}
            </span>
            <span v-else class="r-btn">
              {{ swichText("sys_status", scope.row.status, "未设置") }}
            </span>
          </template>
          <template slot="operate">
            <el-table-column
              fixed="right"
              label="操作"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="AddNewSub(scope.row, '编辑')"
                >
                  <i class="el-icon-edit" title="编辑菜单"></i>
                </el-button>

                <!-- 正常使用中0，已被停用2 -->
                <el-button
                  type="text"
                  size="small"
                  @click="setDictDataStart(scope.row)"
                >
                  <i
                    :class="[
                      scope.row.status === '0'
                        ? 'el-icon-video-pause'
                        : 'el-icon-circle-check'
                    ]"
                    :style="{
                      color: [scope.row.status === '0' ? '#f00' : '#69aa46']
                    }"
                    :title="
                      scope.row.status === '0' ? '停用字典类型' : '启用字典类型'
                    "
                  ></i>
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="deleteDictData(scope.row)"
                >
                  <i
                    style="color:red;"
                    class="el-icon-delete"
                    title="删除字典类型"
                  ></i>
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="AddNewSub(scope.row, '新增下级')"
                >
                  <i class="fa fa-plus-square" title="新增字典数据"></i>
                </el-button>
              </template>
            </el-table-column>
          </template>
        </TableTree>
        <AddDictTypeData ref="addDictTypeDataPanel"></AddDictTypeData>
      </template>
    </DailogPanel>
  </div>
</template>
<script>
import DailogPanel from "@/components/dailogPanel/frame";
import TableTree from "@/components/tableTree";
import InputFilter from "@/components/inputFliter";
import TopBtns from "@/components/componentBtns/topBtns/baseBtn";
import AddDictTypeData from "./addDictTypeData.vue";
import { sysApi } from "@/api/systemSet";
import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
// import { returnReg } from "@/utils/validate";

export default {
  name: "DictTypePanel",
  inject: ["reload"],
  components: {
    TableTree,
    InputFilter,
    TopBtns,
    DailogPanel,
    AddDictTypeData
  },
  data() {
    return {
      tableFit: true,
      showDailog: false,
      titleName: "字典数据",
      editModel: "E",
      showSearchVal: false,
      leftMg: {
        icon: "fa fa-fw icon-social-dropbox",
        text: "字典数据",
        dictType: ""
      },
      btnArr: [
        {
          handlerName: "View",
          btnText: "查询",
          class: "fa fa-search"
        },
        {
          handlerName: "Reload",
          btnText: "刷新",
          class: "fa fa-refresh"
        },
        {
          handlerName: "Expand",
          btnText: "展开",
          class: "fa fa-angle-double-down"
        },
        {
          handlerName: "Folding",
          btnText: "折叠",
          class: "fa fa-angle-double-down"
        },
        {
          handlerName: "AddNew",
          btnText: "新增",
          class: "fa fa-plus"
        }
      ],
      formInline: [
        {
          type: "input",
          label: "字典标签",
          key: "dictLabelOrig",
          value: ""
        },
        {
          type: "input",
          label: "字典键值",
          key: "dictValue",
          value: ""
        },
        {
          type: "select",
          label: "系统内置",
          key: "isSys",
          options: this.getStatusOption("sys_yes_no"),
          value: ""
        },
        {
          type: "select",
          label: "状态",
          options: this.getStatusOption("sys_search_status"),
          key: "status",
          value: ""
        }
      ],
      searchVal: {
        dictLabelOrig: "",
        dictValue: "",
        dictType: "",
        isSys: "",
        status: "",
        pageNo: "",
        pageSize: "",
        orderBy: ""
      },
      columnTextPostion: {
        dictLabel: "left",
        dictValue: "left"
      },
      columnWidths: {
        isSys: 100,
        treeSort: 80,
        status: 80
      },
      slotColumns: ["dictLabel", "isSys", "status"],
      tableHead: {
        dictLabel: "字典标签",
        dictValue: "字典键值",
        treeSort: "排序号",
        isSys: "系统内置",
        updateDate: "更新时间",
        remarks: "备注信息",
        status: "状态" // 1 菜单 2权限
      },
      tableData: []
    };
  },
  methods: {
    show(row) {
      // console.log(222, row);
      this.leftMg.dictType = row.dictType;
      this.searchVal.dictType = row.dictType;
      this.initDictType(this.searchVal);
    },
    /* 获取初始化页面数据 */
    initDictType(row) {
      this.tableData = [];
      sysApi.getDictTypeList(row).then(res => {
        for (let i = 0, len = res.length; i < len; i++) {
          if (res[i].isTreeLeaf === false) {
            res[i].hasChildren = true;
          }
        }
        this.tableData = res;
        this.showDailog = true;
      });
    },
    // tree 懒加载
    requstLazyLoad(param) {
      // console.log(204, param);
      const obj = {
        nodeid: param.tree.id,
        parentCode: param.tree.id,
        parentid: param.tree.parentCode,
        _search: false,
        pageSize: "",
        pageNo: 1
      };
      sysApi.getDictTypeList(obj).then(res => {
        for (let i = 0, len = res.length; i < len; i++) {
          if (!res[i].isTreeLeaf) {
            res[i].hasChildren = true;
          }
        }
        param.resolve(res);
      });
    },
    initPage() {
      /* reload 的是整个单页 而不是这个组件 */
      this.initDictType(this.searchVal);
    },
    AddNewSub(row, type) {
      // console.log(294, row, type);
      this.$refs.addDictTypeDataPanel.show(row, type);
    },
    AddNew() {
      this.AddNewSub({ dictType: this.searchVal.dictType }, "新增");
    },
    setDictDataStart(row) {
      const typeText = row.isLoader ? "停用" : "启用";
      this.$alertMsgBox(`确认要${typeText}该字典数据吗?`, "信息")
        .then(() => {
          sysApi
            .setDictDataStart({
              type: row.status === "0" ? "disable" : "enable",
              dictCode: row.dictCode
            })
            .then(res => {
              if (res.result === "true") {
                this.$message.success(res.message);
                this.initDictType(this.searchVal);
              } else {
                this.$message.waring(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    deleteDictData(row) {
      this.$alertMsgBox("确认要删除该字典数据吗？", "信息")
        .then(() => {
          sysApi
            .deleteDictData({
              id: row.id
            })
            .then(res => {
              if (res.result === "true") {
                this.initDictType(this.searchVal);
                this.$message.success(res.message);
              } else {
                this.$message.waring(res.message);
              }
            });
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    showSearch(val) {
      this.showSearchVal = val;
    },
    handlerName(funcName) {
      this[funcName]();
    },
    statusValChange(item) {
      this.searchBtn(item);
    },
    /* 获取填入输入框的值  */
    searchBtn(data = {}) {
      const valObj = Object.assign(
        this.searchVal,
        getInputVal(this.formInline)
      );
      this.initDictType(valObj);
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

    colseBtn() {
      this.closeDialog();
    },
    // 关闭对话框选择
    closeDialog() {
      this.resetForm();
      this.searchVal.dictType = "";
      this.showDailog = false;
    },
    /* 清除输表单里的值 */
    resetForm() {
      clearFilterVal(this.formInline);
      this.searchVal.dictLabelOrig = "";
      this.searchVal.dictValue = "";
      // this.searchVal.dictType = "";
      this.searchVal.isSys = "";
      this.searchVal.status = "";
      this.searchVal.isSys = "";
      this.searchVal.orderBy = "";
    }
  }
};
</script>
<style lang="scss" scoped></style>
