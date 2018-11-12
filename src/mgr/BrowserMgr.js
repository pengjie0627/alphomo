import { CommonUtil, EnvUtil } from 'fant'

/**
 * 缓存管理器
 */
export const storage = {
  getItem: function (key, namespace, defaultValue) {
    if (namespace) {
      key = namespace + '-' + key
    }
    var value = null
    if (window.top.java) {
      value = window.top.java.getStorageItem(key)
    } else {
      value = localStorage.getItem(key)
    }
    if (value) {
      return JSON.parse(value)
    } else if (arguments.length === 3) {
      return defaultValue
    }
    return value
  },

  setItem: function (key, value, namespace) {
    if (namespace) {
      key = namespace + '-' + key
    }
    value = JSON.stringify(value)
    if (window.top.java) {
      window.top.java.setStorageItem(key, value)
    } else {
      localStorage.setItem(key, value)
    }
  },

  clearItem: function (key, namespace) {
    if (namespace) {
      key = namespace + '-' + key
    }
    if (window.top.java) {
      window.top.java.removeStorageItem(key)
    } else {
      localStorage.removeItem(key)
    }
  },

  clearPreItem: function (key, namespace) {
    if (namespace) {
      key = namespace + '-' + key
    }
    let teapAry = []
    for (let i = 0, len = localStorage.length; i < len; i++) {
      teapAry.push(localStorage.key(i))
    }
    for (let i = 0, len = teapAry.length; i < len; i++) {
      let key0 = teapAry[i]
      if (key0 === null || !key0) {
        return
      }
      if (key0.indexOf(key) !== -1) {
        storage.clearItem(key0)
      }
    }
  }
}

export const sessionStorage = {
  getItem: function (key) {
    var value = window.top.sessionStorage.getItem(key)
    if (value === 'undefined') {
      return null
    }
    if (value) {
      return JSON.parse(value)
    }
    return value
  },

  setItem: function (key, value) {
    window.top.sessionStorage.setItem(key, JSON.stringify(value))
  },

  clearItem: function (key) {
    window.top.sessionStorage.removeItem(key)
  }
}

export const device = {
  getVersion() {
    if (window.top.java) {
      return window.top.java.getVersion()
    } else {
      return ''
    }
  },

  getMachineCode: function () {
    var sMachineCode = ''
    // dbrowser下的应用
    if (window.top.java) {
      try {
        sMachineCode = window.java.getNewMachineCode()
        if (!sMachineCode) {
          sMachineCode = window.java.getMachineCod()
        }
      } catch (e) {
        sMachineCode = window.java.getMachineCod()
      }
    } else {
      sMachineCode = storage.getItem('lion.machineCode')
      if (!sMachineCode) {
        sMachineCode = CommonUtil.uuid()
        storage.setItem('lion.machineCode', sMachineCode)
      }
    }
    return sMachineCode
  },

  // 打开外部链接
  openNewBrowserWindow(sUrl) {
    if (!sUrl) return false
    if (window.java) {
      window.java.openUrl(sUrl)
    } else {
      window.open(sUrl)
    }
  }
}

export const customer = {
  list: {
    frxingsheng: {
      name: '芙蓉兴盛',
      url: 'http://b2b.frxs.com'
    },
    koubei: {
      name: '口碑',
      url: ''
    },
    taian: {
      name: '小象掌柜',
      url: ''
    },
    default: {
      name: '千帆掌柜',
      url: 'http://www.qianfan123.com'
    }
  },

  getCurrent() {
    var customChannel = CommonUtil.getQueryParam('channel') || 'default'
    var imgUrl = EnvUtil.getOssUrl(`custom/${customChannel}/${customChannel}`)
    return {
      id: customChannel,
      name: customer.list[customChannel].name,
      logo: `${imgUrl}.png`,
      logoTitle: `${imgUrl}_title.png`,
      logoHeadTicket: `${imgUrl}_headReceipt.png`,
      logoTicket: `${imgUrl}_receipt.png`,
      logoAbout: `${imgUrl}_about.png`,
      url: customer.list[customChannel].url
    }
  }
}

