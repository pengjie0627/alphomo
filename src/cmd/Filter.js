import Vue from 'vue';

import { DateUtil, NumberUtil } from 'fant';
// import OutventoryOutView from "../pages/inventory/InventoryOutView";

/**
 * 过滤器定制
 */
export default class Filter {
  static init() {
    Vue.filter('fmt', function (value, format) {
      if (!value && value !== 0) return '';
      if (value instanceof Date) {
        return DateUtil.format(value, format);
      } else if (typeof value === 'number') {
        return NumberUtil.format(value, format);
      }
      return value;
    });
    Vue.filter('businessType', function (value) {
      if (value) {
        switch (value) {
          case 'Purchase':
            return '进货';
          case 'Sale':
            return '销售';
          case 'CheckInventory':
            return '盘点';
          case 'InventoryTransfer':
            return '调拨';
          case 'PurchaseReturn':
            return '进货退货';
          case 'SaleReturn':
            return '销售退货';
          case 'OtherPaymentLine':
            return '其他支出';
          case 'OtherReceiptLine':
            return '其他收出';
        }
      }
    });

    Vue.filter('customerCategory', function (value) {
      if (value && value == 'JOIN')
        return '加盟店';
      return '一般客户';
    });

    Vue.filter('taxRateFormatter', function (value) {
      if (value && value > 0) {
        return Number(value).toFixed(2) + '%';
      } else {
        return '0.00%';
      }
    });
    Vue.filter('accountAuditStatus', function (value) {
      if (value) {
        switch (value) {
          case 'UNAUDITED':
            return '未审核';
          case 'AUDITED':
            return '已审核';
          case 'ABOLISHED':
            return '已作废';
        }
      }
    });

    Vue.filter('priceSixBit', function (value) {
      if (value && Number(value) !== 0) {
        return Number(value).toFixed(6)
      } else {
        return '0.000000'
      }
    });

    Vue.filter('priceFourBit', function (value) {
      if (value && Number(value) !== 0) {
        return Number(value).toFixed(4)
      } else {
        return '0.0000'
      }
    });

    Vue.filter('PriceBit', function (value, bit) {
      if (Number(value) < 0) {
        bit = 0;
      }
      if (value && Number(value) !== 0) {
        return Number(value).toFixed(bit)
      } else {
        return Number(0).toFixed(bit)
      }
    });
  }
}
