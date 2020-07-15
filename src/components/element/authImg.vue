<template>
    <img id="authImg" :authSrc="authUrl"
                alt="" >
</template>

<script>
  import { getToken } from '@/utils/auth'
  export default {
    // 自动补充输入框
    name: 'autocomplete',
    props: {
      // 传入数据
      value: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      // 查看图片请求地址
      authUrl: {
        type: String,
        default: function () {
          return '/restapi/file/fastdfs/download/imageById?id='
        }
      }
    },
    data () {
      return {
        selected: '',
        options: []
      }
    },
    created () {
      this.selected = this.value
    },
    watch: {
      value (val) {
        if (val) {
          this.getId(val)
        }
        this.selected = val
      },
      selected (val) {
        this.$emit('input', val)
      }
    },
    mounted () {
    },
    methods: {
      // 设置请求头
      setHeader () {
        let img = document.getElementById('authImg')
        let url = img.getAttribute('authSrc') + this.options[0]
        let request = new XMLHttpRequest()
        request.responseType = 'blob'
        request.open('get', url, true)
        request.setRequestHeader('Authorization', getToken())
        request.onreadystatechange = e => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                img.src = URL.createObjectURL(request.response)
                img.onload = () => {
                    URL.revokeObjectURL(img.src)
                }
            }
        }
        request.send(null)
      },
      getId (val) {
        let arr = []
        if (val.indexOf(',') > -1) {
          arr = val.split(',')
          arr.map(_ => {
            if (_) {
              this.options.push(_)
            }
          })
        } else {
          if (typeof val === 'string') {
            this.options.push(val)
          }
        }
        this.$nextTick(() => {
          this.setHeader()
        })
      }
    }
  }
</script>
