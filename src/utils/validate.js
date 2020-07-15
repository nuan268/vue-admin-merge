/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export const returnReg = (type) => {
  const regArr = {
    name: /^.{1,10}$/, // 姓名
    positiveInteger: /^\d+$/, // 正整数
    mobile: /^1[3456789]\d{9}$/, // 手机
    phone: /^[0-9]{3,4}[0-9]{7,9}$/, // 固话
    letterNumber: /^[0-9a-zA-Z_]{1,}$/,
    telNumber: /^0[1-9]{3,4}-[0-9]{5,10}$/,
    email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, // 邮箱
    idCard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, // 身份证
    number: /^(0|[1-9][0-9]*)$/, // 数字
    revenueMonth: /(^[0-9]*$)|(^[0-9]*[.][0-9]*$)/ // 月收入
  }
  return regArr[type]
}

/**
 * 根据需要检验的类型进行校验是否符合规则
 * @param errorfunc
 * @param suceesfunc
 * @returns {*}
 * @param rule
 * @param CheckValue
 */
export function matchingInputRule(rule, CheckValue, errorfunc, suceesfunc) {
  const rightExpression = {
    phoneNumber: /^((13|15|18|14|17|16)+\d{9})$/, // 检验手机号码
    isString: /[^0-9]/, // 检验是否为非数字输入
    number: /[0-9]/, // 检验是否为number类型
    date: /^\d{4}(-|\/)\d{1,2}\1\d{1,2}$/, // 检验是否为时间格式 （YY-MM-DD）
    email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/, // 检验是否为电子邮箱
    idCard: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/, // 检验是否为合格身份证
    integer: /^[1-9]\d*$/, // 检验是否为正整数
    companyphone: /\d{3}-\d{8}|\d{4}-\d{7}/, // 验证是否为公司电话号码
    businessLicense: /^([0-9a-zA-Z]{18}$|\d{15}$)/, // 营业执验证,
    userName: /[a-zA-Z0-9_-]$/, // 用户名规则验证 4到16位（字母，数字，下划线，减号）
    userNameCantIsEmpty: /^(?!\s*$)/g, // 不能为空字符串
    userNameCantIsAllNumber: /[^0-9]+/, // 不能为纯数字
    userNameLength: /^\S{4,20}$/, // 用户名长度为4~20位
    passWordCantIsEmpty: /^(?!\s*$)/g, // 不能为空字符串
    passWordLength: /^\S{6,16}$/, // 用户名长度为4~20位
    assiginPassWordCantIsEmpty: /^(?!\s*$)/g, // 不能为空字符串
    hotelNameCantIsEmpty: /^(?!\s*$)/g, // 不能为空字符串
    hotelNameLength: /^\S{2,40}$/ // 用户名长度为4~20位
  };
  const errCodeName = {
    phoneNumber: '请输入正确的手机号码',
    userName: '用户名只由英文字母及数字组成',
    passWord: '密码输入格式错误',
    email: '邮箱格式输入错误',
    date: '时间格式输入错误',
    userNameCantIsEmpty: '请输入用户名',
    userNameCantIsAllNumber: '用户名不能为纯数字',
    userNameLength: '用户名长度为4~20位',
    passWordCantIsEmpty: '请输入密码',
    passWordLength: '密码长度为6~16',
    assiginPassWordCantIsEmpty: '请再次输入密码',
    hotelNameCantIsEmpty: '请输入客栈名称',
    hotelNameLength: '客栈名长度为2~40位'

  };
  for (const key in rightExpression) {
    try {
      if (key === rule) {
        if (errorfunc && suceesfunc) {
          return rightExpression[key].test(CheckValue) ? suceesfunc : errorfunc;
        } else {
          return rightExpression[key].test(CheckValue) ? true : errCodeName[key];
        }
      }
    } catch (error) {
      console.log(`${rule}匹配规则不正确，请重写${rule}规则`)
    }
  }
}
/* 返回日期时间 */
export const timestampToTime = (timestamp) => {
  const date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() + ' ';
  return Y + M + D;
}
