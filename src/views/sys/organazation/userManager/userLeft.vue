<template>
  <div class="user-left">
    <LeftTree
      :title-name="'组织机构'"
      :menu-data="instMenuData"
      :show-edit-btn="true"
      v-bind="$attrs"
      @goToIt="gotoInsitution"
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
    }
  },
  data() {
    return {
      menuData1: [
        {
          label: "苑东生物",
          id: "1",
          children: []
        }
      ]
    };
  },
  methods: {
    gotoInsitution() {
      this.$router.push("/js/a/sys/office/index");
    }
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
