<template>
  <qf-page-body :menu="menu" class="purchase-detail">
    <qf-table v-show="false"></qf-table>
    <div slot="actions">
      <detail-button :bill="bill" @getDetail="getPurchase"></detail-button>
    </div>
    <bill-body class="purchase-detail-body">
      <purchase-title slot="title" :bill="bill" @getPurchase="onGetPurchase" :presentation="presentation" :ids="ids"
                      :query="query"></purchase-title>
      <qf-row class="purchase-view-header" slot="header">
        <qf-col :span="6">
          <qf-form-item class="sku-code" label="供应商：" labelWidth="70px">
            <span>{{bill.supplier.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="6">
          <qf-form-item class="sku-code" label="仓库：" labelWidth="70px">
            <span>{{bill.warehouse.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="6">
          <qf-form-item class="sku-code" label="经办人：" labelWidth="70px">
            <span>{{bill.manager.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="6">
          <qf-form-item class="sku-code" label="业务日期：" labelWidth="70px">
            <span>{{bill.businessDate | dateFormatter}}</span>
          </qf-form-item>
        </qf-col>

      </qf-row>

      <detail-table :bill="bill" slot="table"></detail-table>
      <purchase-view-summary slot="summary" :bill="bill"></purchase-view-summary>
      <div slot="remark" class="purchase-view-header">
        <qf-form-item label="备注：">
          <span class="remark">{{bill.remark}} </span>
        </qf-form-item>
      </div>

      <operate-log-view slot="operateLog" class="operate-log" :logs="bill.operateLogs"></operate-log-view>
      <div slot="bottomActions">
        <detail-button :bill="bill" @getDetail="getPurchase"></detail-button>
      </div>
    </bill-body>

  </qf-page-body>
</template>
<script lang="ts" src="./PurchaseView.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .purchase-detail {
    background: $--color-bg-light;
    .detail-title {
      line-height: 36px;
      .title-info {
        margin-top: 2px;
        padding: 10px 0;
        border-top: 1px solid $--color-font-light-3;
        border-bottom: 1px dashed $--color-font-light-3;
      }
    }
    .purchase-detail-body {
      padding: 20px;
      background: #ffffff;
      .purchase-view-header {
        line-height: 36px;
      }
      .remark {
        line-height: 35px;
      }
    }
  }

</style>
