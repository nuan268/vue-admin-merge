<template>
  <div class="dataTable">
    <div class='headTitle' v-if="toolMenuFlag">
      <slot name="headForm">
      </slot>
      <auth-button :label="'新增'" v-if="btnCreate" type="primary" :menuCode="menuCode" :perms="createPerms" icon="el-icon-plus" @click="showCreate" class="btnLeft"></auth-button>
      <auth-button :label="'批量删除'" v-if="btnDels" type="danger" :menuCode="menuCode" :perms="delsPerms" icon="el-icon-delete" @click="showDels" class="btnLeft"></auth-button>
      <!-- <auth-button :label="'导出'" v-if="btnExport" type="primary" :menuCode="menuCode" :perms="exportPerms" icon="el-icon-download" @click="exportFile" class="btnLeft"></auth-button> -->
      <span v-if="headTitle !== ''">{{headTitle}}</span>
      <div class="headButton" v-if="IsRight">
        <slot name="headButton">
        </slot>
      </div>
       <slot name="headButton" v-else>
        </slot>
      <el-button-group v-if="menuFlag" style="float:right">
        <el-tooltip effect="dark" :content="showHandleFlag ? 'common.fold' : 'common.open'" placement="top">
          <el-button  :icon="showHandleFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="showHandleFlag = !showHandleFlag"></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
          <el-button  icon="el-icon-refresh" @click="handleFilter"></el-button>
        </el-tooltip>
        <el-dropdown  :hide-on-click="false" trigger="click" style="margin-left:1px">
          <el-button>
            <i class="el-icon-more"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <template v-for="(column, index) in columns">
              <el-dropdown-item  :key="index">
                <el-checkbox v-model="columnMenus[column.prop]">{{column.label}}</el-checkbox>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button-group>
    </div>

    <el-table :data="tableDatas"
              :v-loading="vLoading"
              :element-loading-text="elementLoadingText"
              @selection-change="selectionChange"
              @expand-change="expandChange"
              :border="border" stripe
              fit
              @row-click="rowClick"
              :row-key="rowKey"
              highlight-current-row
              tooltip-effect="dark"
              ref="vueTable"
              :style="currentStyle"
              :default-sort="defaultSort"
              :span-method="spanMethod"
              :header-cell-style="{'background-color': systemTheme, 'color': 'white'}">
      <el-table-column v-if="showSelection"
                       :type="type"
                       :index='(index)=>{return (index+1) + (queryParas.currentPage-1) * queryParas.currentPageSize }'
                       align="center"
                       :label="typeLabel"
                       :selectable="selectTable"
                       width="55"></el-table-column>
      <el-table-column
          type="index"
          :index='(index)=>{return (index+1) + (queryParas.currentPage-1) * queryParas.currentPageSize }'
          align="center"
          :label="'序号'"
          width="55"></el-table-column>
      <slot name="index"></slot>
      <template v-for="(column,index) in columns">
        <el-table-column  v-if="columnMenus[column.prop]" :align="column.align ? column.align : 'center'" header-align="center"
                          :show-overflow-tooltip="column.showOverflowTooltip" :sortable="column.sortable"
          :key="index" :label="column.label" :prop="column.prop" :width="column.width">
          <template slot-scope="scope">
              <!-- 如果有格式化，处理格式化数据 -->
            <span v-if="columnMenus[column.prop]" v-html="column.format?column.format(scope.row):scope.row[column.prop]"></span>
          </template>
          <template v-if="column.child">
            <template  v-for="(columnChild, ind) in column.child">
               <el-table-column  :align="columnChild.align" header-align="center" :label="columnChild.label" :prop="columnChild.prop" :width="columnChild.width" :key="ind">
                <template slot-scope="scope">
                  <!-- 处理child里面的格式化数据，如果有格式化，处理格式化数据 -->
                  <span>{{columnChild.format?columnChild.format(scope.row):scope.row[columnChild.prop]}}</span>
                </template>
              </el-table-column>
            </template>
          </template>
        </el-table-column>
      </template>
      <slot>
      </slot>
      <el-table-column v-if="operateBtnLayout.indexOf('V') > -1 || operateBtnLayout.indexOf('E') > -1 ||  operateBtnLayout.indexOf('R') > -1 || operateBtnLayout.indexOf('D') > -1 || operateBtnLayout.indexOf('U') > -1" fixed="right"
                       align="center"
                       label="操作" :width="operatWidth">
        <template slot-scope="scope">
          <operateGroup :menuCode="menuCode" :viewPerms="viewPerms" :editPerms="editPerms" :reviewPerms="reviewPerms" :uploadPerms="uploadPerms" :delPerms="delPerms" :deleteApi="deleteApi" :autoDel="autoDel" :operateColLayout="operateColLayout(scope.row)" :rowData="scope.row" :rowIndex="scope.$index" @operateBtnClick="operateBtnClick">
            <template slot="button" slot-scope="obj">
                <slot name="button" :row="obj.row" :index="obj.index">
                </slot>
            </template>
          </operateGroup>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showPage && !vLoading"
         class="pagination-container "
         :style="paginationStyle">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="queryParas.currentPage"
                     :page-sizes="pageSizes"
                     :page-size="queryParas.currentPageSize"
                     :layout="pageLayout"
                     :total="currentTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import operateGroup from '@/components/buttonGroup/operateGroup'
