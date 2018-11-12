import Vue from 'vue'
import Router from 'vue-router'
import store from 'store'
import Component from 'vue-class-component'
import Login from 'pages/auth/Login.vue'
import Register from 'pages/auth/Register.vue'
import MainFrame from 'pages/main/MainFrame.vue'
import Home from 'pages/home/Home.vue'
import SaleList from 'pages/sale/SaleList.vue'
import SaleEdit from 'pages/sale/SaleEdit.vue'
import SaleView from 'pages/sale/SaleView.vue'
import SaleReturnList from 'pages/salereturn/SaleReturnList.vue'
import SaleReturnEdit from 'pages/salereturn/SaleReturnEdit.vue'
import SaleReturnView from 'pages/salereturn/SaleReturnView.vue'
import ReceivableList from 'pages/receivable/ReceivableList.vue'
import ReceivableView from 'pages/receivable/ReceivableView.vue'
import AccountCategory from 'pages/accountcategory/AccountCategoryList.vue'
import ReceiptBillEdit from 'pages/receivable/ReceiptBillEdit.vue'
import ReceiptBillView from 'pages/receivable/ReceiptBillView.vue'
import PurchaseList from 'pages/purchase/PurchaseList.vue'
import PurchaseEdit from 'pages/purchase/PurchaseEdit.vue'
import PurchaseView from 'pages/purchase/PurchaseView.vue'
import PurchaseReturnList from 'pages/purchasereturn/PurchaseReturnList.vue'
import PurchaseReturnEdit from 'pages/purchasereturn/PurchaseReturnEdit.vue'
import PurchaseReturnView from 'pages/purchasereturn/PurchaseReturnView.vue'
import InventoryList from 'pages/inventory/InventoryList.vue'
import InventoryFlow from 'pages/inventory/InventoryFlow.vue'
import InventoryInList from 'pages/inventory/InventoryInList.vue'
import InventoryOutList from 'pages/inventory/InventoryOutList.vue'
import InventoryInEdit from 'pages/inventory/InventoryInEdit.vue'
import InventoryInView from 'pages/inventory/InventoryInView.vue'
import InventoryOutView from 'pages/inventory/InventoryOutView.vue'
import InventoryOutEdit from 'pages/inventory/InventoryOutEdit.vue'
import InventoryTransferList from 'pages/inventory/InventoryTransferList.vue'
import InventoryTransferEdit from 'pages/inventory/InventoryTransferEdit.vue'
import InventoryTransferView from 'pages/inventory/InventoryTransferView.vue'
import InventoryCheckList from 'pages/inventory/InventoryCheckList.vue'
import InventoryCheckEdit from 'pages/inventory/InventoryCheckEdit.vue'
import InventoryCheckView from 'pages/inventory/InventoryCheckView.vue'
import SaleRptList from 'pages/report/SaleRptList.vue'
import SellRptList from 'pages/report/SellRptList.vue'
import StorageRptList from 'pages/report/StorageRptList.vue'
import BalanceRptList from 'pages/report/BalanceRptList.vue'
import RptStorageSkuDtl from 'pages/report/RptStorageSkuDtl.vue'
import RptSaleSkuDtl from 'pages/report/RptSaleSkuDtl.vue'
import RptSellSkuDtl from 'pages/report/RptSellSkuDtl.vue'
import EnterpriseInfoSetting from 'pages/enterprise/EnterpriseInfoSetting.vue'
import UserCenter from 'pages/user/UserCenter.vue'
import CustomerList from 'pages/customer/CustomerList.vue'
import SupplierList from 'pages/supplier/SupplierList.vue'
import WarehouseList from 'pages/warehouse/WarehouseList.vue'
import LogisticsList from 'pages/logistics/LogisticsList.vue'
import SkuList from 'pages/sku/SkuList.vue'
import BeginingInventoryList from 'pages/begininginventory/List.vue'
import SkuCategory from 'pages/sku/SkuCategoryList.vue'
import SkuDetail from 'pages/sku/SkuDetail.vue'
import EnterpriceEdit from 'pages/enterprise/MerchantConfig.vue'
import BusinessSetting from 'pages/enterprise/BusinessSetting.vue'
import ShopList from 'pages/shop/ShopList.vue'
import {sessionStorage} from 'mgr/BrowserMgr.js'
import PurchaseGroupSetting from 'pages/purchasegroup/PurchaseGroupSetting.vue'
import SkuEdit from 'pages/sku/cmp/SkuEdit.vue'
import PayAbleMenu from 'pages/payablemenu/PayAbleMenu.vue'
import PayAbleMenuAdd from 'pages/payablemenu/PayAbleMenuAdd.vue'
import PayAbleMenuDtl from 'pages/payablemenu/PayAbleMenuDtl.vue'
import AccountBillList from 'pages/account/AccountBillList.vue'
import AccountBillAdd from 'pages/account/AccountBillAdd.vue'
import AccountBillDtl from 'pages/account/AccountBillDtl.vue'
import ThirdReport from 'pages/report/ThirdReport.vue'
import EnvUtil from 'util/EnvUtil.js'
import Tohome from 'pages/openapi/Tohome.vue'

