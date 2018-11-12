<template>
  <qf-table class="inventory-transfer-view-table" :data="lines" show-summary sum-text="合计" :summary-method="getSummary">
    <qf-table-column label="序号" type="index"/>
    <qf-table-column label="商品名称" prop="sku.name">
      <template slot-scope="props">
        <span class="sku-name" :title="props.row.sku.name">{{props.row.sku.name}}</span> <br/>
        {{props.row.sku.barcode}}
      </template>
    </qf-table-column>
    <qf-table-column label="商品编号" prop="sku.code" width="100px"></qf-table-column>
    <qf-table-column label="单位" prop="sku.munit" width="100px"></qf-table-column>
    <qf-table-column label="账面数量" prop="paperQty" align="right"></qf-table-column>
    <qf-table-column label="实盘数量" prop="qty" align="right"></qf-table-column>
    <qf-table-column label="盈亏数量" align="right" :formatter="priceFormatter">
      <template slot-scope="props">
        <span v-if="props.row.balanceQty> 0" class="red">+{{props.row.balanceQty}}</span>
        <span v-if="props.row.balanceQty< 0" class="green">{{props.row.balanceQty}}</span>
        <span v-if="props.row.balanceQty== 0">-</span>
      </template>
    </qf-table-column>
    <!--<qf-table-column label="成本价" prop="costPrice" align="right" :formatter="priceFormatter"></qf-table-column>-->
    <qf-table-column v-if="hasPermissions('price.costPrice')" label="盈亏金额" prop="amount" align="right"
                     :formatter="priceFormatter">
      <template slot-scope="props">
        <span v-if="props.row.amount> 0" class="red">+{{props.row.amount | price }}</span>
        <span v-if="props.row.amount< 0" class="green">{{props.row.amount |price }}</span>
        <span v-if="props.row.amount== 0 |price">-</span>
      </template>
    </qf-table-column>
    <qf-table-column label="备注" prop="remark" align="right"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./InventoryCheckViewTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-transfer-view-table {

    .green {
      color: $--color-success
    }
    .red {
      color: $--color-error;
    }

  }

</style>
