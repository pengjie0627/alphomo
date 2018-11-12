<template>
  <!-- 数据列表 -->
  <qf-table :data="data" ref="skuTable" row-key="id">

    <qf-table-column label="应收金额(元)" prop="amount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="实际收款(元)" prop="rcvdAmount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="已优惠(元)" prop="discountAmount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="合计收款(元)" prop="totalRcvdAmount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="收款后剩余应收(元)" prop="remainAmount" :formatter="priceFormatter"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./BillViewMoneyTable.ts">
</script>

<style lang="scss">

</style>
