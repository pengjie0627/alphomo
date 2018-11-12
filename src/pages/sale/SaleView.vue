<template>
  <qf-page-body :menu="menu" class="sale-sale-view">
    <qf-table v-show="false"></qf-table>
    <div slot="actions">
      <sale-view-button :bill="bill" @getDetail="getSale"></sale-view-button>
    </div>
    <bill-body class="sale-sale-view-body">
      <sale-title slot="title" :bill="bill" @getSale="onGetSale" :presentation="presentation" :ids="ids"
                  :query="query"></sale-title>
      <qf-row class="sale-view-header" slot="header">
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

      <sale-view-table :bill="bill" slot="table"></sale-view-table>
      <sale-view-summary slot="summary" :bill="bill"></sale-view-summary>
      <div slot="remark" class="sale-view-header">
        <qf-form-item label="备注：">
          <div style="line-height: 16px" class="remark">{{bill.remark}}</div>
        </qf-form-item>
      </div>

      <operate-log-view slot="operateLog" class="operate-log" :logs="bill.operateLogs"></operate-log-view>
      <div slot="bottomActions">
        <sale-view-button :bill="bill" @getDetail="getSale"></sale-view-button>
      </div>
    </bill-body>

  </qf-page-body>
</template>
<script lang="ts" src="./SaleView.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .sale-sale-view {
    background: $--color-bg-light;
    .sale-sale-view-body {
      padding: 20px;
      background: #ffffff;
      .sale-view-header {
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
