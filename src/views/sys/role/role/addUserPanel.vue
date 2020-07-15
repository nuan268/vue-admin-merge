/*新增用户*/
<template>
  <div class="add-user-box">
    <DailogPanel
      :dialog-visible="showDailog"
      :title-name="titleName"
      :app-to-body="true"
      @closeDialog="closeDialog"
    >
      <template slot="content">
        <InputFliter
          :form-item="formInline"
          style="margin-bottom: 10px;"
          @searchBtn="searchBtn"
          @resetForm="resetForm"
        >
        </InputFliter>
        <el-row type="flex" :gutter="10">
          <el-col :span="18">
            <TableTree
              ref="tableDomTree"
              :table-head="tableHead"
              :table-data="tableData"
              :slot-columns="slotColumns"
              :page-nation="pageNation"
              @tableCheckBox="tableCheckBox"
              @currentChange="currentChange"
            >
              <template slot="chechbox">
                <el-table-column type="selection" width="40"></el-table-column>
              </template>
              <template slot="status" slot-scope="scope">
                <span
                  :style="[
                    { color: scope.row.status === '0' ? '#000' : '#f00' }
                  ]"
                >
                  {{ swichText("sys_search_status", scope.row.status, "") }}
                </span>
              </template>
            </TableTree>
          </el-col>
          <el-col :span="6">
            <div class="choosed-data">
              <div style="line-height:50px;">
                当前已选择{{ tableCheckBoxValue.length }}项:
              </div>
              <el-tag
                v-for="(tag, index) in tableCheckBoxValue"
                :key="index"
                style="margin: 0  10px 10px 0;"
                closable
                @close="handleClose(tag)"
              >
                {{ tag.loginCode }}
              </el-tag>
            </div>
          </el-col>
        </el-row>
      </template>
      <template slot="footer">
        <div
          style="text-align:right; border-top: 1px solid #eee; padding-top:10px;"
        >
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="saveBtn"
          >
            确定
          </el-button>
          <el-button icon="el-icon-close" size="mini" @click="colseBtn">
            关闭
          </el-button>
        </div>
      </template>
    </DailogPanel>
  </div>
</template>
<script>
import DailogPanel from "@/components/dailogPanel/frame";
import InputFliter from "@/components/inputFliter";
import TableTree from "@/components/tableTree";
import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
import { orgApi } from "@/api/organization";
import { roleApi } from "@/api/role";

export default {
  name: "",
  components: {
    DailogPanel,
    InputFliter,
    TableTree
  },
  data() {
    return {
      showDailog: false,
      titleName: "用户选择",
      pageNation: {
        total: null,
        pageNo: 1,
        pageSize: 20,
        ctrlPermi: 2,
        status: "0"
      },
      formInline: [
        {
          type: "input",
          value: "",
          key: "loginCode",
          label: "账号"
        },
        {
          type: "input",
          value: "",
          key: "userName",
          label: "昵称"
        },
        {
          type: "input",
          value: "",
          key: "emial",
          label: "邮箱"
        },
        {
          type: "input",
          value: "",
          key: "mobile",
          label: "手机"
        },
        {
          type: "input",
          value: "",
          key: "phone",
          label: "电话"
        }
      ],
      tableCheckBoxValue: [],
      slotColumns: ["status"],
      tableHead: {
        loginCode: "登录账号",
        userName: "用户昵称",
        email: "电子邮箱",
        mobile: "手机号码",
        phone: "办公电话",
        updateDate: "更新时间",
        status: "状态"
      },
      tableData: [],
      currentRow: {}
    };
  },
  methods: {
    show(row) {
      this.currentRow = row;
      this.init(this.pageNation);
      this.showDailog = true;
    },
    init(param) {
      orgApi.getUserList(param).then(res => {
        this.pageNation.total = res.count;
        this.tableData = res.list;
      });
    },
    /* 列表文本转义 */
    swichText(type, val, other) {
      return dictTypeMap(type, val, other);
      // console.log(99, dictTypeMap(type, val, other));
    },
    /* 获取填入输入框的值  */
    searchBtn() {
      // const temp = this.formInline.concat(this.moreFormItem);
      const valObj = getInputVal(this.formInline);
      const searchObj = Object.assign(valObj, this.pageNation);
      this.init(searchObj);
      console.log(searchObj);
    },
    tableCheckBox(row) {
      this.tableCheckBoxValue = row;
    },
    /* 取消已经选择tag */
    handleClose(tag) {
      const closedTag = this.tableCheckBoxValue.splice(
        this.tableCheckBoxValue.indexOf(tag),
        1
      );
      this.$refs.tableDomTree.cancleChecked(closedTag);
    },
    saveBtn() {
      const obj = {
        roleCode: this.currentRow.roleCode,
        userRoleString: []
      };
      const temp = this.tableCheckBoxValue;
      if (temp.length === 1) {
        obj.userRoleString = temp[0].id;
      }
      if (temp.length > 1) {
        const idArr = [];
        for (let i = 0, len = temp.length; i < len; i++) {
          idArr.push(temp[i].id);
        }
        obj.userRoleString = idArr;
      }
      roleApi.saveAuthUser(obj).then(res => {
        if (res.result === "true") {
          this.$message.success(res.message);
          this.closeDialog();
          this.$emit("reloadPage");
        } else {
          this.$message.error(res.message);
        }
      });
      console.log(this.tableCheckBoxValue);
    },
    currentChange(val) {
      console.log(220, this.pageNation.stauts);
      this.pageNation.pageNo = val;
      this.init(this.pageNation);
    },
    colseBtn() {
      this.closeDialog();
    },
    // 关闭对话框选择
    closeDialog() {
      this.resetForm();
      this.showDailog = false;
    },
    /* 清除输入框内的值 */
    resetForm() {
      this.pageNo = 1;
      this.init(this.pageNation);
      clearFilterVal(this.formInline);
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
