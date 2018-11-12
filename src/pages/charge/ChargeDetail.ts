import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import SelectPayBill from 'pages/payablemenu/cmp/SelectPayBill.vue'
import { Dialog, Loading } from 'fant'
import Charge from 'model/charge/Charge'
import { State } from 'vuex-class'
import User from 'model/framework/user/User'
import PermissionMgr from 'mgr/PermissionMgr'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import ChargeApi from 'http/charge/ChargeApi'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import ImgCheck from 'cmp/ImgCheck.vue'
import ChargeDetailButton from 'pages/charge/cmp/ChargeDetailButton'
@Component({
  name: 'ChargeDetail',
  components: {
    PageBody,
    BillBody,
    QfImgUpload,
    SelectPayBill,
    PrintView,
    PrintMaintenanceView,
    PrintPreView,
    ImgCheck,
    ChargeDetailButton
  }
})
export default class ChargeDetail extends Vue {
  menu = [{
    name: '费用单',
    url: '/chargeList'
  }, {
    name: '费用单详情'
  }]
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  makeBillDate = '' // 制单日期
  type = ''
  id = ''
  tableData: any = []
  @State('user') user: User
  bill: Charge = new Charge()

  mounted() {
    this.id = this.$route.query.id
    this.contextPageInfo.id = this.id
    if (this.$route.params.ids) {
      this.contextPageInfo.ids = JSON.parse(this.$route.params.ids)
    }
    if (this.$route.params.query) {
      this.contextPageInfo.query = JSON.parse(this.$route.params.query)
    }
    this.getDetail(this.id)
  }

  getImage(imgs: any) {
    console.log(imgs)
    // this.imgUrl = imgs[0]
  }

  get supplierName() {
    if (this.bill && this.bill.supplier && this.bill.supplier.name !== null) {
      return this.bill.supplier.name || '--'
    } else {
      return '--'
    }
  }

  get manangerName() {
    if (this.bill && this.bill.manager && this.bill.manager.name !== null) {
      return this.bill.manager.name || '--'
    } else {
      return '--'
    }
  }

  /**
   * 选择付款的单据
   */
  onSelectPayBill() {
    new Dialog(SelectPayBill).show()
  }

  priceFormatter(row: any, column: any, value: string) {
    if (Number(value) === 0) {
      return '0.00'
    }
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '--'
    }
  }

  amountUpperFormatter(row: any, column: any, value: string) {
    if (value && value !== '') {
      return value
    } else {
      return '--'
    }
  }

  categoryFormatter(value: string) {
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

  onBtnOther(type: string) {
    let loading = Loading.show()
    if (type === 'pre') {
      ChargeApi.prev(this.contextPageInfo).then(resp => {
        if (resp.success) {
          loading.hide()
          if (this.bill.id !== resp.data.id) {
            this.id = resp.data.id!
            this.contextPageInfo.id = resp.data.id
            this.contextPageInfo.ids = resp.data.ids
            this.contextPageInfo.query = resp.data.query
            this.$router.replace({
              name: 'chargeDetail', query: { id: resp.data.id || '' }, params: {
                ids: this.$route.params.ids,
                query: this.$route.params.query
              }
            })
            this.getDetail(resp!.data!.id!)
          } else {
            this.$message.info('没有上一单了！')
          }
        }
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    } else {
      ChargeApi.next(this.contextPageInfo).then(resp => {
        if (resp.success) {
          loading.hide()
          if (this.bill.id !== resp.data.id) {
            this.id = resp.data.id!
            this.contextPageInfo.id = resp.data.id
            this.contextPageInfo.ids = resp.data.ids
            this.contextPageInfo.query = resp.data.query
            this.$router.replace({
              name: 'chargeDetail', query: { id: resp.data.id || '' },params: {
                ids: this.$route.params.ids,
                query: this.$route.params.query
              }
            })
            this.getDetail(resp!.data!.id!)
          } else {
            this.$message.info('没有下一单了！')
          }
        }
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    }
  }

  onToCheck(url: string) {
    new Dialog(ImgCheck, {
      imgUrl: url
    }).show()
  }

  getDetail(id: string) {
    let loading = Loading.show()
    ChargeApi.get(id).then(resp => {
      if (resp.success) {
        loading.hide()
        this.bill = resp.data
        // this.id = this.bill.id || ''
        this.makeBillDate = resp.data.created.toString()
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}
ChargeDetail.filter('status', function (val: string) {
  if (val === 'UNAUDITED') {
    return '未审核'
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
ChargeDetail.filter('payStatus', function (val: string) {
  if (val === 'UNPAID') {
    return '未付款'
  } else if (val === 'PAID') {
    return '已付款'
  } else {
    return '--'
  }
})

