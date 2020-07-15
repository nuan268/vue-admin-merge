<template>
  <div>
    <div class="current-type clearfix">
      <div class="fl">
        <i :class="leftMg.icon" class="color pos"></i>
        <span> {{ leftMg.text }} </span>
        <span v-show="leftMg.dictType"> ({{ leftMg.dictType }})</span>
        <i
          v-show="leftMg.showQuestIcon"
          :class="leftMg.class"
          class="color"
          :title="leftMg.title"
        ></i>
      </div>
      <div class="fr">
        <el-button
          v-for="item in renderBtns"
          :type="item.type || 'primary'"
          :size="item.size || 'mini'"
          @click="handlerClick(item.handlerName, '新增')"
        >
          <i :class="item.class"></i>
          <span v-if="item.handlerName === 'View'">
            {{ btnText }}
          </span>
          <span v-else>
            {{ item.btnText }}
          </span>
        </el-button>
        <slot name="more"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import Text from "./index.js";
export default {
  name: "BaseBtn",
  mixins: [Text],
  props: {
    leftMg: {
      type: Object,
      default: () => ({})
      //   validator: val => ["info", "success", "warning", "error"].includes(val)
      // ['info', 'success', 'warning', 'error'] 表示type只接收这四个字符串作为参数传入message组件
    },
    btnArr: {
      type: Array,
      default: () => {
        return [
          //   {
          //     type: "primary",
          //     size: "mini",
          //     handlerName: "View",
          //     btnText: "查询",
          //     class: "fa fa-search"
          //   }
        ];
      }
    },
    type: {
      type: String,
      default: "info"
      //   validator: val => ["info", "success", "warning", "error"].includes(val)
      // ['info', 'success', 'warning', 'error'] 表示type只接收这四个字符串作为参数传入message组件
    },
    text: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnGroups: [
        {
          handlerName: "View",
          btnText: "查询",
          class: "fa fa-search"
        }
      ]
    };
  },
  computed: {
    renderBtns: {
      get: function() {
        return this.btnArr;
      },
      set: function(value) {
        // this.$emit("update:formValue", value);
      }
    }
  },
  mounted() {
    this.showBtns();
  },
  methods: {
    showBtns() {
      //   this.renderBtns = this.productBtn(this.btnGroups, this.btns);
      /* 判断 是否有 有就添加并显示 没有就不添加显示 并且 属性合并 和自定义设置 */
      //   console.log(113, this.renderBtns);
    },
    /* 判断需要生产的按钮类型 返回btns里的值 */
    productBtn(arr1, arr2) {
      var obj = {};
      return [...arr1, ...arr2].filter(item => {
        if (!(obj[item.handlerName] = obj[item.handlerName] === undefined)) {
          return item;
        }
      });
    },
    /* emit触发事件类型 */
    handlerClick(btnType) {
      this[btnType]();
    }
  }
};
</script>
<style lang="scss" scoped>
.current-type {
  height: 45px;
  line-height: 45px;
  // width: calc(100% -200px);
  // margin-right: 200px;
  border-bottom: 1px solid #eee;
}
.pos {
  vertical-align: middle;
  font-size: 14px;
  margin-right: 5px;
}
</style>
