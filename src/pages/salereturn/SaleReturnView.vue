<template>
  <qf-page-body :menu="menu" class="sale-return-sale-return-view">
    <qf-table v-show="false"></qf-table>
    <div slot="actions">
      <sale-return-view-button :bill="bill" @getDetail="getSaleReturn"></sale-return-view-button>
    </div>
    <bill-body class="sale-return-sale-return-view-body">
      <sale-return-title slot="title" :bill="bill" @getSaleReturn="onGetSaleReturn" :presentation="presentation"
                         :ids="ids"
                         :query="query"></sale-return-title>
      <qf-row class="sale-return-view-header" slot="header">
        <qf-col :span="6">
          <qf-form-item class="sku-code" label="客户：" labelWidth="70px">
            <span v-if="bill.customer.name">{{bill.customer.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="6">
          <qf-form-item class="sku-code" label="仓库：" labelWidth="70px">
            <span v-if="bill.warehouse.name">{{bill.warehouse.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="6">
          <qf-form-item class="sku-code" label="经办人：" labelWidth="70px">
            <span v-if="bill.manager.name">{{bill.manager.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="6">
          <qf-form-item class="sku-code" label="业务日期：" labelWidth="70px">
            <span>{{bill.businessDate | dateFormatter}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <sale-return-view-table :bill="bill" slot="table"></sale-return-view-table>
      <sale-return-view-summary slot="summary" :bill="bill"></sale-return-view-summary>
      <div slot="remark" class="sale-return-view-header">
        <qf-form-item label="备注：">
          <div style="line-height: 16px" class="remark">{{bill.remark}}</div>
        </qf-form-item>
      </div>

      <operate-log-view slot="operateLog" class="operate-log" :logs="bill.operateLogs"></operate-log-view>
      <div slot="bottomActions">
        <sale-return-view-button :bill="bill" @getDetail="getSaleReturn"></sale-return-view-button>
      </div>
    </bill-body>

  </qf-page-body>
</template>
<script lang="ts" src="./SaleReturnView.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .sale-return-sale-return-view {
    background: $--color-bg-light;
    .sale-return-sale-return-view-body {
      padding: 20px;
      background: #ffffff;
      .sale-return-view-header {
        line-height: 35px;
      }
      .remark {
        word-break: break-all;
        display: inline-block;
        height: 100%;
        padding: 10px 0;
      }
    }
  }

</style>
