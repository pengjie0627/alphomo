import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { DateUtil, Loading } from 'fant'
import Charge from 'model/charge/Charge'
import ChargeApi from 'http/charge/ChargeApi'
import QueryParam from 'model/request/QueryParam'
import PermissionMgr from 'mgr/PermissionMgr'


@Component({
  name: 'ChargeListTable',
  components: {}
})
export default class ChargeListTable extends Vue {
  // 定义选择的数组
  selectArray: any = []
  // 接收表格数据
  @Prop()
  tableData: any
  @Prop()
  printFlag: boolean
  @Prop() query: QueryParam
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  @Watch('printFlag')
  onPrintFlagChange(value: boolean) {
    value && this.$emit('printEvent', this.selectArray)
  }

  // 表格内批量勾选
  selectionChange(list: any) {
    this.selectArray = list
    this.$emit('printEvent', this.selectArray)
  }

  // 排序
  sortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sort: any = []
    column && prop && order && sort.push({ 'property': prop, 'direction': order })
    this.$emit('refreshListBySort', sort)
  }

  // 表格列格式化（有些不需要）
  onFormatter(row: any, column: any, value: any) {
    // todo
  }
  categoryFormatter(row: any, column: any, value: string) {
    if (value) {
      if (value === 'CASH') {
        return '现金交款'
      } else if (value === 'DEDUCTION') {
        return '账款抵扣'
      }
    } else {
      return '--'
    }
  }
  payStatusFormatter(row: any, column: any, value: string) {
    if (value) {
      if (value === 'UNPAID') {
        return '未付款'
      } else if (value === 'PART_PAID') {
        return '部分付款'
      } else if (value === 'PAID') {
        return '已付款'
      }
    } else {
      return '--'
    }
  }
  /**
   * 表格过滤器： 状态
   * @param {string} value
   * @returns {string}
   */
  statusFormatter(value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'UNAUDITED':
          statusText = 'danger'
          break
        case 'AUDITED':
          statusText = 'success'
          break
        case 'PART_DELIVERED':
          statusText = 'success'
          break
        case 'DELIVERED':
          statusText = 'success'
          break
        case 'ABOLISHED':
          statusText = 'warning'
          break
        default:
          statusText = ''
      }
      return statusText
    } else {
      return ''
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
      let date = DateUtil.format(new Date(value), 'yyyy-MM-dd')
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
    if (Number(value) === 0) {
      return '0.00'
    }
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }
  // 去编辑页面
  goToEdit(bill: Charge) {
    let ids: any[] = []
    this.tableData.forEach((item: any) => {
      ids.push(item.id)
    })
    this.$router.push({ name: 'chargeAdd', query: { id: bill.id || '' } , params: { ids: JSON.stringify(ids), query: JSON.stringify(this.query) } })
  }
  goToChargeDetail(id: string) {
    let ids: any[] = []
    this.tableData.forEach((item: any) => {
      ids.push(item.id)
    })
    this.$router.push({
      name: 'chargeDetail', query: { id: id }, params: { ids: JSON.stringify(ids), query: JSON.stringify(this.query) }
    })
  }
  // 审核
  onAudit(bill: Charge) {
    let loading = Loading.show({
      msg: '审核中'
    })
    ChargeApi.audit(bill.id || '', bill.version).then(resp => {
      loading.hide()
      if (resp && resp.data) {
        for (let data of this.tableData) {
          if (data.id === bill.id) {
            // Vue.set(bill, 'status', resp.data.status)
            this.$emit('refreshListBySort', [])
          }
        }
      }
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  /**
   *  作废
   */
  onAbolish(bill: Charge) {
    let loading = Loading.show({
      msg: '作废中'
    })
    ChargeApi.abolish(bill.id || '', bill.version).then(resp => {
      loading.hide()
      if (resp && resp.data) {
        for (let data of this.tableData) {
          if (data.id === bill.id) {
            // this.tableData.splice(bill, 1, resp.data)
            // Vue.set(bill, 'status', resp.data.status)
            this.$emit('refreshListBySort', [])
          }
        }
      }
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}
ChargeListTable.filter('status', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'UNAUDITED':
        statusText = '未审核'
        break
      case 'AUDITED':
        statusText = '已审核'
        break
      case 'PART_DELIVERED':
        statusText = '部分出库'
        break
      case 'DELIVERED':
        statusText = '已出库'
        break
      case 'ABOLISHED':
        statusText = '已作废'
        break
      case 'REMOVE':
        statusText = '已删除'
        break
      default:
        statusText = '--'
    }
    return statusText
  } else {
    return '--'
  }
})

