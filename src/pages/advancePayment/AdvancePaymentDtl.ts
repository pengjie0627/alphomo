import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import SelectPayBill from 'pages/payablemenu/cmp/SelectPayBill.vue'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import { Dialog } from 'fant'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import User from 'model/framework/user/User'
import { State } from 'vuex-class'
import PermissionMgr from 'mgr/PermissionMgr'
import AdvancePaymentApi from 'http/advancepayment/AdvancePaymentApi'
import AdvancePayment from 'model/advancepayment/AdvancePayment'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import ImgCheck from 'cmp/ImgCheck.vue'
import AdvancePaymentDetailButton from 'pages/advancePayment/cmp/AdvancePaymentDetailButton'

@Component({
  name: 'AdvancePaymentDtl',
  components: {
    PageBody,
    BillBody,
    QfImgUpload,
    SelectPayBill,
    PrintView,
    PrintMaintenanceView,
    PrintPreView,
    ImgCheck,
    AdvancePaymentDetailButton
  }
})
export default class AdvancePaymentDtl extends Vue {
  @State('user') user: User
  id = ''
  version = 0
  menu = [{
    name: '预付款单',
    url: '/advancePayment'
  }, {
    name: '预付款单详情'
  }]
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  payment = new AdvancePayment()
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
    this.contextPageInfo.ids = JSON.parse(this.$route.query.ids)
    this.contextPageInfo.query = JSON.parse(this.$route.query.queryParams)
    this.getDetail(this.id)
  }


  onToCheck(url: string) {
    new Dialog(ImgCheck, {
      imgUrl: url
    }).show()
  }

  onBtnOther(type: string) {
    if (type === 'pre') {
      this.record = 'pre'
      AdvancePaymentApi.prev(this.contextPageInfo).then(resp => {
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
            name: 'advancePaymentDetail',
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
      AdvancePaymentApi.next(this.contextPageInfo).then(resp => {
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
            name: 'advancePaymentDetail',
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
    AdvancePaymentApi.get(id).then(resp => {
      if (resp.success) {
        this.payment = resp.data
        this.version = resp.data.version
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
