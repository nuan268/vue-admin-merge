<template>
  <div>
    <!-- label 支持类型 string number  boolean  -->
    <!-- {{ radios }} -->
    <el-radio
      v-for="(item, index) in radios"
      :key="index"
      v-model="radioValue"
      :label="item.value"
      :disabled="item.disabled ? true : false"
    >
      {{ item.labelName || item.label }}
    </el-radio>
  </div>
</template>

<script>
export default {
  name: "RadioChoose",
  props: {
    value: {
      type: [String, Number, Boolean],
      default: function() {
        return null;
      }
    },
    /* 单选项种类 */
    radios: {
      type: Array,
      default: function() {
        return [
          // {
          //   label: "1",
          //   labelName: "1"
          //   // disabled: true
          // },
        ];
      }
    }
  },
  data() {
    return {
      // radioValue: ""
      // radios: []
    };
  },
  computed: {
    // 转换绑定的选中数据，与v-model同步
    radioValue: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        console.log("set", value);
        /* 选用input 在父组件中 直接用v-model绑定就能够获取到值
        如果不用input 则需要常规的@方法去获取 */
        this.$emit("input", value);
      }
    }
  },
  methods: {
    // change(val) {
    //   console.log("6664", val);
    //   // this.$emit("radioVal", val);
    // }
  }
};
</script>
