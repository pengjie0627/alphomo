import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Sale from 'model/sale/Sale.ts'
import { Loading } from 'fant'
import SaleApi from 'http/sale/SaleApi'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import ExternalBill from 'model/commons/ExternalBill'

@Component({
  name: 'SaleTitle',
  components: {}
})
export default class SaleTitle extends Vue {
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  @Prop()
  bill: Sale
  @Prop()
  presentation: string
  @Prop()
  ids: string
  @Prop()
  query: string

  @Watch('ids')
  watchIds(value: string) {
    if (value) {
      this.contextPageInfo.ids = JSON.parse(value)
    }
  }

  @Watch('query')
  watchQuery(value: string) {
    if (value) {
      this.contextPageInfo.query = JSON.parse(value)
    }
  }

  @Watch('bill', { deep: true })
  watchId(value: Sale) {
    if (value) {
      this.contextPageInfo.id = value.id
    }
  }

  mounted() {
    this.contextPageInfo.id = this.bill.id
    this.watchIds(this.ids)
    this.watchQuery(this.query)

  }

  toSaleRtnDtl(id: string) {
    this.$router.push({ name: 'saleReturnView', query: { id: id } })
  }

  prev() {
    let loading = Loading.show({
      msg: '获取上一单中'
    })

    SaleApi.prev(this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.bill.id !== resp.data.id) {
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getSale', this.contextPageInfo)
      } else {
        this.$message.info('没有上一单了！')
      }
    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  next() {
    let loading = Loading.show({
      msg: '获取下一单中'
    })
    SaleApi.next(this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.bill.id !== resp.data.id) {
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getSale', this.contextPageInfo)
      } else {
        this.$message.info('没有下一单了！')
      }

    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }


}
SaleTitle.filter('status', function (val: string) {
  if (val === 'UNAUDITED') {
    return '草稿'
  } else if (val === 'AUDITED') {
    return '已审核'
  } else if (val === 'PART_DELIVERED') {
    return '部分出库'
  } else if (val === 'DELIVERED') {
    return '已出库'
  } else if (val === 'ABOLISHED') {
    return '已作废'
  } else {
    return '--'
  }
})

SaleTitle.filter('source', function (val: ExternalBill) {
  if (val.source === 'cloud_scm') {
    if (val.billType === 'CarSale') {
      return '车销'
    }
    return '商城'
  } else if (val.source === 'dpos') {
    return '零售'
  }
  return '新建'
})

SaleTitle.filter('settleStatus', (val: string) => {
  if (val === 'UNSETTLED') {
    return '未核算'
  } else if (val === 'PART_SETTLED') {
    return '部分核算'
  } else if (val === 'SETTLED') {
    return '已核算'
  } else {
    return '--'
  }
})



