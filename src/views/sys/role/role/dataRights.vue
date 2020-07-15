<template>
  <div class="assign-role-panel">
    <DailogFrame
      :dialog-visible="showAssginRole"
      :title-name="'角色分配数据权限'"
      @closeDialog="colseAssignRole"
    >
      <template slot="content">
        <div>
          <el-form
            ref="roleForm"
            :model="roleForm"
            label-width="120px"
            class="demo-ruleForm"
            size="mini"
            :rules="rules"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="角色名称：" prop="roleName">
                  <el-input v-model="roleForm.roleName" :disabled="true">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色编码：" prop="roleCode">
                  <el-input v-model="roleForm.roleCode" :disabled="true">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="数据范围：" prop="roleCode">
                  <i
                    class="el-icon-question"
                    style="margin-right:10px"
                    title="指定数据权限范围类型，多个角色同时指定，之间为或者关系"
                  ></i>
                  <el-radio
                    v-for="(item, index) in radioArr"
                    :key="index"
                    v-model="roleForm.dataScope"
                    :label="item.value"
                    @change="change"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="控制业务范围：" prop="userAlias">
                  <i
                    class="el-icon-question"
                    style="margin-right:10px"
                    title="在 addFilter 权限过滤的时候指定适应的业务范围，不指定代表所有生效，如：有的功能看本部门，有的功能看本公司；新的业务范围从字典 sys_role_biz_scope 类型添加。"
                  ></i>
                  <div style="width: calc(100% - 30px); display: inline-block;">
                    <el-select v-model="roleForm.bizScope" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.dictLabel"
                        :value="item.dictValue"
                        :disabled="item.disabled"
                      >
                      </el-option>
                    </el-select>

                    <!-- <el-input v-model="roleForm.bizScope"> </el-input> -->
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <ColumnBar
            v-show="selfChoose"
            :column-text="'授权数据权限'"
          ></ColumnBar>
          <MenuRights
            v-show="selfChoose"
            ref="menuRights"
            :t-name1="'机构公司'"
            :t-name2="'公司权限'"
            :menu-tree1="menuTree1"
            :menu-tree2="menuTree2"
            :checked-memu1="checkedMemu1"
            :checked-memu2="checkedMemu2"
            @checkTree="checkTree"
          ></MenuRights>
        </div>
      </template>
      <template slot="footer">
        <div style="text-indent: 100px;">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="saveAssignRole('userForm')"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            size="mini"
            @click="colseAssignRole('userForm')"
          >
            关闭
          </el-button>
        </div>
      </template>
    </DailogFrame>
  </div>
