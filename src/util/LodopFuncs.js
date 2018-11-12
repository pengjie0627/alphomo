const Lodop = {
  getLodop: function (oOBJECT, oEMBED) {
    var LODOP
    try {
      try {
        LODOP = window.getCLodop()
      } catch (err) {
      }

      if (!LODOP && document.readyState !== 'complete') {
        alert('C-Lodop没准备好，请稍后再试！')
        return
      }

      // 清理原例子内的object或embed元素，避免乱提示：
      if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED)
      if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT)

      return LODOP
    } catch (err) {
      alert('getLodop出错:' + err)
    }
  },
  needCLodop: function () {
    return true // 本例子强制所有浏览器都调用C-Lodop
  },
  onReturn: function (callback) {
    window.CLODOP.On_Return = function (TaskID, Value) {
      callback(Value)
    }
  },
  chenckInstall: function () {
    try {
      var LODOP = window.getLodop()
      if (LODOP.VERSION) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }
}
export default Lodop