// import sysApi from '@/api/sysApi'
import AuthButton from '@/components/auth/authButton'
import { mapGetters } from 'vuex'
const V = 'V' // 查看
const E = 'E' // 编辑
const D = 'D' // 删除
const U = 'U' // 上传
const R = 'R' // 复核
const C = 'C' // 新建
const B = 'B' // 批量删除
const O = 'O' // 导出
export default {
  components: {
    operateGroup,
    AuthButton
  },
  props: {
    // 所属菜单Code-->全局唯一
    menuCode: {
      type: String,
      default: null
    },
    // 新增按钮权限标识，外部使用者传入
    createPerms: {
      type: String,
      default: null
    },
    // 批量删除按钮权限标识，外部使用者传入
    delsPerms: {
      type: String,
      default: null
    },
    // 查看按钮权限标识，外部使用者传入
    viewPerms: {
      type: String,
      default: null
    },
    // 编辑按钮权限标识，外部使用者传入
    editPerms: {
      type: String,
      default: null
    },
    // 复核按钮权限标识，外部使用者传入
    reviewPerms: {
      type: String,
      default: null
    },
    // 上传按钮权限标识，外部使用者传入
    uploadPerms: {
      type: String,
      default: null
    },
    // 删除按钮权限标识，外部使用者传入
    delPerms: {
      type: String,
      default: null
    },
    menuFlag: {
      type: Boolean,
      default () {
        return true
      }
    },
    sourceData: {
      type: Array,
      default: function () {
        return []
      }
    },
    handleFlag: {
      required: false,
      type: Boolean,
      default: () => true
    },
    columns: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array
    },
    api: {
      type: Object
    },
    elementLoadingText: {
      type: String,
      default: function () {
        return '正在刷新'
      }
    },
    border: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    toolMenuFlag: {
      type: Boolean,
      default () {
        return true
      }
    },
    styles: {
      type: String,
      default: function () {
        return 'width: 100%'
      }
    },
    showSelection: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    type: {
      type: String,
      default: function () {
        return 'selection'
      }
    },
    typeLabel: {
      type: String,
      default: function () {
        return '#'
      }
    },
    showPage: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    pageLayout: {
      type: String,
      default: function () {
        return 'total, sizes, prev, pager, next, jumper'
      }
    },
    pageSizes: {
      type: Array,
      default: function () {
        return [5, 10, 20, 30, 40, 50]
      }
    },
    operateBtnLayout: {
      type: String,
      default: function () {
        return `${C},${B},${V},${E},${R},${D},${U},${O}`
      }
    },
    currentPage: {
      type: Number,
      default: function () {
        return 1
      }
    },
    currentPageSize: {
      type: Number,
      default: function () {
        return 10
      }
    },
    pagePosition: {
      type: String,
      validator: function (value) {
        return value === 'right' || value === 'left' || value === 'center'
      },
      default: function () {
        return 'right'
      }
    },
    queryParas: {
      type: Object,
      default: function () {
        return {
          currentPage: 1,
          currentPageSize: 10,
          keys: null
        }
      }
    },
    loadCount: {
      type: Number,
      default: function () {
        return 0
      }
    },
    defaultSort: {
      type: Object,
      default: function () {
        return {}
      }
    },
    btnHandle: {
      type: String,
      default: function () {
        return ''
      }
    },
    delAlertMsg: {
      type: String,
      default: function () {
        return '此操作会删除该条数据，是否继续？'
      }
    },
    // 分页查询调用的api字符串
    loadPage: {
      type: String,
      default: function () {
        return 'getPage'
      }
    },
    // 控制合并行和列的方法
    spanMethod: {
      type: Function,
      default: function () {
        return function ({ row, column, rowIndex, columnIndex }) {
          return null
        }
      }
    },
    rowKey: {
      type: [Function, String],
      require: false
    },
    deleteApi: {
      type: Object
    },
    operatWidth: {
      type: [String]
    },
    autoDel: {
      type: Boolean,
      default () {
        return true
      }
    },
    reviewFun: {
      type: Function,
      default () {
        return null
      }
    },
    doReviewFun: {
      type: Boolean,
      default () {
        return false
      }
    },
    // talbe以外dom的高度
    otherHeight: {
      type: [Number, String],
      default: 370
    },
    // table表头名字
    headTitle: {
      type: String,
      default: ''
    },
    // headButton插槽内容是否定位显示
    IsRight: {
      type: Boolean,
      default: true
    },
    // 控制选择框禁用条件的方法
    selectTable: {
      type: Function,
      default: function () {
        return function ({ row, index }) {
          return true
        }
      }
    },
    // 控制查询页码是否重置为第一页查询，默认调用handleFilter()重置查询第一页
    loadPageone: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentTotal: 0,
      tableDatas: this.sourceData,
      vLoading: false,
      columnMenus: {},
      selectionData: [],
      tableData: [],
      setDatasource: this.sourceData && this.sourceData.length > 0
    }
  },
  created: function () {
    this.columns.forEach(it => {
      this.$set(this.columnMenus, it.prop, true)
    })
  },
  computed: {
    // dropdownMenus: function () {
    //   this.columns.forEach(it => {
    //     this.columnMenus[it.prop] = true
    //   })
    //   return this.columnMenus
    // },
    btnCreate: function () {
      let layout = this.operateBtnLayout
      return layout !== null && layout !== '' && layout.indexOf(C) !== -1
    },
    btnDels: function () {
      let layout = this.operateBtnLayout
      return layout !== null && layout !== '' && layout.indexOf(B) !== -1
    },
    btnExport () {
      let layout = this.operateBtnLayout
      return layout !== null && layout !== '' && layout.indexOf(O) !== -1
    },
    showHandleFlag: {
      get: function () {
        return this.handleFlag
      },
      set: function (value) {
        this.$emit('update:handleFlag', value)
      }
    },
    getHeight () {
      // 100%时，内容铺满
      if (this.otherHeight === '100%') return this.$nextTick(() => { '100%' })
      // 设置talbe 最小高度
      if (this.$store.getters.contentHeight - this.otherHeight < 150) return 150 + 'px'
      return this.$store.getters.contentHeight - this.otherHeight + 'px'
    },
    operateBtn: function () {
      return this.btnCreate || this.btnDels
    },
    currentStyle: function () {
      return this.styles
    },
    paginationStyle: function () {
      return { 'text-align': this.pagePosition }
    },
    ...mapGetters(['systemTheme'])
  },
  watch: {
    sourceData: {
      deep: true,
      handler (value, old) {
        if (!this.UtilJs.isEmpty(this.currentTotal)) {
          if (this.api) {
            this.buildTableData(value, this.currentTotal)
          } else {
            this.buildTableData(value)
          }
        } else {
          this.buildTableData(value)
        }
      }
    },
    loadCount: function (value) {
      try {
        if (this.queryParas.currentPage !== 1 && this.loadPageone) {
          this.queryParas.currentPage = 1
        }
        this.loadTableData()
      } finally {
        this.$emit('update:loadCount', value)
      }
    }
  },
  methods: {
    operateColLayout (column) {
      if (this.UtilJs.isFunction(this.reviewFun) && this.doReviewFun) {
        return this.reviewFun(column)
      } else {
        return this.operateBtnLayout
      }
    },
    rowClick (row, column, event) {
      this.$emit('onMouseOver', row, column, event)
    },
    loadTableData: function () {
      let $this = this
      // if (this.sourceData && this.sourceData.length > 0) {
      if (this.setDatasource) {
        this.buildTableData(this.sourceData)
        return
      }
      if (!this.api) return
      if (this.showPage) {
        this.vLoading = true
        this.api[this.loadPage](this.queryParas).then(res => {
          if (res.code === 0) {
            if (res.data ) {
              if(res.data instanceof Array ){
                $this.buildTableData(res.data, res.data.length)
                $this.$emit('getTableData', res.data)
              }else if ( res.data.records ){
                $this.buildTableData(res.data.records, res.data.total)
                $this.$emit('getTableData', res.data.records)
                // if (res.data.records.length === 0) this.info('暂无数据')
              }
            }
          } else {
            $this.error(res.msg || '获取数据失败')
          }
        }).catch(() => {
          $this.vLoading = false
        })
      } else {
        this.api[this.loadPage](this.queryParas).then(res => {
          if (res.code === 0) {
            $this.buildTableData(res.data)
            $this.$emit('getTableData', res.data)
            // $this.buildTableData(res.data)
            // $this.$emit('getTableData', res.data)
          } else {
            $this.error(res.msg || '获取数据失败')
          }
          $this.vLoading = false
        }).catch(() => {
          $this.vLoading = false
        })
      }
    },
    selectionChange: function (selection) {
      this.selectionData = selection
      this.$emit('update:selectedRows', selection)
      this.$emit('selectRowChange', selection)
    },
    expandChange (row, expandedRows) {
      this.$emit('expandChange', row)
    },
    buildTableData: function (data, total = null) {
      if (!data || data.length < 0) {
        return
      }
      this.currentTotal = total || data.length
      this.tableDatas = data
      if (this.value && this.value.length > 0 && this.currentTotal > 0) {
        let $this = this
        this.tableDatas.forEach(function (item) {
          if (item && item.id) {
            this.value.forEach(v => {
              if (v && v.id && v.id === item.id) {
                $this.$refs.vueTable.toggleRowSelection(item, item.sysStatus)
              }
            })
          }
        }, this)
      }
      this.$emit('update:sourceData', data)
      this.vLoading = false
    },
    handleSizeChange: function (value) {
      this.queryParas.currentPageSize = value
      this.queryParas.currentPage = 1
      this.loadTableData()
    },
    handleCurrentChange: function (value) {
      this.queryParas.currentPage = value
      this.loadTableData()
    },
    showCreate: function () {
      this.$emit('onCreateRow')
    },
    showDels: function () {
      let $this = this
      if (this.selectionData.length === 0) {
        $this.warning(`请先勾选要删除的数据!`)
        return
      }
      $this.$confirm('此操作会删除选中数据，是否继续？', '提示', {
        type: 'warning'
      }).then(() => {
        $this.$emit('onDelsRow', this.selectionData)
      })
    },
    exportFile () {
    },
    handleFilter: function () {
      this.loadCount = this.loadCount + 1
    },
    operateBtnClick (returnData) {
      this.$emit('onEditRow', returnData.rowIndex, returnData.rowData, returnData.clickType)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.vueTable.toggleRowSelection(this.tableDatas[row])
        })
      } else {
        this.$refs.vueTable.clearSelection()
      }
    }
  }
}
</script>
<style>
  .dataTable .headTitle {
    margin: 4px 0;
    height: 40px;
    line-height: 40px;
    text-align: center;
    clear: both;
    position: relative;
  }
  .dataTable .btnLeft {
    float: left;
  }
  .dataTable .headButton{
    position: absolute;
    top: 0;
    right: 0;
  }
  /* 将table表头高度缩小 */
  .common-table-header {
    padding: 8px 0!important;
  }
  /* 将table内容高度缩小 */
  .common-table-cell {
    padding: 4px 0!important;
  }

  .dataTable .pagination-container {
    margin-top: 10px!important;
  }
</style>