</template>
<script>
// import { } from "module";
import ColumnBar from "@/components/commonColumn";
import DailogFrame from "@/components/dailogPanel/frame";
import MenuRights from "@/components/menuRights";
import { roleApi } from "@/api/role";
import { toTreeData } from "@/utils/pubFunc";
import { pubApi } from "@/api/public_request";
export default {
  name: "AssignRole",
  components: {
    DailogFrame,
    ColumnBar,
    MenuRights
  },
  // computed: {
  //   checkedVals: {
  //     get() {
  //       return this.checkedMemu1;
  //     },
  //     set(val) {
  //       this.roleMenuListJson = val;
  //       console.log(143, val);
  //     }
  //   }
  // },
  data() {
    return {
      showAssginRole: false,
      roleForm: {
        roleName: "",
        roleCode: "",
        dataScope: "",
        bizScope: "" // 控制业务范围
      },
      radioArr: [
        {
          label: "未设置",
          value: "0"
        },
        {
          label: "全部数据",
          value: "1"
        },
        {
          label: "自定义数据",
          value: "2"
        },
        {
          label: "本部门数据",
          value: "3"
        },
        {
          label: "本公司数据",
          value: "4"
        },
        {
          label: "本部门和本公司数据",
          value: "5"
        }
      ],
      tableCheckBoxValue: [],
      rules: {
        roleName: [{ required: true }],
        roleCode: [{ required: true }],
        dataScope: [{ required: true }]
      },
      tableHead: {
        roleName: "角色名称",
        roleCode: "角色编码"
      },
      tableData: [
        {
          roleName: "系统管理员",
          roleCode: "corpAdmin"
        },
        {
          roleName: "业务演示角色",
          roleCode: "demo"
        },
        {
          roleName: "部门经理",
          roleCode: "dept"
        },
        {
          roleName: "普通员工",
          roleCode: "user"
        }
      ],
      options: [],
      menuTree1: [],
      menuTree2: [],
      checkedMemu1: [],
      checkedMemu2: [],
      selfChoose: false,
      checkedMemuMap1: [], // 保存到数据库
      checkedMemuMap2: [] // 保存到数据库
    };
  },
  mounted() {},
  methods: {
    init(row) {
      console.log(99, row);
      this.getOffice();
      this.getCompany();
      this.dictTypeFunc();
      this.getAuthDataScope(row);
    },
    dictTypeFunc() {
      pubApi
        .dictTypeFunc({
          dictLabelOrig: "",
          dictValue: "",
          dictType: "sys_role_biz_scope",
          isSys: "",
          status: "",
          pageNo: "",
          pageSize: "",
          orderBy: ""
        })
        .then(res => {
          this.options = res;
        });
    },
    // 获取授权 机构树初始化
    getOffice() {
      roleApi.getOffice({ ctrlPermi: 2 }).then(res => {
        const attributes = {
          id: "id",
          parentId: "pId",
          label: "title",
          rootId: "0"
        };
        this.menuTree1 = toTreeData(res, attributes);
        // console.log(197, res);
      });
    },
    // 获取授权 公司树初始化
    getCompany() {
      roleApi.getCompany({ ctrlPermi: 2 }).then(res => {
        const attributes = {
          id: "id",
          parentId: "pId",
          label: "title",
          rootId: "0"
        };
        this.menuTree2 = toTreeData(res, attributes);
      });
    },
    // 获取授权 数据权限初始化
    getAuthDataScope(row) {
      roleApi.getAuthDataScope({ roleCode: row.roleCode }).then(res => {
        // console.log("res.role", res.role.dataScope);
        if (res.role.dataScope === "2") {
          this.selfChoose = true;
        } else {
          this.selfChoose = false;
        }
        const tree1 = [];
        const tree2 = [];
        // 树的回显
        for (let i = 0, len = res.roleDataScopeList.length; i < len; i++) {
          // {isNewRecord: false, id: "corpAdmin#Office#0_CDSD02001#1", ctrlType: "Office", ctrlPermi: "1", ctrlData: "0_CDSD02001", …}
          if (res.roleDataScopeList[i].ctrlType === "Office") {
            tree1.push(res.roleDataScopeList[i].ctrlData);
          }
          if (res.roleDataScopeList[i].ctrlType === "Company") {
            tree2.push(res.roleDataScopeList[i].ctrlData);
          }
        }
        this.checkedMemu1 = tree1;
        this.checkedMemu2 = tree2;
        this.roleForm = res.role;
        this.checkTree({
          current: 1,
          val: tree1
        });
        this.checkTree({
          current: 2,
          val: tree2
        });
        this.showAssginRole = true;
        this.$nextTick(() => {
          this.$refs.menuRights.setDefaultChecked1(tree1);
          this.$refs.menuRights.setDefaultChecked2(tree2);
        });
        console.log("tree1, tree2", tree1, tree2);
      });
    },
    change(val) {
      if (val === "2") {
        this.selfChoose = true;
      } else {
        this.selfChoose = false;
      }
    },
    /* 保存 */
    saveAssignRole() {
      const obj = {
        oldRoleName: this.roleForm.roleName,
        roleName: this.roleForm.roleName,
        isNewRecord: false,
        roleCode: this.roleForm.roleCode,
        dataScope: this.roleForm.dataScope,
        "!bizScope": "",
        bizScope: this.roleForm.bizScope,
        roleDataScopeListJson: []
      };
      if (this.roleForm.dataScope === "2") {
        if (
          this.checkedMemuMap1.length > 0 &&
          this.checkedMemuMap2.length === 0
        ) {
          obj.roleDataScopeListJson = JSON.stringify(this.checkedMemuMap1);
        }
        if (this.checkedMemuMap2.length && this.checkedMemuMap1.length === 0) {
          obj.roleDataScopeListJson = JSON.stringify(this.checkedMemuMap2);
        }
        if (
          this.checkedMemuMap1.length > 0 &&
          this.checkedMemuMap2.length > 0
        ) {
          obj.roleDataScopeListJson = JSON.stringify(
            this.checkedMemuMap1.concat(this.checkedMemuMap2)
          );
        }
      }
      // console.log(888, obj.roleDataScopeListJson);
      roleApi.saveAuthDataScope(obj).then(res => {
        if (res.result === "true") {
          this.$message.success(res.message);
          this.colseAssignRole();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    colseAssignRole(formName) {
      this.showAssginRole = false;
      this.checkedMemu1 = [];
      this.checkedMemu2 = [];
      this.checkedMemuMap1 = [];
      this.checkedMemuMap2 = [];
    },
    // 复选框 点击变化后
    checkTree(param) {
      // {"ctrlType":"Company","ctrlData":"YD"}
      if (param.current === 1 && param.val.length > 0) {
        this.checkedMemuMap1 = [];
        for (let i = 0, len = param.val.length; i < len; i++) {
          this.checkedMemuMap1.push({
            ctrlType: "Office",
            ctrlData: param.val[i]
          });
        }
      }
      if (param.current === 2 && param.val.length > 0) {
        this.checkedMemuMap2 = [];
        for (let i = 0, len = param.val.length; i < len; i++) {
          this.checkedMemuMap2.push({
            ctrlType: "Company",
            ctrlData: param.val[i]
          });
        }
      }
      // console.log(param);
    }
  }
};
</script>
<style lang="scss" scoped>
.assign-role-panel {
}
</style>
