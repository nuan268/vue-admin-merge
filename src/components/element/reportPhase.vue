<template>
  <div class="reportEidt">
    <span @click="isEdit"><span>{{valueKey}} </span>第（
      <span v-show="!edit">{{selected}}</span>
      <span v-show="edit" class="edit-input">
        <input ref="reportPhase" v-model="selected" placeholder="请输入期数" @blur="edit = false" />
      </span>
      ) 期</span>
  </div>
</template>

<script>
  export default {
    // 期数
    name: 'reportPhase',
    props: {
      value: {
        type: [String, Number],
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      valueKey: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        selected: '',
        edit: false
      }
    },
    created () {
      this.selected = this.value
    },
    watch: {
      value (val) {
        this.selected = val
      },
      selected (val) {
        this.$emit('input', val)
      }
    },
    methods: {
      isEdit () {
        if (this.disabled) return
        this.edit = true
        this.$nextTick(() => {
          this.$refs.reportPhase.focus()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .reportEidt {
    font-size: 12px;
    font-family: '微软雅黑'
  }
  .edit-input {
    width: 67px;
    display: inline-block;
    input {
      width: 100%;
      display: inline-block;
      border: none;
    }
    input:focus {
      border: none;
      outline: none;
    }
  }
</style>
