/* 页面需要多处公用的store 状态 */
import {
  pubApi
} from "@/api/public_request";
import {
  toTreeData
} from "@/utils/pubFunc";

const state = {
  officeList: [],
  officeListOrg: [],
  companyList: [],
  companyListOrg: [],
  employeePosts: [],
  leftMenuList: [],
  allDicType: "",
  selectDicType: ""
}
const mutations = {
  GET_OFFICE_TREE_LIST: (state, data) => {
    // state.officeList = data
    const attributes = {
      id: "id",
      parentId: "pId",
      label: "name",
      rootId: "0"
    };
    const officeList = toTreeData(data, attributes)
    sessionStorage.setItem('officeList', JSON.stringify(officeList))
  },
  GET_COMPANY_TREE_LIST: (state, data) => {
    // state.companyList = data
    const attributes = {
      id: "id",
      parentId: "pId",
      label: "name",
      rootId: "YD"
    };
    const companyList = toTreeData(data, attributes)
    sessionStorage.setItem('companyList', JSON.stringify(companyList))
    sessionStorage.setItem('companyListOrg', JSON.stringify(data))
  },
  GET_EMPLOYEE_POSTS_LIST: (state, data) => {
    state.employeePosts = data
  },
  GET_ALL_DIC_TYPE: (state, res) => {
    const obj = {}
    const selectObj = {}
    for (let i = 0, len = res.length; i < len; i++) {
      if (!obj[res[i].dictType]) {
        obj[res[i].dictType] = []
        obj[res[i].dictType].push({
          [res[i].dictValue]: res[i].dictLabel
        })
      } else {
        obj[res[i].dictType].push({
          [res[i].dictValue]: res[i].dictLabel
        })
      }
      if (!selectObj[res[i].dictType]) {
        selectObj[res[i].dictType] = []
        selectObj[res[i].dictType].push({
          value: res[i].dictValue,
          label: res[i].dictLabel
        })
      } else {
        selectObj[res[i].dictType].push({
          value: res[i].dictValue,
          label: res[i].dictLabel
        })
      }
    }
    /* 用于table表格 显示中文字符 */
    sessionStorage.setItem('allDicType', JSON.stringify(obj))
    /* 用于下拉选择框 数据 */
    sessionStorage.setItem('selectDicType', JSON.stringify(selectObj))
    // state.allDicType = data
  },
  GET_LEFT_MENU_TREE: (state, data) => {
    // state.officeList = data
    sessionStorage.setItem('leftMenuList', data)
  }
}
const actions = {
  /* 获取机构全部数据 */
  getOfficeMenuTree({
    commit
  }) {
    pubApi.getOfficeMenuTree().then(res => {
      commit("GET_OFFICE_TREE_LIST", res)
    });
  },
  /* 获取公司全部数据 */
  getCompanyMenuTree({
    commit
  }) {
    pubApi.getCompanyMenuTree().then(res => {
      // console.log('GET_COMPANY_TREE_LIST', res);
      commit("GET_COMPANY_TREE_LIST", res)
    });
  },
  /* 获取岗位全部数据 */
  getEmployeePosts({
    commit
  }) {
    pubApi.getEmployeePosts().then(res => {
      commit("GET_EMPLOYEE_POSTS_LIST", res)
      console.log('GET_EMPLOYEE_POSTS_LIST', res);
    });
  },
  /* 获取字典全部数据 */
  getAllDicType({
    commit
  }) {
    pubApi.dictTypeFunc().then(res => {
      commit("GET_ALL_DIC_TYPE", res)
      console.log(82, res)
    })
  },
  getLeftMenuTree({
    commit
  }) {
    pubApi.getLeftMenuTree().then(res => {
      commit("GET_LEFT_MENU_TREE", res)
    });
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
