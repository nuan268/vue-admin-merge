/**
 * 组织机构
 * **/
import httpRequestor from './http_requestor'
import {
  Message
} from 'element-ui'
/**
 * 用户管理
 * **/
export const orgApi = {
  //  获取用户列表
  getUserList: (param) => {
    return httpRequestor.get(`/a/sys/empUser/listData`, param).catch(err => {
      Message.error(err)
    })
  },
  getInstitutionMenuTree: (param) => {
    return httpRequestor.get('a/sys/office/treeData', param).catch(err => {
      Message.error(err)
    })
  },
  getCompanyMenuTree: (param) => {
    return httpRequestor.get('a/sys/company/treeData', param).catch(err => {
      Message.error(err)
    })
  },
  getEmployeePosts: (param) => {
    return httpRequestor.get('a/sys/post/treeData', param).catch(err => {
      Message.error(err)
    })
  },
  //   新增用户
  addNewUser: (param) => {
    // postFormData
    return httpRequestor.post(`/a/sys/empUser/save?op=${param.op}`, param).catch(err => {
      // return httpRequestor.postByFormStr('/a/sys/empUser/save', param).catch(err => {
      Message.error(err)
    })
  },
  // 获取用户编辑详情
  getUserDetail: (param) => {
    return httpRequestor.get('/a/sys/empUser/form.json', param).catch(err => {
      Message.error(err)
    })
  },
  // 获取数据权限详情 userCode
  getDataRightDetail: (param) => {
    return httpRequestor.get(`/a/sys/empUser/formAuthDataScope.form.json?userCode=${param.userCode}`).catch(err => {
      Message.error(err)
    })
  },
  // 保存数据权限 http://demo.jeesite.com/js/a/sys/empUser/saveAuthDataScope
  saveDataRightDetail: (param) => {
    return httpRequestor.postFormData(`/a/sys/empUser/saveAuthDataScope.form.json`, param).catch(err => {
      Message.error(err)
    })
  },
  // 停用启用用户  js/a/sys/empUser/disable?userCode=user19_92w0
  stopUseOrStart: (param) => {
    return httpRequestor.post(`/a/sys/empUser/${param.stopOrStart}?userCode=${param.userCode}`, {
      userCode: param.userCode
    }).catch(err => {
      Message.error(err)
    })
  },
  /* 删除用户  userCode*/
  deleteUser: (param) => {
    return httpRequestor.post(`a/sys/empUser/delete?userCode=${param}`).catch(err => {
      Message.error(err)
    })
  },
  /* 保存用户角色 */
  saveUserRole: (param) => {
    return httpRequestor.postFormData(`/a/sys/empUser/save`, param).catch(err => {
      Message.error(err)
    })
  },
  /* 重置密码到初始状态  userCode=user18_rcn8*/
  resetPw: (param) => {
    return httpRequestor.postFormData(`/a/sys/empUser/resetpwd?userCode=${param.userCode}`).catch(err => {
      Message.error(err)
    })
  },
  /**
   * 机构管理
   * **/
  //  获取机构列表
  getOfficeList: (param) => {
    return httpRequestor.get(`/a/sys/office/listData`, param).catch(err => {
      Message.error(err)
    })
  },
  /* 懒加载表格中的子菜单 */
  getChildList: (param) => {
    return httpRequestor.get(`/a/sys/office/listData`, param).catch(err => {
      Message.error(err)
    })
  },
  /* 保存机构管理  postFormData  sys/office/save*/
  saveOfficeAdd: (param) => {
    return httpRequestor.post(`/a/sys/office/save`, param).catch(err => {
      Message.error(err)
    })
  },
  /* 获取机构编辑详情*/
  getOfficeDetail: (param) => {
    return httpRequestor.post(`/a/sys/office/form.json?officeCode=${param.officeCode}`).catch(err => {
      Message.error(err)
    })
  },

  /* 启用停用 */
  stopOfficeOrStart: (param) => {
    return httpRequestor.post(`/a/sys/office/${param.type}?officeCode=${param.officeCode}`).catch(err => {
      Message.error(err)
    })
  },
  /* 删除机构和子机构  formDataSt*/
  deleteOffice: (param) => {
    return httpRequestor.post(`/a/sys/office/delete?officeCode=${param.officeCode}`).catch(err => {
      Message.error(err)
    })
  },
  /* 公司管理*/
  /* 获取公司管理列表*/
  getCompanyList: (param) => {
    return httpRequestor.postFormData(`/a/sys/company/listData`, param).catch(err => {
      Message.error(err)
    })
  },
  /* 停用或启用公司管理列表*/
  setCompanyStart: (param) => {
    return httpRequestor.post(`/a/sys/company/${param.type}?companyCode=${param.companyCode}`, param).catch(err => {
      Message.error(err)
    })
  },
  /* 删除公司管理列表*/
  deleteCompany: (param) => {
    return httpRequestor.post(`/a/sys/company/delete?companyCode=${param.companyCode}`, param).catch(err => {
      Message.error(err)
    })
  },

  /* 新增公司管理列表*/
  addCompany: (param) => {
    return httpRequestor.postFormData(`/a/sys/company/save`, param).catch(err => {
      Message.error(err)
    })
  },
  /* top 初始化公司新增*/
  addInit: (param) => {
    return httpRequestor.get(`/a/sys/company/form.json`, param).catch(err => {
      Message.error(err)
    })
  },
  /* 编辑/新增  当前/下级公司 获取初始化数据*/
  addEditInit: (param) => {
    return httpRequestor.get(`/a/sys/company/form.json?${param.key}=${param.val}`).catch(err => {
      Message.error(err)
    })
  },
  /* 初始化岗位管理*/
  getPostList: (param) => {
    return httpRequestor.postFormData(`/a/sys/post/listData`, param).catch(err => {
      Message.error(err)
    })
  },
  /* 初始化岗位管理编辑*/
  getPostEdit: (param) => {
    return httpRequestor.get(`/a/sys/post/form.json?${param.key}=${param.val}`).catch(err => {
      Message.error(err)
    })
  },
  /* 初始化新增岗位管*/
  getPostAdd: (param) => {
    return httpRequestor.get(`/a/sys/post/form.json`).catch(err => {
      Message.error(err)
    })
  },
  /* 初始化新增岗位管*/
  deletePost: (param) => {
    return httpRequestor.post(`/a/sys/post/delete?postCode=${param.postCode}`).catch(err => {
      Message.error(err)
    })
  },
  /* 保存编辑结果*/
  saveEdit: (param) => {
    return httpRequestor.postFormData(`/a/sys/post/save`, param).catch(err => {
      Message.error(err)
    })
  },
  /* 初始化新增岗位管*/
  stopUsePost: (param) => {
    return httpRequestor.post(`/a/sys/post/${param.stopOrStart}?postCode=${param.postCode}`).catch(err => {
      Message.error(err)
    })
  }
};
