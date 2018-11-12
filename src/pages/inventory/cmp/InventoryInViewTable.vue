<template>
  <!-- 数据列表 -->
  <qf-table :data="data"
            ref="skuTable" row-key="id" sum-text="合计" show-summary :summary-method="getSummaries">
    <qf-table-column type="index" label="序号"/>
    <qf-table-column label="商品名称">
      <template slot-scope="props">
        <p class="sku-name" :title="props.row.sku.name">{{props.row.sku.name}}</p>
        <p>{{props.row.sku.barcode}}</p>
      </template>
    </qf-table-column>
    <qf-table-column label="商品编号" prop="sku.code"></qf-table-column>
    <qf-table-column label="单位" width="50px" prop="sku.munit"></qf-table-column>
    <qf-table-column label="数量" prop="qty" width="120px" align="right" :formatter="qtyFormatter"></qf-table-column>
    <qf-table-column label="备注" prop="remark"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./InventoryInViewTable.ts"></script>
