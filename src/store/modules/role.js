import {
  pubApi
} from "@/api/public_request";
const state = {
  roleList: []
}
const mutations = {
  GET_ROLE_LIST: (state, data) => {
    state.roleList = data
  }
}
const actions = {
  getRole({
    commit
  }) {
    pubApi.getRoleMenuTree().then(res => {
      commit("GET_ROLE_LIST", res)
      // console.log(20, res);
    });
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