Vue.use(Router)

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
])

const router = new Router({
  routes: [
    {
      path: '/',
      name: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      meta: {requiresAuth: false},
      // component: resolve => require(['pages/auth/Login.vue'], resolve)
      component: Login,
      beforeEnter: (to, from, next) => {
        if (EnvUtil.isJdBranch()) {
          document.title = '京东云Elite商贸管家'
        } else {
          document.title = '千帆商贸'
        }
        if (sessionStorage.getItem('vuex')) {
          next('/home')
        } else {
          next()
        }
      }
    },
    {
      path: '/tohome',
      name: 'tohome',
      alias: '',
      // component: resolve => require(['pages/enterprise/EnterpriseInfoSetting.vue'], resolve)
      component: Tohome
    },
    {
      path: '/register',
      name: 'register',
      meta: {requiresAuth: false},
      // component: resolve => require(['pages/auth/Register.vue'], resolve)
      component: Register
    },
    {
      path: '/enterpriseSetting',
      name: 'enterpriseSetting',
      alias: '',
      // component: resolve => require(['pages/enterprise/EnterpriseInfoSetting.vue'], resolve)
      component: EnterpriseInfoSetting
    },
    {
      path: '/main',
      name: 'main',
      meta: {requiresAuth: false},
      // component: resolve => require(['pages/main/MainFrame.vue'], resolve),
      component: MainFrame,
      children: [
        {
          path: '/home',
          name: 'home',
          alias: '',
          // component: resolve => require(['pages/home/Home.vue'], resolve)
          component: Home,
          meta: {title: 'xxx1x'}
        },
        {
          path: '/saleList',
          name: 'saleList',
          alias: '',
          // component: resolve => require(['pages/sale/SaleList.vue'], resolve)
          component: SaleList,
          meta: {keepAlive: true}
        },
        {
          path: '/saleEdit',
          name: 'saleEdit',
          alias: '',
          // component: resolve => require(['pages/sale/SaleEdit.vue'], resolve)
          component: SaleEdit
        },
        {
          path: '/saleView',
          name: 'saleView',
          alias: '',
          // component: resolve => require(['pages/sale/SaleView.vue'], resolve)
          component: SaleView
        },
        {
          path: '/saleReturnList',
          name: 'saleReturnList',
          alias: '',
          // component: resolve => require(['pages/salereturn/SaleReturnList.vue'], resolve)
          component: SaleReturnList,
          meta: {keepAlive: true}
        },
        {
          path: '/saleReturnEdit',
          name: 'saleReturnEdit',
          alias: '',
          // component: resolve => require(['pages/salereturn/SaleReturnEdit.vue'], resolve)
          component: SaleReturnEdit
        },
        {
          path: '/saleReturnView',
          name: 'saleReturnView',
          alias: '',
          // component: resolve => require(['pages/salereturn/SaleReturnView.vue'], resolve)
          component: SaleReturnView
        },
        {
          path: '/receivableList',
          name: 'receivableList',
          alias: '',
          // component: resolve => require(['pages/receivable/ReceivableList.vue'], resolve)
          component: ReceivableList,
          meta: {keepAlive: true}
        },
        {
          path: '/receivableView',
          name: 'receivableView',
          alias: '',
          // component: resolve => require(['pages/receivable/ReceivableView.vue'], resolve)
          component: ReceivableView
        },
        {
          path: '/accountCategoryList',
          name: 'accountCategoryList',
          alias: '',
          // component: resolve => require(['pages/receivable/ReceivableList.vue'], resolve)
          component: AccountCategory
        },
        {
          path: '/receiptBillEdit',
          name: 'receiptBillEdit',
          alias: '',
          // component: resolve => require(['pages/receivable/ReceiptBillEdit.vue'], resolve)
          component: ReceiptBillEdit
        },
        {
          path: '/receiptBillView',
          name: 'receiptBillView',
          alias: '',
          // component: resolve => require(['pages/receivable/ReceiptBillView.vue'], resolve)
          component: ReceiptBillView
        },
        {
          path: '/shopList',
          name: 'shopList',
          alias: '',
          component: ShopList
        },
        // {
        //   path: '/shopInventoryList',
        //   name: 'shopInventoryList',
        //   alias: '',
        //   component: PayableList
        // },
        // {
        //   path: '/payableList',
        //   name: 'payableList',
        //   alias: '',
        //   // component: resolve => require(['pages/payable/PayableList.vue'], resolve)
        //   component: PayableList,
        //   meta: { keepAlive: true }
        // },
        // {
        //   path: '/payableView',
        //   name: 'payableView',
        //   alias: '',
        //   // component: resolve => require(['pages/payable/PayableView.vue'], resolve)
        //   component: PayableView
        // },
        // {
        //   path: '/payBillEdit',
        //   name: 'payBillEdit',
        //   alias: '',
        //   // component: resolve => require(['pages/payable/PayBillEdit.vue'], resolve)
        //   component: PayBillEdit
        // },
        // {
        //   path: '/payBillView',
        //   name: 'payBillView',
        //   alias: '',
        //   // component: resolve => require(['pages/payable/PayBillView.vue'], resolve)
        //   component: PayBillView
        // },
        {
          path: '/purchaseList',
          name: 'purchaseList',
          alias: '',
          // component: resolve => require(['pages/purchase/PurchaseList.vue'], resolve)
          component: PurchaseList,
          meta: {keepAlive: true}
        },
        {
          path: '/purchaseEdit',
          name: 'purchaseEdit',
          alias: '',
          // component: resolve => require(['pages/purchase/PurchaseEdit.vue'], resolve)
          component: PurchaseEdit
        },
        {
          path: '/purchaseView',
          name: 'purchaseView',
          alias: '',
          // component: resolve => require(['pages/purchase/PurchaseView.vue'], resolve)
          component: PurchaseView
        },
        {
          path: '/purchaseReturnList',
          name: 'purchaseReturnList',
          alias: '',
          // component: resolve => require(['pages/purchasereturn/PurchaseReturnList.vue'], resolve)
          component: PurchaseReturnList,
          meta: {keepAlive: true}
        },
        {
          path: '/purchaseReturnEdit',
          name: 'purchaseReturnEdit',
          alias: '',
          // component: resolve => require(['pages/purchasereturn/PurchaseReturnEdit.vue'], resolve)
          component: PurchaseReturnEdit
        },
        {
          path: '/purchaseReturnView',
          name: 'purchaseReturnView',
          alias: '',
          // component: resolve => require(['pages/purchasereturn/PurchaseReturnView.vue'], resolve)
          component: PurchaseReturnView
        },
        // 查询库存
        {
          path: '/inventoryList',
          name: 'inventoryList',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryList.vue'], resolve)
          component: InventoryList,
          meta: {keepAlive: true}
        },
        // 库存流水
        {
          path: '/inventoryFlow',
          name: 'inventoryFlow',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryFlow.vue'], resolve)
          component: InventoryFlow
        },
        // 入库管理
        {
          path: '/inventoryInList',
          name: 'inventoryInList',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryInList.vue'], resolve)
          component: InventoryInList,
          meta: {keepAlive: true}
        },
        // 出库管理
        {
          path: '/inventoryOutList',
          name: 'inventoryOutList',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryOutList.vue'], resolve)
          component: InventoryOutList,
          meta: {keepAlive: true}
        },
        // 入库单入库
        {
          path: '/inventoryInEdit',
          name: 'inventoryInEdit',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryInEdit.vue'], resolve)
          component: InventoryInEdit
        },
        // 入库单详情
        {
          path: '/inventoryInView',
          name: 'inventoryInView',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryInView.vue'], resolve)
          component: InventoryInView
        },
        // 出库单详情
        {
          path: '/inventoryOutView',
          name: 'inventoryOutView',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryOutView.vue'], resolve)
          component: InventoryOutView
        },
        // 出库单出库
        {
          path: '/inventoryOutEdit',
          name: 'inventoryOutEdit',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryOutEdit.vue'], resolve)
          component: InventoryOutEdit
        },
        // 调拨单列表
        {
          path: '/inventoryTransferList',
          name: 'inventoryTransferList',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryTransferList.vue'], resolve)
          component: InventoryTransferList,
          meta: {keepAlive: true}
        },
        // 调拨单编辑
        {
          path: '/inventoryTransferEdit',
          name: 'inventoryTransferEdit',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryTransferEdit.vue'], resolve)
          component: InventoryTransferEdit
        },
        // 调拨单详情
        {
          path: '/inventoryTransferView',
          name: 'inventoryTransferView',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryTransferView.vue'], resolve)
          component: InventoryTransferView
        },
        // 盘点单列表
        {
          path: '/inventoryCheckList',
          name: 'inventoryCheckList',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryCheckList.vue'], resolve)
          component: InventoryCheckList,
          meta: {keepAlive: true}
        },
        // 盘点单编辑
        {
          path: '/inventoryCheckEdit',
          name: 'inventoryCheckEdit',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryCheckEdit.vue'], resolve)
          component: InventoryCheckEdit
        },
        // 盘点单编辑
        {
          path: '/inventoryCheckView',
          name: 'inventoryCheckView',
          alias: '',
          // component: resolve => require(['pages/inventory/InventoryCheckView.vue'], resolve)
          component: InventoryCheckView
        },
        {
          path: '/saleRptList',
          name: 'saleRptList',
          alias: '',
          // component: resolve => require(['pages/report/SaleRptList.vue'], resolve)
          component: SaleRptList,
          meta: {keepAlive: true}
        },
        {
          path: '/sellRptList',
          name: 'sellRptList',
          alias: '',
          // component: resolve => require(['pages/report/SellRptList.vue'], resolve)
          component: SellRptList,
          // meta: {keepAlive: true}
        },
        {
          path: '/storageRptList',
          name: 'storageRptList',
          alias: '',
          // component: resolve => require(['pages/report/StorageRptList.vue'], resolve)
          component: StorageRptList
          // meta: {keepAlive: true}
        },
        {
          path: '/balanceRptList',
          name: 'balanceRptList',
          alias: '',
          // component: resolve => require(['pages/report/BalanceRptList.vue'], resolve)
          component: BalanceRptList
          // meta: { keepAlive: true }
        },
        {
          path: '/rptStorageSkuDtl',
          name: 'rptStorageSkuDtl',
          alias: '',
          // component: resolve => require(['pages/report/RptStorageSkuDtl.vue'], resolve)
          component: RptStorageSkuDtl
        },
        {
          path: '/rptSaleSkuDtl',
          name: 'rptSaleSkuDtl',
          alias: '',
          // component: resolve => require(['pages/report/RptSaleSkuDtl.vue'], resolve)
          component: RptSaleSkuDtl
        },
        {
          path: '/rptSellSkuDtl',
          name: 'rptSellSkuDtl',
          alias: '',
          // component: resolve => require(['pages/report/RptSellSkuDtl.vue'], resolve)
          component: RptSellSkuDtl
        },
        {
          path: '/userCenter',
          name: 'userCenter',
          alias: '',
          // component: resolve => require(['pages/user/UserCenter.vue'], resolve)
          component: UserCenter
        },
        {
          path: '/customerList',
          name: 'customerList',
          alias: '',
          // component: resolve => require(['pages/customer/CustomerList.vue'], resolve)
          component: CustomerList
        },
        {
          path: '/supplierList',
          name: 'supplierList',
          alias: '',
          // component: resolve => require(['pages/supplier/SupplierList.vue'], resolve)
          component: SupplierList
        },
        {
          path: '/employManage',
          name: 'employManage',
          alias: '',
          component: resolve => require(['pages/employ/EmployList.vue'], resolve),
          meta: {keepAlive: true}
        },
        {
          path: '/employEdit',
          name: 'employEdit',
          alias: '',
          component: resolve => require(['pages/employ/EmployEdit.vue'], resolve)
        },
        {
          path: '/employDtl',
          name: 'employDtl',
          alias: '',
          component: resolve => require(['pages/employ/EmployDtl.vue'], resolve)
        },
        {
          path: '/roleManage',
          name: 'roleManage',
          alias: '',
          component: resolve => require(['pages/role/RoleList.vue'], resolve)
        },
        {
          path: '/roleEdit',
          name: 'roleEdit',
          alias: '',
          component: resolve => require(['pages/role/RoleEdit.vue'], resolve)
        },
        {
          path: '/roleDtl',
          name: 'roleDtl',
          alias: '',
          component: resolve => require(['pages/role/RoleDtl.vue'], resolve)
        },
        {
          path: '/warehouseList',
          name: 'warehouseList',
          alias: '',
          // component: resolve => require(['pages/warehouse/WarehouseList.vue'], resolve)
          component: WarehouseList
        },
        {
          path: '/logisticsList',
          name: 'logisticsList',
          alias: '',
          // component: resolve => require(['pages/logisticscompany/LogisticsList.vue'], resolve)
          component: LogisticsList
        },
        {
          path: '/skuList',
          name: 'skuList',
          alias: '',
          // component: resolve => require(['pages/sku/SkuList.vue'], resolve)
          component: SkuList,
          meta: {keepAlive: true}
        },
        {
          path: '/beginingInventoryList',
          name: 'beginingInventoryList',
          alias: '',
          // component: resolve => require(['pages/beginingInventory/List.vue'], resolve)
          component: BeginingInventoryList
        },
        {
          path: '/skuCategoryList',
          name: 'skuCategoryList',
          alias: '',
          // component: resolve => require(['pages/beginingInventory/List.vue'], resolve)
          component: SkuCategory,
          meta: {keepAlive: true}
        },
        {
          path: '/skuDetail',
          name: 'skuDetail',
          alias: '',
          // component: resolve => require(['pages/beginingInventory/List.vue'], resolve)
          component: SkuDetail
        },
        {
          path: '/skuEdit',
          name: 'skuEdit',
          alias: '',
          // component: resolve => require(['pages/sku/cmp/SkuEdit.vue'], resolve)
          component: SkuEdit
        },
        {
          path: '/enterpriceEdit',
          name: 'enterpriceEdit',
          alias: '',
          // component: resolve => require(['pages/beginingInventory/List.vue'], resolve)
          component: EnterpriceEdit
        },
        {
          path: '/businessSetting',
          name: 'businessSetting',
          alias: '',
          // component: resolve => require(['pages/beginingInventory/List.vue'], resolve)
          component: BusinessSetting
        },
        // {
        //   path: '/costList',
        //   name: 'costList',
        //   alias: '',
        //   // component: resolve => require(['pages/beginingInventory/List.vue'], resolve)
        //   component: CostList
        // },
        {
          path: '/purchaseGroupSetting',
          name: 'purchaseGroupSetting',
          alias: '',
          // component: resolve => require(['pages/beginingInventory/List.vue'], resolve)
          component: PurchaseGroupSetting
        },
        {
          path: '/test',
          name: 'test',
          alias: '',
          component: resolve => require(['pages/testPrint/Test.vue'], resolve)
        },
        {
          path: '/payAbleMenu',
          name: 'payAbleMenu',
          alias: '',
          meta: {keepAlive: true},
          component: PayAbleMenu
          // component: resolve => require(['pages/payablemenu/PayAbleMenu.vue'], resolve)
        },
        {
          path: '/payAbleMenuAdd',
          name: 'payAbleMenuAdd',
          alias: '',
          meta: '',
          component: PayAbleMenuAdd
          // component: resolve => require(['pages/payablemenu/PayAbleMenuAdd.vue'], resolve)
        },
        {
          path: '/payAbleMenuDtl',
          name: 'payAbleMenuDtl',
          alias: '',
          meta: '',
          component: PayAbleMenuDtl
          // component: resolve => require(['pages/payablemenu/PayAbleMenuDtl.vue'], resolve)
        },
        {
          path: '/accountBillList',
          name: 'accountBillList',
          params: {name: '结算单'},
          meta: {keepAlive: true},
          component: AccountBillList
          // component: resolve => require(['pages/account/AccountBillList.vue'], resolve)
        },
        {
          path: '/accountBillAdd',
          name: 'accountBillAdd',
          alias: '',
          meta: '',
          component: AccountBillAdd
          // component: resolve => require(['pages/account/AccountBillAdd.vue'], resolve)
        },
        {
          path: '/accountBillDtl',
          name: 'accountBillDtl',
          alias: '',
          meta: '',
          component: AccountBillDtl
          // component: resolve => require(['pages/account/AccountBillDtl.vue'], resolve)
        },
        {
          path: '/advancePayment',
          name: 'advancePayment',
          // alias: '',
          params: {name: '预付款单'},
          meta: {keepAlive: true},
          component: resolve => require(['pages/advancePayment/AdvancePaymentList.vue'], resolve)
        },
        {
          path: '/advancePaymentAdd',
          name: 'advancePaymentAdd',
          alias: '',
          meta: '',
          component: resolve => require(['pages/advancePayment/AdvancePaymentAdd.vue'], resolve)
        },
        {
          path: '/advancePaymentDetail',
          name: 'advancePaymentDetail',
          alias: '',
          meta: '',
          component: resolve => require(['pages/advancePayment/AdvancePaymentDtl.vue'], resolve)
        },
        {
          path: '/chargeList',
          name: 'chargeList',
          // alias: '',
          params: {name: '费用单'},
          meta: {keepAlive: true},
          component: resolve => require(['pages/charge/ChargeList.vue'], resolve)
        },
        {
          path: '/chargeAdd',
          name: 'chargeAdd',
          alias: '',
          meta: '',
          component: resolve => require(['pages/charge/ChargeAdd.vue'], resolve)
        },
        {
          path: '/chargeDetail',
          name: 'chargeDetail',
          alias: '',
          meta: '',
          component: resolve => require(['pages/charge/ChargeDetail.vue'], resolve)
        },
        {
          path: '/thirdReport',
          name: 'thirdReport',
          alias: '',
          meta: '',
          component: ThirdReport
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (from.name === 'login' && !store.state.user && to.name !== 'register') {
    next(false)
  } else {
    next()
  }
})
export default router
