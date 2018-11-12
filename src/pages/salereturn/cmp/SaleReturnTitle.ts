import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SaleReturn from 'model/salereturn/SaleReturn.ts'
import { Loading } from 'fant'
import SaleReturnApi from 'http/salereturn/SaleReturnApi'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import ExternalBill from 'model/commons/ExternalBill'

@Component({
  name: 'SaleReturnTitle',
  components: {}
})
export default class SaleReturnTitle extends Vue {
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  @Prop()
  bill: SaleReturn
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
  watchId(value: SaleReturn) {
    if (value) {
      this.contextPageInfo.id = value.id
    }
  }

  mounted() {
    this.contextPageInfo.id = this.bill.id
    this.watchIds(this.ids)
    this.watchQuery(this.query)

  }

  toSaleDtl() {
    if (this.$route.query.sale) {
      this.$router.replace(`/saleView?id=${this.$route.query.sale}`)
    } else {
      this.$router.replace(`/saleView?id=${this.bill.sale}`)
    }
  }

  prev() {
    let loading = Loading.show({
      msg: '获取上一单中'
    })

    SaleReturnApi.prev(this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.bill.id !== resp.data.id) {
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getSaleReturn', this.contextPageInfo)
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
    SaleReturnApi.next(this.contextPageInfo).then(resp => {
      loading.hide()
      if (this.bill.id !== resp.data.id) {
        this.contextPageInfo.id = resp.data.id
        this.contextPageInfo.ids = resp.data.ids
        this.contextPageInfo.query = resp.data.query
        this.$emit('getSaleReturn', this.contextPageInfo)
      } else {
        this.$message.info('没有下一单了！')
      }

    }).catch((error) => {
      loading.hide()
      this.$message.error(error.message)
    })
  }


}
SaleReturnTitle.filter('status', function (val: string) {
  if (val === 'UNAUDITED') {
    return '草稿'
  } else if (val === 'AUDITED') {
    return '已审核'
  } else if (val === 'PART_RECEIVED') {
    return '部分入库'
  } else if (val === 'RECEIVED') {
    return '已入库'
  } else if (val === 'ABOLISHED') {
    return '已作废'
  } else {
    return '--'
  }
})

SaleReturnTitle.filter('source', function (val: ExternalBill) {
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

SaleReturnTitle.filter('settleStatus', (val: string) => {
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



