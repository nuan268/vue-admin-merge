/**
 * 扩展函数
 * Created by fanGe on 2019-02-21 09:44:57.
 * 自动生成
 */
import Vue from 'vue'
import { Message } from 'element-ui'

/**
 * 获取对象是否为null或undefined或空字符串
 *
 * @param {Object} obj 检查对象
 */
Vue.prototype.UtilJs = {
  isNull: function (obj) {
    return obj === undefined || obj === null
  },
  isEmptyObject: function (obj) {
    if (typeof obj === 'object' && !(obj instanceof Array)) {
      for (var prop in obj) {
        return false
      }
      return true
    }
    return false
  },
  isEmpty: function (obj) {
    return obj === undefined || obj == null || this.isEmptyObject(obj) || obj === ''
  },
  isFunction: function (obj) {
    return typeof obj === 'function'
  },
  compareDate: function (str1, str2) {
    if (new Date(str1).valueOf() > new Date(str2).valueOf()) {
      return 1
    } else if (new Date(str1).valueOf() < new Date(str2).valueOf()) {
      return -1
    } else if (new Date(str1).valueOf() === new Date(str2).valueOf()) {
      return 0
    }
  },
  // 深度clone
  cloneDeep: function (obj) {
    let newObj = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = (obj && typeof obj[key] === 'object') ? this.cloneDeep(obj[key]) : obj[key]
        }
      }
    }
    return newObj
  }
}

const duration = 5000
const showClose = false

Vue.prototype.success = function (msg) {
  Message({
    showClose: showClose,
    message: msg,
    type: 'success',
    duration: duration
  })
}

Vue.prototype.error = function (msg) {
  Message({
    showClose: showClose,
    message: msg,
    type: 'error',
    duration: duration
  })
}

Vue.prototype.info = function (msg) {
  Message({
    showClose: showClose,
    message: msg,
    type: 'info',
    duration: duration
  })
}

Vue.prototype.warning = function (msg) {
  Message({
    showClose: showClose,
    message: msg,
    type: 'warning',
    duration: duration
  })
}