export const scales = {
  ledShow(str, hanz, color) {
    function hanzConvertor(hanz) {
      var ret = 0
      // 0:空 1:单价 2:总计 3:收款 4:找零
      switch (hanz) {
        case '单价':
          ret = 1
          break
        case '总计':
          ret = 2
          break
        case '收款':
          ret = 3
          break
        case '找零':
          ret = 4
          break
      }
      return parseInt(ret)
    }

    if (!color) {
      color = 'green'
    }

    try {
      str = str.toString()
      if (window.top.led && window.top.led.show) {
        window.top.led.show(hanzConvertor(hanz), str)
        return true
      } else {
        console.log('客显屏打印:' + hanz + ' (' + hanzConvertor(hanz) + ') ' + str)
        return false
      }
    } catch (err) {
      if (console) console.error('setClientView错误:' + err.message)
      return false
    }
  },

  ledClear() {
    try {
      if (window.top.led && window.top.led.clear) {
        window.top.led.clear()
      }
      return true
    } catch (err) {
      if (console) console.error('clearClientView错误:' + err.message)
      return false
    }
  },

  read() {
    try {
      // status: 0 成功； 1 串口异常； 2 数据异常
      if (window.top.scalesserial && window.top.scalesserial.get) {
        return JSON.parse(window.top.scalesserial.get())
      } else {
        return { data: '', msg: '千帆软件版本需要更新，请升级后使用。', status: 2 }
      }
    } catch (err) {
      if (console) console.error('lionApi.scalesSerial 错误:' + err.message)
      return { data: '', msg: 'lionApi.scalesSerial err: ' + err.m, status: 2 }
    }
  }
}

