<template>
  <qf-page-body class="inventory-transfer-view" :menu="menu">

    <div slot="actions">
      <inventory-detail-button v-if="bill" :bill="bill" @getDetail="doGetDetail"></inventory-detail-button>
    </div>

    <qf-bill-body>
      <qf-bill-view-title slot="title" title="调拨单" :status="status">
        <span slot="tips">单号：{{bill.billNum}}</span>
        <div slot="actions">
          <qf-button type="default" @click="prev">上一单</qf-button>
          <qf-button type="default" @click="next">下一单</qf-button>
        </div>
      </qf-bill-view-title>

      <qf-row slot="header">
        <qf-col :span="8">
          <qf-form-item label="调出仓库：">
            <span class="line-height-36"
                  v-if="bill.outWarehouse && bill.outWarehouse.name">{{bill.outWarehouse.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="经办人：">
            <span class="line-height-36" v-if="bill.manager && bill.manager.name">{{bill.manager.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="业务日期：">
            <span class="line-height-36">{{bill.transferDate | dateFormatter}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row slot="header">
        <qf-col :span="8">
          <qf-form-item label="调入仓库：">
            <span class="line-height-36"
                  v-if="bill.inWarehouse && bill.inWarehouse.name">{{bill.inWarehouse.name}}</span>
          </qf-form-item>
        </qf-col>

        <qf-col :span="8">
          <qf-form-item label="单据类型：">
            <span class="line-height-36">{{bill.category | categoryFormatter}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="外部单号：">
            <span class="line-height-36">
                 {{bill.externalBillNum}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <inventory-view-table slot="table" :data="bill.lines"></inventory-view-table>

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

<script lang="ts" src="./InventoryTransferView.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-transfer-view {

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

  }
</style>
