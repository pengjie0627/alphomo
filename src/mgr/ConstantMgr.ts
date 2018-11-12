export const backendMenus = [
  {
    name: '首页',
    code: 'home',
    icon: 'ic-ic_home',
    url: '/home',
    home: true
  },
  {
    name: '采购',
    code: 'purchase',
    icon: 'ic-ic_stock',
    permissions: [],
    children: [
      {
        name: '进货',
        code: 'purchase',
        url: '/purchaseList'
      },
      {
        name: '进货退货',
        code: 'purchaseReturn',
        url: '/purchaseReturnList'
      }
    ]
  },
  {
    name: '销售',
    code: 'sale',
    icon: 'ic-ic_sale',
    permissions: [],
    children: [
      {
        name: '销售',
        code: 'sale',
        url: '/saleList'
      },
      {
        name: '销售退货',
        code: 'saleReturn',
        url: '/saleReturnList'
      }
    ]
  },
  {
    name: '库存',
    code: 'inventory',
    icon: 'ic-ic_inventory',
    permissions: [],
    children: [
      {
        name: '库存查询',
        code: 'view',
        url: '/inventoryList'
      },
      {
        name: '盘点',
        code: 'check',
        url: '/inventoryCheckList'
      },
      {
        name: '调拨',
        code: 'allocation',
        url: '/inventoryTransferList'
      },
      {
        name: '入库管理',
        code: 'storage',
        url: '/inventoryInList'
      },
      {
        name: '出库管理',
        code: 'deliver',
        url: '/inventoryOutList'
      },
      {
        name: '期初库存',
        code: 'beginning',
        url: '/beginingInventoryList'
      }
    ]
  },
  {
    name: '零售',
    code: 'retail',
    icon: 'icon-ic_goods',
    permissions: [],
    children: [
      {
        name: '门店',
        code: 'retail',
        url: '/shopList'
      }
    ]
  },
  {
    name: '财务',
    firName: '基础资料',
    secName: '供应商',
    thirdName: '客户',
    code: 'finance',
    icon: 'icon-ic_cwgl',
    permissions: [],
    children: [
      {
        name: '科目',
        code: 'category',
        url: '/accountCategoryList'
      }
    ],
    secChildren: [
      {
        name: '结算单',
        code: 'supplierStatement',
        url: '/accountBillList'
      },
      {
        name: '付款单',
        code: 'payment',
        url: '/payAbleMenu'
      },
      {
        name: '预付款单',
        code: 'payment',
        url: '/advancePayment'
      },
      {
        name: '费用单',
        code: 'charge',
        url: '/chargeList'
      }
    ],
    thirdChildren: [
      {
        name: '收款单',
        code: 'receivable',
        url: '/receivableList'
      }
    ]
  },
  {
    name: '报表',
    firName: '商品报表',
    secName: '财务报表',
    thirdName: '门店报表',
    code: 'report',
    icon: 'icon-ic_shuju',
    permissions: [],
    children: [
      {
        name: '进货报表',
        code: 'purchase',
        url: '/sellRptList'
      },
      {
        name: '销售报表',
        code: 'sale',
        url: '/saleRptList'
      },
      {
        name: '库存报表',
        code: 'inventory',
        url: '/storageRptList'
      }
    ],
    secChildren: [
      {
        name: '收支报表',
        code: 'finance',
        url: '/balanceRptList'
      }
    ],
    thirdChildren: [
      {
        name: '自定义报表1',
        code: 'finance',
        url: '/thirdReport'
      },
      {
        name: '自定义报表2',
        code: 'finance',
        url: '/thirdReport'
      }
    ]
  },
  {
    name: '基础资料',
    code: 'basicdata',
    icon: 'icon-ic_jcwj',
    permissions: [],
    children: [
      {
        name: '供应商',
        code: 'supplier',
        url: '/supplierList'
      },
      {
        name: '客户',
        code: 'customer',
        url: '/customerList'
      },
      {
        name: '商品',
        code: 'sku',
        url: '/skuList'
      },
      {
        name: '仓库',
        code: 'warehouse',
        url: '/warehouseList'
      },
      {
        name: '物流公司',
        code: 'LogisticsCompany',
        url: '/logisticsList'
      }
    ]
  },
  {
    name: '系统设置',
    code: 'system',
    icon: 'ic-ic_device_setting_se',
    permissions: [],
    children: [
      {
        name: '员工管理',
        code: 'system',
        url: '/employManage'
      },
      {
        name: '角色管理',
        code: 'system',
        url: '/roleManage'
      },
      {
        name: '企业设置',
        code: 'system',
        url: '/enterpriceEdit'
      },
      {
        name: '业务设置',
        code: 'system',
        url: '/businessSetting'
      },
      {
        name: '采购组设置',
        code: 'system',
        url: '/purchaseGroupSetting'
      }
    ]
  }
]
export const limits = {
  sale: {
    billNum: 32,
    name: 32,
    custom: 32,
    includes: 32,
    code: 64
  },
  saleReturn: {
    billNum: 32,
    name: 32,
    custom: 32,
    includes: 32,
    code: 64
  },
  search: {
    keyword: 64
  },
  inventory: {
    billNum: 32,
    name: 32,
    supplier: 32,
    includes: 32,
    code: 64,
    remark: 140,
    keyword: 64,
    amount: 9,
    inventory: 6,
    sumAmount: 12
  },
  purchase: {
    billNum: 32,
    name: 32,
    supplier: 32,
    includes: 32,
    code: 64,
    remark: 140
  },
  purchaseReturn: {
    billNum: 32,
    name: 32,
    supplier: 32,
    includes: 32,
    code: 64,
    remark: 140
  },
  payable: {
    billNum: 32,
    name: 32,
    supplier: 32,
    includes: 32,
    code: 64,
    amount: 16,
    remark: 140
  },
  receivable: {
    billNum: 32,
    name: 32,
    supplier: 32,
    customer: 32,
    includes: 32,
    code: 64,
    remark: 140
  },
  customer: {
    code: 12,
    name: 20,
    address: 60,
    postcode: 6,
    contact: 10,
    mobile: 13,
    telephone: 13,
    qq: 15,
    email: 32,
    fax: 13,
    amount: 16,
    keywords: 32
  },
  supplier: {
    code: 12,
    name: 20,
    address: 60,
    postcode: 6,
    contact: 10,
    mobile: 13,
    qq: 15,
    email: 32,
    fax: 13,
    amount: 16,
    keywords: 32,
    invoiceTitle: 20,
    registrationNo: 20,
    bankName: 20,
    bankAccount: 19
  },
  warehouse: {
    code: 4,
    name: 20,
    address: 60,
    postcode: 6,
    contact: 10,
    mobile: 13,
    qq: 15,
    email: 32,
    fax: 13,
    amount: 16,
    keywords: 32
  },
  logisticscompany: {
    name: 20,
    address: 60,
    postcode: 6,
    contact: 10,
    mobile: 13,
    qq: 15,
    email: 32,
    fax: 13,
    amount: 16,
    keywords: 32
  },
  sku: {
    name: 128,
    code: 16,
    munit: 12,
    barcode: 14,
    spec: 12,
    amount: 9,
    categoryCode: 12,
    categoryName: 12,
    externalCode: 16,
    brand: 16,
    origin: 16,
    smartCodes: 32,
    taxClassification: 19
  },
  shop: {
    code: 4,
    name: 20,
    address: 60,
    postcode: 6,
    contact: 10,
    mobile: 13,
    telephone: 13,
    qq: 15,
    email: 20,
    fax: 13,
    amount: 16,
    keywords: 32
  }
}
export const tips = {
  // saveNewSuccessTip: '新增成功!',
  saveModifySuccessTip: '保存成功!',
  // saveNewAndModifySuccessTip: '保存并新增成功!',
  saveNewAndModifySuccessTip: '保存成功!',
  saveNewAndAuditSuccessTip: '保存并审核成功!'
}
export default {
  backendMenus,
  limits,
  tips
}

