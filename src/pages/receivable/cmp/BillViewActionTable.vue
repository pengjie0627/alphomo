<template>
  <div class="bill-edit-action-table">
    <!-- 数据列表 -->
    <qf-table :data="data" row-key="id">
      <qf-table-column label="结算单据单号" prop="billNum"></qf-table-column>
      <qf-table-column label="单据类型" prop="billType" :formatter="billTypeFormatter"></qf-table-column>
      <qf-table-column label="业务日期" prop="billBusinessDate" :formatter="dateFormatter"></qf-table-column>
      <qf-table-column label="经办人" prop="billManager.name"></qf-table-column>
      <qf-table-column label="应收金额(元)" prop="amount" :formatter="priceFormatter"></qf-table-column>
      <qf-table-column label="剩余应收(元)" prop="remainAmount" :formatter="priceFormatter"></qf-table-column>
      <qf-table-column label="本次收款(元)" prop="rcvdAmount" :formatter="priceFormatter"></qf-table-column>
    </qf-table>
  </div>

</template>

<script lang="ts" src="./BillViewActionTable.ts">
</script>

<style lang="scss">
  .bill-edit-action-table {

  }
</style>
