<template>
  <div class="inventory-transfer-edit-table">
    <qf-table :data="data" @selection-change="selectionChange" row-key="id" show-summary
              sum-text="合计"
              :summary-method="getSummary" @table-keydown="onTablekeyDown">
      <qf-table-column type="selection"/>
      <qf-table-column label="序号" type="index"/>
      <qf-table-column label="商品名称" prop="name" minWidth="160px">
        <template slot-scope="props">
          <qf-search :value="getSearchValue(props.row.sku)" ref="name" placeholder="请输入商品编号/名称/条码"
                     @select="setRowSku($event, props.row, props.rowIndex)"
                     :queryParam="skuLineQueryParam"></qf-search>
        </template>
      </qf-table-column>
      <qf-table-column label="商品编号" prop="sku.code">
        <template slot-scope="props">
          {{props.row.sku.code}}
          <!--<qf-input v-model="props.row.sku.code" select-onfocus align="right"-->
          <!--:disabled="onDisabled(props.row.sku)"></qf-input>-->
        </template>
      </qf-table-column>
      <qf-table-column label="单位" prop="sku.munit" width="50px"></qf-table-column>
      <qf-table-column label="数量" prop="qty" align="right">
        <template slot-scope="props">
          <qf-input v-model="props.row.qty" select-onfocus align="right"
                    scale="0" :disabled="onDisabled(props.row)"
                    :maxlength="limits.inventory" ref="qty"></qf-input>
        </template>
      </qf-table-column>
      <qf-table-column label="备注" prop="remark">
        <template slot-scope="props">
          <qf-input v-model="props.row.remark" select-onfocus :disabled="onDisabled(props.row)"
                    :maxlength="limits.remark" ref="remark"></qf-input>
        </template>
      </qf-table-column>
    </qf-table>
  </div>
</template>

<script lang="ts" src="./InventoryTransferEditTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-transfer-edit-table {
    .qf-table-body-wrapper {
      overflow: visible !important;
    }

    .qf-input .qf-input-append {
      padding: 0 12px 0 6px;
    }
  }
</style>
