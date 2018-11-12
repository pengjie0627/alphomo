import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Sale from 'model/sale/Sale'
import Payment from 'model/statement/payment/Payment'
import QueryParam from 'model/request/QueryParam'
import { Loading } from 'fant'
import ReceiptApi from 'http/statement/receipt/ReceiptApi'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {}
})
export default class ReceivableRecordTable extends Vue {
  @Prop() data: Payment[]
  @Prop() ids: string[]
  @Prop() query: QueryParam
  @Prop() customer: string
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  // 节点对象
  $refs: {
    skuTable: any
  }

  @Watch('data', { deep: true })
  watchData(value: Payment[]) {
    this.data = value
  }

  /**
   * 表格排序条件
   */
  doSortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({ 'property': prop, 'direction': order })
    this.$emit('setSorters', sorters)
  }

  mounted() {
    this.watchData(this.data)
  }

  /**
   * 表格选择
   * @param val
   */
  doSelectionChange(val: Sale[]) {
    this.$emit('selectData', val)
  }


  /**
   * 表格过滤器： 状态
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  statusFormatter(row: any, column: any, value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'UNAUDITED':
          statusText = '未审核'
          break
        case 'AUDITED':
          statusText = '已审核'
          break
        case 'ABOLISHED':
          statusText = '已作废'
          break
        default:
          statusText = '--'
      }
      return statusText
    } else {
      return '--'
    }
  }

  settleFormatter(row: any, column: any, value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'UNSETTLED':
          statusText = '未核销'
          break
        case 'PART_SETTLED':
          statusText = '部分核销'
          break
        case 'SETTLED':
          statusText = '已核销'
          break
        default:
          statusText = '--'
      }
      return statusText
    } else {
      return '--'
    }
  }

  /**
   * 表格过滤器： 业务时间
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  dateFormatter(row: any, column: any, value: string) {
    if (value) {
      let date = value.split(' ')[0]
      return date
    } else {
      return '--'
    }
  }

  /**
   * 表格过滤器： 销售额
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  /**
   * 跳转到详情
   * @param {string} id
   */
  doGoDetail(id: string) {
    this.$router.push({
      name: 'receiptBillView',
      query: { id: id, customer: this.customer },
      params: { ids: JSON.stringify(this.ids), query: JSON.stringify(this.query) }
    })
  }

  doAudit(id: string) {
    let loading = Loading.show({
      msg: '审核中'
    })
    ReceiptApi.audit(id).then(resp => {
      loading.hide()
      this.$emit('getList')
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}
ReceivableRecordTable.filter('price', (value: string) => {
  if (value && Number(value) !== 0) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})

