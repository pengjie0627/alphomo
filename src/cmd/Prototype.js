import { DateUtil } from 'fant'

Number.prototype.oldToFixed = Number.prototype.toFixed

/**
 * 全局原型定制
 */
export default class Prototype {
  static init () {
    // eslint-disable-next-line no-extend-native
    Date.prototype.toJSON = function () {
      return DateUtil.format(this, 'yyyy-MM-dd HH:mm:ss')
    }

    // var template1="我是{0}，今年{1}了";
    // var result1=template1.format("loogn",22);
    // eslint-disable-next-line
    String.prototype.format = function(args) {
      var result = this
      if (arguments.length > 0) {
        if (arguments.length === 1 && typeof (args) === 'object') {
          for (let key in args) {
            if (args[key] !== undefined) {
              let reg = new RegExp('({' + key + '})', 'g')
              result = result.replace(reg, args[key])
            }
          }
        } else {
          for (let i = 0; i < arguments.length; i++) {
            if (arguments[i] !== undefined) {
              // var reg = new RegExp('({[' + i + ']})', 'g')//这个在索引大于9时会有问题，谢谢何以笙箫的指出
              let reg = new RegExp('({)' + i + '(})', 'g')
              result = result.replace(reg, arguments[i])
            }
          }
        }
      }
      return result
    }

    // var template = "I Love {0}";
    // String.format(template, "You")
    String.format = function () {
      if (arguments.length === 0) {
        return null
      }

      var str = arguments[0]
      for (let i = 1; i < arguments.length; i++) {
        let re = new RegExp('\\{' + (i - 1) + '\\}', 'gm')
        str = str.replace(re, arguments[i])
      }
      return str
    }

    Number.prototype.toFixed = function(n) {
      if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20')
      }

      var number = this
      if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString()
      }
      if (typeof (n) === 'undefined' || n === 0) {
        return (Math.round(number)).toString()
      }
      var result = Math.round(number * Math.pow(10, n)) / Math.pow(10, n)
      return result.oldToFixed(n)
    }

    Number.prototype.scale = function (n) {
      var number = this
      if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number
      }
      if (typeof (n) === 'undefined' || n === 0) {
        return Math.round(number)
      }
      return Math.round(number * Math.pow(10, n)) / Math.pow(10, n)
    }

    Date.prototype.clearTime = function () {
      return DateUtil.clearTime(this)
    }

    Date.prototype.addDate = function (n) {
      return DateUtil.addDate(this, n)
    }

    Date.prototype.addMonth = function (n) {
      return DateUtil.addMonth(this, n)
    }

    Date.prototype.addYear = function (n) {
      return DateUtil.addYear(this, n)
    }
  }
}
