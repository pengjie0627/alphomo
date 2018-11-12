<template>
  <qf-table class="inventory-transfer-view-table" show-summary :data="data" sum-text="合计"
            :summary-method="getSummary">
    <qf-table-column label="序号" type="index"/>
    <qf-table-column label="商品名称" prop="sku.name" minWidth="200px">
      <template slot-scope="props">
        <span class="sku-name" :title="props.row.sku.name"> {{props.row.sku.name}}</span><br/>
        {{props.row.sku.barcode}}
      </template>
    </qf-table-column>
    <qf-table-column label="商品编号" prop="sku.code"></qf-table-column>
    <qf-table-column label="单位" prop="sku.munit" width="50px"></qf-table-column>
    <qf-table-column label="数量" prop="qty" width="80px" align="right"></qf-table-column>
    <qf-table-column label="备注" prop="remark"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./InventoryTransferViewTable.ts"></script>

<style>

</style>
