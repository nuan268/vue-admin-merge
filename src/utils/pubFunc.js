/**
 * 获取已填输入框内容
 * parama: inputValue  输入框里的值
 * ***/
import store from '@/store'
export const getInputVal = (inputValue) => {
  const valObj = {}
  for (let i = 0, len = inputValue.length; i < len; i++) {
    if (inputValue[i].value) {
      valObj[inputValue[i].key] = inputValue[i].value;
    }
  }
  return valObj
}

/**
 * 清除已填输入框内容
 * parama: filterForm  筛选栏目
 * ***/
export const clearFilterVal = (filterForm) => {
  for (let i = 0, len = filterForm.length; i < len; i++) {
    if (filterForm[i].value) {
      filterForm[i].value = "";
    }
  }
  return filterForm
}
/**
 * 过滤掉无值对象属性
 * parama: filterForm  筛选栏目
 * ***/
export const filterNokeyVal = (obj) => {
  const result = {}
  for (const key in obj) {
    if (obj[key]) {
      result[key] = obj[key]
    }
  }
  return result
}
/**
 * 取数组中某个属性成字符串
 * parama: arr被遍历的数据  key被字符串化的键名
 * ***/
export const stringVal = (arr, key) => {
  const result = []
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i][key]) {
      result.push(arr[i][key])
    }
  }
  return result.join(',')
}

/**
 * 扩展字段创建
 * parama: filterForm  筛选栏目
 * ***/
export const createKey = (keyType, count, type) => {
  const arrKey = [];
  for (let i = 0; i < count; i++) {
    arrKey.push({
      lable: [keyType + (i + 1)],
      value: "",
      type: type
    });
  }
  return arrKey;
}
/**
 * 状态值映射
 *
 * ***/
export const statusMap = (arr, obj) => {
  const temp = JSON.parse(JSON.stringify(arr));
  for (let i = 0, len = temp.length; i < len; i++) {
    if (temp[i].hasOwnProperty("status")) {
      temp[i].statusText = obj[temp[i].status];
    }
  }
  return temp;
}

/**
 * 树形数据 结构重组 处理
 *
 * ***/
export const toTreeData = (data, attributes) => {
  // console.log("data, attributes", data, attributes);
  /* **
  //调用
  // const attributes = {
  //   id: "id",
  //   parentId: "pId",
  //   label: "name",
  //   rootId: "0"
  // };
  // const treeData = toTreeData(res, attributes);
  */

  const resData = data;
  const tree = [];
  for (let i = 0; i < resData.length; i++) {
    if (resData[i].pId === attributes.rootId) {
      const obj = {
        id: resData[i][attributes.id],
        label: resData[i][attributes.label],
        children: []
      };
      tree.push(obj);
      resData.splice(i, 1);
      i--;
    }
  }
  run(tree);

  function run(chiArr) {
    if (resData.length !== 0) {
      for (let i = 0; i < chiArr.length; i++) {
        for (let j = 0; j < resData.length; j++) {
          if (chiArr[i].id === resData[j][attributes.parentId]) {
            const obj = {
              id: resData[j][attributes.id],
              label: resData[j][attributes.label],
              children: []
            };
            chiArr[i].children.push(obj);
            resData.splice(j, 1);
            j--;
          }
        }
        run(chiArr[i].children);
      }
    }
  }

  return tree;
}
/**
 * form 扩展字段编辑对应值设置
 *
 * ***/
export const formExtendMap = (target, source) => {
  // console.log(target)
  for (const key in source) {
    if (source[key]) {
      target[key] = key
    }
  }
  return target;
}
/**
 * form 扩展字段清空
 *
 * ***/
export const formExtendClear = (target) => {
  for (const key in target) {
    if (target[key]) {
      target[key] = ""
    }
  }
  return target;
}
/**
 * 匹配字典数据类型
 *
 * ***/
