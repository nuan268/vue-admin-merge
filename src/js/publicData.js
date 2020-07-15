import {
  pubApi
} from "@/api/public_request";
import {
  toTreeData
} from "@/utils/pubFunc";

/* 获取机构数据 office async await*/
export const getOffceList = (param) => {
  return new Promise((resolve, reject) => {
    pubApi.getOfficeMenuTree().then(res => {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      const c = toTreeData(res, attributes)
      resolve(c);
    })
  });
}


export const getCompanyList = (param) => {
  return new Promise((resolve, reject) => {
    pubApi.getCompanyMenuTree().then(res => {
      const attributes = {
        id: "id",
        parentId: "pId",
        label: "name",
        rootId: "0"
      };
      const c = toTreeData(res, attributes)
      resolve(c);
    })
  });
}