export const subView = {
  openedSubViewModule: '',
  openedSubViewModel: '',

  close() {
    try {
      subView.openedSubViewModule = ''
      subView.openedSubViewModel = ''
      window.top.subview.closeSideScreen()
    } catch (e) {
      if (console) console.warn('关闭副屏失败!')
    }
  },

  /*
   * 方法:打开副屏
   * */
  open(module, isForce) {
    if (module == null || module === '') {
      if (subView.openedSubViewModule === '') {
        module = 'sale'
      } else {
        module = subView.openedSubViewModule
      }
    }

    if (!window.top.subview) {
      console.log('打开副屏失败: 不在DBrowser中')
      return false
    }

    var displayConfig = JSON.parse(window.top.sessionStorage.getItem('shopConfig')).displayConfig
    var shopPos = JSON.parse(window.top.sessionStorage.getItem('pos'))

    try {
      // 新版本的dbrowser
      if (displayConfig == null) {
        subView.openedSubViewModule = ''
        subView.openedSubViewModel = ''
        console.warn('打开副屏失败, 没有配置信息')
        return false
      }
      if (shopPos == null) {
        subView.openedSubViewModule = ''
        subView.openedSubViewModel = ''
        console.warn('打开副屏失败, 没有绑定POS机')
        return false
      }
      if (shopPos.sideScreenOpend === false) {
        subView.openedSubViewModule = ''
        subView.openedSubViewModel = ''
        subView.closeSubView && subView.closeSubView()
        subView.close && subView.close()
        return false
      }
      if (!displayConfig.model) {
        displayConfig.model = 'advertisement'
      }
      // 如果已经打开过同页面类型的副屏, 则不需要再打开了.
      if (subView.openedSubViewModule === module.toLowerCase() && subView.openedSubViewModel === displayConfig.model && isForce !== true) return true
      subView.openedSubViewModel = displayConfig.model

      var sTitleHtml = EnvUtil.getOssUrl('subview/saleDetail/SaleInfo.html')
      var sDetailHtml = ''
      if (module.toLowerCase() === 'sale') {
        if (displayConfig.model === 'advertisement') {
          sTitleHtml = EnvUtil.getOssUrl('subview/saleDetail/SaleInfo.html')
          sDetailHtml = ''
        }

        if (displayConfig.model === 'saleDetails') {
          sTitleHtml = EnvUtil.getOssUrl('subview/saleDetail/SaleTitle.html')
          sDetailHtml = EnvUtil.getOssUrl('subview/saleDetail/SaleDetail.html')
        }
      }
      if (module.toLowerCase() === 'salereturn') {
        if (displayConfig.model === 'advertisement') {
          sTitleHtml = EnvUtil.getOssUrl('subview/saleDetail/SaleInfo.html')
          sDetailHtml = ''
        }

        if (displayConfig.model === 'saleDetails') {
          sTitleHtml = EnvUtil.getOssUrl('subview/saleDetail/SaleTitle.html')
          sDetailHtml = EnvUtil.getOssUrl('subview/saleDetail/SaleDetail.html')
        }
      }
      if (module.toLowerCase() === 'finance') {
        displayConfig.model = 'advertisement'
        subView.openedSubViewModel = 'advertisement'
        sTitleHtml = EnvUtil.getOssUrl('subview/dpmInfo/dpmInfo.html')
        sDetailHtml = ''
      }

      // 打开副屏
      var imgUrlList = []
      for (var i = 0; i < displayConfig.images.length; i++) {
        imgUrlList.push(displayConfig.images[i].url)
      }
      if (imgUrlList.length === 0) imgUrlList = null

      var subViewObj = {
        model: displayConfig.model,
        titleHtml: sTitleHtml,
        detailHtml: sDetailHtml,
        advertisements: {
          stayTimes: displayConfig.stayTimes,
          // audio: displayConfig.audio,
          images: imgUrlList
        }
      }
      var obj = {
        curCustomer: customer.getCurrent()
      }
      var concatData = Object.assign(obj, subViewObj)
      window.top.subview.openSideScreen(JSON.stringify(concatData))
      subView.openedSubViewModule = module.toLowerCase()
      return true
    } catch (e) {
      // 旧版本的DBrowser
      // 如果已经打开过同页面类型的副屏, 则不需要再打开了.
      if (subView.openedSubViewModule === module.toLowerCase()) return true

      if (window.top.subview.openSideScreen) {
        return false
      }

      if (module.toLowerCase() === 'sale') {
        window.top.subview.showCustomer(EnvUtil.getOssUrl('subview/saleInfo/SaleInfo.html'))
      }
      if (module.toLowerCase() === 'salereturn') {
        window.top.subview.showCustomer(EnvUtil.getOssUrl('subview/saleInfo/SaleInfo.html'))
      }
      if (module.toLowerCase() === 'finance') {
        window.top.subview.showCustomer(EnvUtil.getOssUrl('subview/dpmInfo/dpmInfo.html'))
      }
      subView.openedSubViewModule = module.toLowerCase()

      if (console) console.log('打开副屏不需要特殊操作, 还是用旧版DBrowser, 自动打开')
      return true
    }
  },

  setDataAdapter(func, data, module) {
    let scaleData = CommonUtil.copy(data)
    if (func === 'setSaleData') {
      scaleData.realAmount = data.amount
    }
    if (func === 'setSettleData') {
      scaleData.realAmount = data.amount
      scaleData.payAmount = scaleData.amount - scaleData.discountAmount
      if (data.changeAmount) {
        scaleData.charge = data.changeAmount
        scaleData.chargeText = '找零'
      } else {
        scaleData.chargeText = '剩余'
      }
    }
    if (func === 'setSaleReturnData') {
      scaleData.realAmount = data.amount
    }

    subView.setData(func, scaleData, module)
  },
  /*
   * 方法: 设置副屏 LION-341
   * 参数: func: 命令: 字符串 :
   setSaleData: 销售时界面
   setSettleData: 结算时界面
   setSaleReturnData: 退款时界面，prd中暂无，显示内容暂定为 退款商品、合计、优惠、总数、实退
   setSettleReturnData: 退款结算时界面， prd中暂无，显示内容暂定为 退款商品、应退、实退、优惠、现金
   setData: 金融
   * 参数: data: json字符串
   * 参数: module: 功能: sale (销售), saleReturn (销售退), finance (金融)
   * */
  setData(func, data, module) {
    try {
      if (window.top.subview) {
        // 打开副屏
        if (!subView.open(module)) return false

        try {
          // 新接口
          var obj = {
            curCustomer: customer.getCurrent()
          }
          var concatData = Object.assign(obj, data)
          if (concatData && concatData.lines) {
            for (let line of concatData.lines) {
              line.amount = parseFloat(line.amount).toFixed(2)
              line.price = parseFloat(line.price).toFixed(2)
            }
          }
          window.top.subview.setSideScreenData(func, JSON.stringify(concatData))
        } catch (e) {
          // 老接口
          window.top.subview.showCustomer(func, JSON.stringify(data))
        }

        return true
      } else {
        // console.log('副屏显示' + func + ' ' + JSON.stringify(data))
        return false
      }
    } catch (err) {
      console.error('setData错误:' + err.message)
      return false
    }
  },

  /*
   * 方法: 清理副屏
   * */
  clear() {
    return (subView.setData('showWelcome', {
      'shopName': sessionStorage.getItem('shop').shortName,
      'curCustomer': customer.getCurrent()
    }))
  }
}

export default { storage, sessionStorage, device, subView, scales }
