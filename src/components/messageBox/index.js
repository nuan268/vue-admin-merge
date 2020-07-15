import Vue from "vue";
Vue.prototype.$alertMsgBox = function alert(msg = '确认要删除该数据？', title = '提示', type = "warning",
  settings = {}) {
  Object.assign(settings, { // 合并对象
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type,
    dangerouslyUseHTMLString: true // 允许确认框内容为html格式
  })
  return this.$confirm(`<p style="font-weight:bold;">${msg}</p>`, title, settings)
}
