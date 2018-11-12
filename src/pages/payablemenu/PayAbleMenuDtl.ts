import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import SelectPayBill from 'pages/payablemenu/cmp/SelectPayBill.vue'
import Payment from 'model/statement/payment/Payment'
import PaymentApi from 'http/statement/payment/PaymentApi'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import { Dialog } from 'fant'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import User from 'model/framework/user/User'
import { State } from 'vuex-class'
import PermissionMgr from 'mgr/PermissionMgr'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import ImgCheck from 'cmp/ImgCheck.vue'
import PayAbleMenuDetailButton from 'pages/payablemenu/cmp/PayAbleMenuDetailButton'

@Component({
  name: 'PayAbleMenuAdd',
  components: {
    PageBody,
    BillBody,
    QfImgUpload,
    SelectPayBill,
    PrintView,
    PrintMaintenanceView,
    PrintPreView,
    ImgCheck,
    PayAbleMenuDetailButton
  }
})
export default class PayAbleMenuAdd extends Vue {
  @State('user') user: User
  id = ''
  version = 0
  menu = [{
    name: '付款单',
    url: '/payAbleMenu'
  }, {
    name: '付款单详情'
  }]
  usd = [{
    amount: 0, // 本次付款
    usdAmount: 0, // 本次付款（美元）
    totalAmount: 0, // 合计应付金额
    lossesAmount: 0, // 外币损益金额
    exchangeRate: 0, // 汇率
    foreignPaidAmount: 0, // 外币已付金额
    foreignAdvanceAmount: 0, // 外币预付金额
    foreignTotalAmount: 0, // 外币 合计金额
  }]
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  exchangeRate: string = ''
  payment = new Payment()
  record = ''

  get preBillFlag() {
    let ids = JSON.parse(this.$route.query.ids)
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] === this.id) {
        if (i === 0) {
          return true
        }
      }
    }
    return false
  }

  get nextBillFlag() {
    let ids = JSON.parse(this.$route.query.ids)
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] === this.id) {
        if (i === ids.length - 1) {
          return true
        }
      }
    }
    return false
  }

  get getShouldPay() {
    let sum = 0
    if (this.payment && this.payment.lines) {
      this.payment.lines.forEach(item => {
        sum += item.amount
      })
      return sum
    } else {
      return 0
    }
  }

  mounted() {
    this.id = this.$route.query.uuid
    this.contextPageInfo.id = this.id
    if (this.$route.query.ids) {
      this.contextPageInfo.ids = JSON.parse(this.$route.query.ids)
    }
    if (this.$route.query.queryParams) {
      this.contextPageInfo.query = JSON.parse(this.$route.query.queryParams)
    }
    this.getDetail(this.id)
  }

  // 获取外币信息
  getUsdAmount() {
    // if (this.payment.lines === null || this.payment.lines.length === 0) {
    //   return
    // }
    // let sum = 0
    // // let usdSum = 0
    // this.payment.lines.forEach(item => {
    //   sum += item.amount
    //   // usdSum += item.foreignAmount
    // })
    this.usd[0].lossesAmount = this.payment.lossesAmount
    this.usd[0].exchangeRate = this.payment.exchangeRate
    this.usd[0].foreignAdvanceAmount = this.payment.foreignAdvanceAmount
    this.usd[0].usdAmount = this.payment.foreignPaidAmount
    if (this.exchangeRate === 'multiply') {
      this.usd[0].amount = this.payment.foreignPaidAmount * this.payment.exchangeRate
    } else {
      this.usd[0].amount = this.payment.exchangeRate === 0 ? 0 : this.payment.foreignPaidAmount / this.payment.exchangeRate
    }
    this.usd[0].totalAmount = this.payment.paidAmount
    this.usd[0].foreignAdvanceAmount = this.payment.foreignAdvanceAmount
    this.usd[0].foreignTotalAmount = this.payment.foreignTotalAmount
  }

  getStatusName(type: string) {
    if (type === 'SupplierStatement') {
      return '结算单'
    }
    if (type === 'ChargeDeduction') {
      return '费用单(账款结算)'
    }
    if (type === 'ChargeCash') {
      return '费用单（现金）'
    }
    if (type === 'AdvancePayment') {
      return '预付款单'
    }
  }

  onToCheck(url: string) {
    new Dialog(ImgCheck, {
      imgUrl: url
    }).show()
  }

  onBtnOther(type: string) {
    if (type === 'pre') {
      this.record = 'pre'
      PaymentApi.prev(this.contextPageInfo).then(resp => {
        if (resp.success) {
          if (this.id === resp.data.id) {
            this.$message.info('没有上一单了')
            return
          }
          this.id = resp.data.id!
          this.contextPageInfo.id = resp.data.id
          this.contextPageInfo.ids = resp.data.ids
          this.contextPageInfo.query = resp.data.query
          this.$router.replace({
            name: 'payAbleMenuDtl',
            query: {
              uuid: this.id,
              ids: this.$route.query.ids,
              queryParams: this.$route.query.queryParams
            }
          })
          this.getDetail(resp!.data!.id!)
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    } else {
      this.record = 'next'
      // this.checkId(this.id)
      PaymentApi.next(this.contextPageInfo).then(resp => {
        if (resp.success) {
          if (this.id === resp.data.id) {
            this.$message.info('没有下一单了')
            return
          }
          this.id = resp.data.id!
          this.contextPageInfo.id = resp.data.id
          this.contextPageInfo.ids = resp.data.ids
          this.contextPageInfo.query = resp.data.query
          this.$router.replace({
            name: 'payAbleMenuDtl',
            query: {
              uuid: this.id,
              ids: this.$route.query.ids,
              queryParams: this.$route.query.queryParams
            }
          })
          this.getDetail(resp!.data!.id!)
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    }
  }

  /**
   * 获取详情
   */
  private getDetail(id: string) {
    PaymentApi.detail(id).then(resp => {
      if (resp.success) {
        this.payment = resp.data
        this.version = resp.data.version
        this.exchangeRate = resp.data.exchangeRateConfig || ''
        this.getUsdAmount()
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  // private checkId(id: string) {
  //   let ids = JSON.parse(this.$route.query.ids)
  //   if (ids && ids.length > 0) {
  //     for (let i = 0;i < ids.length; i++) {
  //       if (id === ids[i]) {
  //         if (this.record === 'pre') {
  //           if (i === 0) {
  //             this.id = ids[0]
  //             this.$message.info('没有上一单了')
  //             break
  //           } else {
  //             this.id = ids[i - 1]
  //             break
  //           }
  //         } else {
  //           if (i === ids.length - 1) {
  //             this.$message.info('没有下一单了')
  //             this.id = ids[ids.length - 1]
  //             break
  //           } else {
  //             this.id = ids[i + 1]
  //             break
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}


