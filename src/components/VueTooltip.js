import Tooltip from 'components/Tooltip'
import Vue from 'vue'
import CommonUtil from 'util/CommonUtil'

const VueTooltip = function (target, options) {
  var tooltip = new (Vue.extend(Tooltip))()
  CommonUtil.apply(tooltip.$props, options)
  tooltip.reference = target
  tooltip.$mount()

  document.body.appendChild(tooltip.$el)
  tooltip.show()

  return tooltip
}

export default VueTooltip
