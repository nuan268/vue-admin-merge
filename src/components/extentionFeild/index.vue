/*扩展字段*/
<template>
  <div class="extention-box">
    <el-row :gutter="gutterVal">
      <el-col
        v-for="(value, key, index) in extentionForm"
        :key="key"
        :span="12"
      >
        <el-form-item :label="`${key}：`">
          <el-input v-if="index < 16" v-model="extentionForm[key]"> </el-input>
          <el-date-picker
            v-else
            v-model="extentionForm[key]"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "ExtentionFeild",
  components: {},
  props: {
    extentionForm: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      gutterVal: 100
    };
  },
  computed: {
    extentionFormDetail: {
      get() {
        return this.extentionForm;
      },
      set(val) {
        this.$emit("extentionFormVal", val);
      }
    }
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.extention-box {
}
</style>
