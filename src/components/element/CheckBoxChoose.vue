<template>
  <div>
    <!-- label 支持类型 string number  boolean  -->
    <!-- {{ checkbox }} -->
    <el-checkbox-group v-model="checkList">
      <el-checkbox
        v-for="(item, index) in options"
        :key="index"
        :label="item.value"
        :disabled="item.disabled ? true : false"
      >
        {{ item.label }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: "CheckBoxChoose",
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /* 单选项种类 */
    options: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      // checkList: []
    };
  },
  computed: {
    // 转换绑定的选中数据，与v-model同步
    checkList: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {}
};
</script>
