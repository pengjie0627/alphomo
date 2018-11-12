<template>
  <!-- 数据列表 -->
  <qf-table :data="data" ref="skuTable" row-key="id" class="money-table">

    <qf-table-column label="应收金额(元)">
      <template slot-scope="props">
        <span>{{receipt.amount |priceFormatter}}</span>
      </template>
    </qf-table-column>
    <qf-table-column label="实际收款(元)">
      <template slot-scope="props">
        <qf-input v-model="receipt.rcvdAmount" @change="onAmountChange" scale="2" :maxlength="limits.amount"></qf-input>
      </template>
    </qf-table-column>
    <qf-table-column label="已优惠(元)">
      <template slot-scope="props">
        <qf-input v-model="receipt.discountAmount" @change="onAmountChange" scale="2" :maxlength="limits.amount"></qf-input>
      </template>
    </qf-table-column>
    <qf-table-column label="合计收款(元)">
      <template slot-scope="props">
        <span>{{receipt.totalRcvdAmount |priceFormatter}}</span>
      </template>
    </qf-table-column>
    <qf-table-column label="收款后剩余应收(元)">
      <template slot-scope="props">
        <span>{{receipt.remainAmount |priceFormatter}}</span>
      </template>
    </qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./BillEditMoneyTable.ts">
</script>

<style lang="scss">
  .money-table {
    padding: 5px 0;
  }
</style>
