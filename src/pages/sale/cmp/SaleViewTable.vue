<template>
  <div class="sale-view-table">
    <qf-table :data="bill.lines" row-key="id" showSummary :summary-method="getSummaries">
      <qf-table-column label="序号" type="index"/>
      <qf-table-column label="商品名称" prop="sku.name" minWidth="160px">
        <template slot-scope="props">
          <div class="skuName" :title="props.row.sku.name">{{props.row.sku.name}}</div>
          <div class="barcode">{{props.row.sku.barcode}}</div>
        </template>
      </qf-table-column>
      <qf-table-column label="商品编码" prop="sku.code"></qf-table-column>
      <qf-table-column label="单位" prop="sku.munit" width="50px"></qf-table-column>
      <qf-table-column label="规格" prop="sku.spec" width="100px"></qf-table-column>
      <qf-table-column v-if="merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputOnlyTax" label="单价(去税)"
                       prop="taxExcPrice" :formatter="priceFormatter" align="right"></qf-table-column>
      <qf-table-column label="单价(含税)" prop="price" :formatter="priceFormatter" align="right"></qf-table-column>
      <qf-table-column label="数量" prop="qty" align="right" :formatter="priceFormatter"></qf-table-column>
      <qf-table-column v-if="merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputOnlyTax" label="金额(去税)"
                       prop="taxExcAmount" :formatter="priceFormatter" align="right"></qf-table-column>
      <qf-table-column label="金额(含税)" prop="amount" :formatter="priceFormatter" align="right"></qf-table-column>
      <qf-table-column label="税率" prop="taxRate" align="right" :formatter="priceFormatter">
        <template slot-scope="props">
          {{props.row.taxRate | price}}%
        </template>
      </qf-table-column>
      <qf-table-column label="税额" prop="taxAmount" align="right" :formatter="priceFormatter"></qf-table-column>
    </qf-table>

  </div>
</template>

<script lang="ts" src="./SaleViewTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .sale-view-table {
    margin-top: 10px;
    line-height: 36px;
    .summary {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .wid100 {
        width: 100px;
        text-align: right;
      }
    }
    .skuName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .barcode {
      font-size: 12px;
      height: 20px;
      line-height: 20px;
    }
  }
</style>
