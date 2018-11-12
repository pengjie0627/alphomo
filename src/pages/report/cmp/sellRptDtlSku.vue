<template>
  <div class="sell-rpt-dtl-sku">
    <qf-table
      :data="data"
      show-summary
      :summary-method="getSummaries"
      @sort-change="sortChange"
      border>
      <!--<qf-table-column type="selection"/>-->
      <qf-table-column label="序号" align="center" type="index" width="50px"/>
      <qf-table-column label="商品名称" align="left">
        <template slot-scope="props">
          <div class="sku-name" :title="props.row.sku.name">{{props.row.sku.name}}</div>
          <div>{{props.row.sku.barcode}}</div>
        </template>
      </qf-table-column>
      <qf-table-column label="规格" prop="sku.spec" align="left"/>
      <qf-table-column label="单位" prop="sku.munit" align="left" width="50px"/>
      <qf-table-column label="类别" prop="sku.category.name" align="left"/>
      <qf-table-column label="进货量" prop="qty" align="right" sortable/>
      <qf-table-column
        v-if="hasPermission('price.refPurchasePrice') && merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
        label="进货额(去税)" align="right" prop="taxExcAmount"
        sortable>
        <template slot-scope="props">
          <div>{{props.row.taxExcAmount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.refPurchasePrice')" label="进货额(含税)" align="right" prop="amount"
                       sortable>
        <template slot-scope="props">
          <div>{{props.row.amount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column
        v-if="hasPermission('price.refPurchasePrice') && merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
        label="进货均价(去税)" align="right"
        prop="taxExcAvgPrice"
        sortable>
        <template slot-scope="props">
          <div>{{props.row.taxExcAvgPrice | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.refPurchasePrice')" label="进货均价(含税)" align="right" prop="avgPrice"
                       sortable>
        <template slot-scope="props">
          <div>{{props.row.avgPrice | fmt}}</div>
        </template>
      </qf-table-column>
    </qf-table>
  </div>
</template>

<script lang="ts" src="./SellRptDtlSku.ts">

</script>

<style lang="scss">
  @import '~styles/var.scss';

  .sell-rpt-dtl-sku {

    .table-style {
      margin-top: 50px;
    }

    .qf-table-footer-wrapper {
      position: absolute;
      top: -45px;
    }

  }

</style>
