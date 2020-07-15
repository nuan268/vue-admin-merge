<template>
  <div class="licence clearfix wrapper_content">
    <div class="fl ">
      <i class="fa icon-key"></i>
    </div>
    <div class="fl"></div>
  </div>
</template>
<script>
// import { clearFilterVal, getInputVal, dictTypeMap } from "@/utils/pubFunc";
import { sysApi } from "../../../../api/systemSet";
export default {
  name: "Licence",
  inject: ["reload"],
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    initPage() {
      this.reload();
    },
    init() {
      // console.log(2222, param);
      sysApi.initLicence().then(res => {
        console.log(30, res);
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
