<template>
  <qf-page-body class="inventory-check-view" :menu="menu">

    <div slot="actions">
      <inventory-detail-button :bill="bill" @getDetail="doGetDetail"></inventory-detail-button>
    </div>

    <qf-bill-body>
      <qf-bill-view-title slot="title" title="盘点单" :status="status">
        <span slot="tips">单号：{{bill.billNum}}</span>
        <div slot="actions">
          <qf-button type="default" @click="prev">上一单</qf-button>
          <qf-button type="default" @click="next">下一单</qf-button>
        </div>
      </qf-bill-view-title>
      <div slot="header">
        <qf-row>
          <qf-col :span="8">
            <qf-form-item label="仓库：">
            <span class="line-height-36"
                  v-if="bill.warehouse && bill.warehouse.name">{{bill.warehouse.name}}</span>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="经办人：">
              <span class="line-height-36" v-if="bill.manager && bill.manager.name">{{bill.manager.name}}</span>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="盘点日期：">
              <span class="line-height-36">{{bill.checkDate | dateFormatter}}</span>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row v-if="bill.externalBill && bill.externalBill.billNum && bill.externalBill.source ==='dpos'">
          <qf-col>
            <qf-form-item label="门店盘点单号：" label-width="80px;">
              <span class="line-height-36">{{bill.externalBill.billNum}}</span>
            </qf-form-item>
          </qf-col>
        </qf-row>
      </div>

      <qf-radio-group slot="toolbar" v-model="skuType" class="pull-right" @input="doSearchSkuLine">
        <qf-radio-button label="全部商品"></qf-radio-button>
        <qf-radio-button label="盘盈商品"></qf-radio-button>
        <qf-radio-button label="盘亏商品"></qf-radio-button>
      </qf-radio-group>
      <inventory-check-view-table slot="table" :data="bill.lines" :skuType="skuType"></inventory-check-view-table>
      <inventory-check-summary slot="summary" :bill="bill"></inventory-check-summary>

      <qf-row slot="remark">
        <qf-col :span="24">
          <qf-form-item label="备注：">
            <span class="line-height-36">{{bill.remark}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <operate-log-view slot="operateLog" class="operate-log" :logs="bill.operateLogs"></operate-log-view>
      <div slot="bottomActions">
        <inventory-detail-button :bill="bill" @getDetail="doGetDetail"></inventory-detail-button>
      </div>

    </qf-bill-body>

  </qf-page-body>
</template>

<script lang="ts" src="./InventoryCheckView.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-check-view {

    .line-height-36 {
      display: block;
      line-height: 20px;
      padding: 8px 0;
      word-wrap: break-word;
    }

    .font-tips {
      line-height: 36px;
      color: $--color-placeholder;
    }

    .pull-right {
      float: right;
    }

  }
</style>
