<template>
  <qf-page-body class="inventory-out-view" :menu="menu">

    <div slot="actions">
      <inventory-button :bill="bill" @getDetail="doGetDetail"></inventory-button>
    </div>

    <qf-bill-body>
      <qf-bill-view-title slot="title" title="出库单" :status="status">
        <span slot="tips">单号：{{bill.billNum}}</span>
        <div slot="actions">
          <qf-button type="default" @click="prev">上一单</qf-button>
          <qf-button type="default" @click="next">下一单</qf-button>
        </div>
      </qf-bill-view-title>

      <qf-row slot="header" align="center">
        <qf-col :span="8">
          <qf-form-item label="出库仓库：">
            <span class="line-height-36" v-if="bill.warehouse && bill.warehouse.name">{{bill.warehouse.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="经办人：">
            <span class="line-height-36" v-if="bill.manager && bill.manager.name">{{bill.manager.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="业务日期：">
            <span class="line-height-36">{{bill.businessDate | dateFormatter}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row slot="header">
        <qf-col :span="8">
          <qf-form-item label="关联业务：">
            <span class="line-height-36" v-if="bill.source && bill.source.billNum">{{bill.source.billType | businessType}}{{'  ' + bill.source.billNum}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="往来单位：">
            <span class="line-height-36">{{bill.source ? bill.source.billName : ''}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="订单号：">
            <span class="line-height-36">{{bill.externalBillNum}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <inventory-view-table slot="table" :data="bill.lines"></inventory-view-table>

      <qf-row slot="remark">
        <qf-col :span="8">
          <qf-form-item label="物流公司：">
            <span class="line-height-36" v-if="bill.thinLogistics && bill.thinLogistics.companyName">{{bill.thinLogistics.companyName}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="物流单号：">
            <span class="line-height-36"
                  v-if="bill.thinLogistics && bill.thinLogistics.num">{{bill.thinLogistics.num}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label-width="110px" label="预估到货日期：">
            <span class="line-height-36" v-if="bill.thinLogistics && bill.thinLogistics.estimatedTime">{{bill.thinLogistics.estimatedTime}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row slot="remark">
        <qf-col :span="24">
          <qf-form-item label="备注：">
            <span class="line-height-36">{{bill.remark}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <p slot="operateLog" class="font-tips" v-if="bill.creator && bill.creator.name">制单：{{bill.creator.name}}
        {{bill.created}}</p>
      <p slot="operateLog" class="font-tips"
         v-if="bill.lastModifier && bill.lastModifier.name && bill.status !== 'UNAUDITED'">出库：{{bill.lastModifier.name}}
        {{bill.lastModified}}</p>

      <div slot="bottomActions">
        <inventory-button :bill="bill" @getDetail="doGetDetail"></inventory-button>
      </div>

    </qf-bill-body>

  </qf-page-body>
</template>

<script lang="ts" src="./InventoryOutView.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-out-view {

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
