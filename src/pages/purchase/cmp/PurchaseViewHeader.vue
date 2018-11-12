<template>
  <qf-row class="purchase-view-header">
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
        <span>{{bill.businessDate}}</span>
      </qf-form-item>
    </qf-col>

  </qf-row>
</template>

<script lang="ts" src="./PurchaseViewHeader.ts"></script>

<style lang="scss">
  .purchase-view-header {
    line-height: 36px;
  }
</style>
