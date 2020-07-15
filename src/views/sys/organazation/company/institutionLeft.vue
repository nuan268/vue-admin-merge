<template>
  <div class="user-head ">
    <LeftTree
      :title-name="'组织机构'"
      :menu-data="instMenuData"
      v-bind="$attrs"
      :default-expand="defaultExpand"
      v-on="$listeners"
    ></LeftTree>
  </div>
</template>
<script>
import LeftTree from "@/components/leftTree";
export default {
  components: {
    LeftTree
  },
  props: {
    instMenuData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    defaultExpand: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      menuData: []
    };
  }
};
</script>
<style lang="scss" scoped>
.user-head {
  width: 100%;
  line-height: 45px;
  text-align: left;
  text-indent: 5px;
  .part-left {
    border-bottom: 1px solid #eee;
    // width: 200px;
  }
}
</style>
