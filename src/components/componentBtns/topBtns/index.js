const mixin = {
  data() {
    return {
      btnText: "查询",
      showSearch: false
    }
  },
  methods: {
    /* 查询 */
    View() {
      this.btnText = this.btnText === "查询" ? "隐藏" : "查询";
      this.showSearch = this.btnText === "隐藏";
      this.$emit("showSearch", this.showSearch)
    },
    /* 刷爱 */
    Reload() {
      this.$emit("handlerName", "initPage")
    },
    /* 展开 */
    Expand() {
      this.$emit("handlerName", "Expand")
      console.log(13, '还未找到 如何调用 elementui的展开折叠方法')
    },
    /* 折叠 */
    Folding() {
      this.$emit("handlerName", "Folding")
    },
    /* 新增 */
    AddNew() {
      this.$emit("handlerName", "AddNew")
    },
    /* 保存排序 */
    Sort() {
      this.$emit("handlerName", "Sort")
    },
    /* 更多 */
    More() {
      this.$emit("handlerName", "More")
    },
    /* 清除全部缓存 */
    ClearAll() {
      this.$emit("handlerName", "ClearAll")
    }
    //   View() {
    //     console.log(13, 'view')
    //   }, View() {
    //     console.log(13, 'view')
    //   }
  }
}

export default mixin
