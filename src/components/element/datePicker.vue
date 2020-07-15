<template>
    <el-date-picker
      v-model="time"
      :type="timeType"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
      @change="change"
      @focus="focusEvent"
      :style="{width: width}"
      :picker-options="pickerOptions"
      :size="timeSize"
      :value-format="valueFormat">
    </el-date-picker>
</template>

<script>
import {mapGetters} from 'vuex'
import moment from 'moment'

export default {
  props: {
    // 格式化默认使用时间戳
    timestamp: {
      type: String,
      default () {
        return 'timestamp'
      }
    },
    placeholder: {
      type: String,
      default () {
        return '请选择'
      }
    },
    value: {
      type: [String, Number],
      default: function () {
        return null
      }
    },
      // 是否禁用
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    },
    valueFormat: {
      type: String,
      default: 'timestamp'
    },
    isFestival: { // 是否筛选出节假日
      type: Boolean,
      default: () => true
    },
    isShowbefore: { // 是否显示当天之前的日期
      type: Boolean,
      default: () => true
    },
      // 是否可清除
    clearable: {
      type: Boolean,
      default () {
        return true
      }
    },
    width: {
      type: String,
      default () {
        return '100%'
      }
    },
    timeType: {
      type: String,
      default () {
        return 'date'
      }
    },
    timeSize: {
      type: String,
      default () {
        return 'medium'
      }
    },
    index: {
      type: Number,
      default () {
        return null
      }
    }
  },
  data () {
    return {}
  },
  computed: {
      // 转换绑定的选中数据，与v-model同步
    time: {
      get: function () {
        if (this.value === -2209017600000) {
          return ''
        } else {
          return this.value
        }
      },
      set: function (value) {
        this.$emit('update:value', value)
        this.$emit('input', value)
        this.$emit('updateTime', value, this.index)
      }
    },
    ...mapGetters(['festivalDays']),
    pickerOptions () {
      let $this = this
      let isShowbefore = true
      if (!isShowbefore && $this.isFestival) {
        return {
          disabledDate (time) {
            let index = $this.festivalDays.includes(time.getTime())
            return index || moment(time).isBefore(moment().format('YYYY-MM-DD'))
          }
        }
      } else if (isShowbefore && $this.isFestival) {
        return {
          disabledDate (time) {
            let index = $this.festivalDays.includes(time.getTime())
            return index
          }
        }
      } else if (!isShowbefore && !$this.isFestival) {
        return {
          disabledDate (time) {
            return moment(time).isBefore(moment().format('YYYY-MM-DD'))
          }
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    change (val) {
      this.$emit('change', val)
    },
    focusEvent (val) {
      this.$emit('focus', val)
    }
  }
}
</script>
