/*扩展字段*/
<template>
  <div class="extention-box">
    <el-row :gutter="gutterVal">
      <el-col v-for="(item, index) in extentionForm" :key="index" :span="12">
        <el-form-item :label="`${item.lable}：`">
          <el-input
            v-if="item.type == 'input'"
            v-model="extentionForm[index].value"
          >
          </el-input>

          <el-date-picker
            v-if="item.type == 'date'"
            v-model="extentionForm[index].value"
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
// import xx from "@/xx";
export default {
  name: "ExtentionFeild",
  components: {},
  props: {
    extentionForm: {
      type: Array,
      default: () => {
        return [];
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