export const dictTypeMap = (type, val, other) => {
  // console.log(168, JSON.parse(sessionStorage.getItem("allDicType")))
  var result = ""
  if (val === 'none' || !val) {
    return other
  } else {
    const dictTypeData = JSON.parse(sessionStorage.getItem("allDicType"));
    result = dictTypeData[type].filter((item) => {
      // console.log(66, item)
      if (item[val]) {
        return item[val]
      }
    })
    return result[0][val]
  }
  // console.log(77, result[0][val])

  // const dictType = {
  //   batch_template_states: "批记录模板状态",
  //   batch_unit: "批用单位",
  //   bpm_biz_status: "流程业务状态",
  //   bpm_def_status: "流程定义状态",
  //   bpm_deviation_type: "偏差分类",
  //   bpm_event_type: "流程事件类型",
  //   bpm_form_type: "流程表单类型",
  //   bpm_ins_status: "流程实例状态",
  //   bpm_material_type: "物料类型",
  //   bpm_script_lang: "流程脚本语言,",
  //   bpm_script_type: "流程脚本类型",
  //   bpm_task_priority: "流程任务优先级",
  //   bpm_task_status: "流程任务状态",
  //   bpm_warehouse_type: "车间仓库类型",
  //   calculation_type: "计算方式",
  //   deviation_cls: "偏差分级",
  //   deviation_level: "偏差级别",
  //   deviation_preference: "偏差调查-根本原因类别",
  //   device_type: "设备类型",
  //   filemanager_group_type: "文件组类型",
  //   floor_layer: "楼层",
  //   home_use: "房间用途",
  //   influence: "影响",
  //   maintain_plan: "维护项目类别",
  //   manage_type: "管理类别",
  //   material_code: "物资编码",
  //   msg_inner_content_level: "内容级别",
  //   msg_inner_content_type: "内容类型",
  //   msg_inner_msg_status: "消息状态",
  //   msg_inner_receiver_type: "接受类型",
  //   notInUseful: "不在效期内",
  //   pass_somewhere: "安装位置",
  //   process_type: "工序类型",
  //   product_code: "产品代号",
  //   product_factory: "生产厂家",
  //   relevant_org: "相关部门",
  //   sys_area_type: "区域类型",
  //   sys_device_type: "客户端设备类型",
  //   sys_job_event: "作业任务事件",
  //   sys_job_group: "作业分组",
  //   sys_job_misfire_instruction: "作业错过策略",
  //   sys_job_status: "作业状态",
  //   sys_job_type: "作业任务类型",
  //   sys_lang_type: "国际化语言类型",
  //   sys_log_type: "日志类型",
  //   sys_menu_sys_code: "菜单归属系统",
  //   sys_menu_type: "菜单类型",
  //   sys_menu_weight: "菜单权重",
  //   sys_msg_push_status: "推送状态",
  //   sys_msg_read_status: "读取状态",
  //   sys_msg_type: "消息类型",
  //   sys_office_type: "机构类型",
  //   sys_post_type: "岗位分类",
  //   sys_role_biz_scope: "角色业务范围",
  //   sys_role_data_scope: "角色数据范围",
  //   sys_role_type: "角色分类",
  //   sys_search_status: "查询状态", // 所有状态通用
  //   sys_show_hide: "显示隐藏",
  //   sys_status: "状态",
  //   sys_user_sex: "用户性别",
  //   sys_user_status: "用户状态",
  //   sys_user_type: "用户类型",
  //   sys_yes_no: "是否",
  //   terminal_type: "终端类型",
  //   use_department: "使用部门",
  //   verification_type: "验证类型",
  //   wf_frm_sort: "表单类别",
  //   wf_frm_type: "表单类型"
  // }
}
/*  */
export const resetVal = (arr, ctrlType) => {
  const result = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    result.push({
      ctrlType,
      ctrlData: arr[i].id ? arr[i].id : arr[i]
    });
  }
  return result;
}
