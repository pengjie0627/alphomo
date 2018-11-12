<template>
  <qf-table class="balance-list-table" :data="tableData"
            :cell-class-name="getCellClass"
            ref="skuTable" row-key="id">

    <qf-table-column label="序号" align="center" type="index" width="50px"/>
    <qf-table-column label="操作" align="center">
      <template slot-scope="props">
        <qf-button :bill="props.row" type="link"
                   @click="doGoDetail(props.row.id,props.row.billType)">
          查看
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="收支类型" prop="billType"
                     :formatter="billTypeFormatter"></qf-table-column>
    <qf-table-column label="单号" prop="billNum">
    </qf-table-column>
    <qf-table-column label="业务日期" prop="businessDate"
                     :formatter="dateFormatter"></qf-table-column>
    <qf-table-column label="业务对象" prop="csName"></qf-table-column>
    <qf-table-column label="收入（元）" width="150px" prop="receivedAmount"
                     :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="支出（元）" width="150px" prop="paidAmount"
                     :formatter="priceFormatter"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./BalanceRptTable.ts">

</script>

<style lang="scss">
</style>
