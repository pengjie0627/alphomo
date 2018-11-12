<template>
  <div class="inventory-check-edit-table">
    <qf-table :data="lines" @selection-change="selectionChange" row-key="id" show-summary
              sum-text="合计"
              :summary-method="getSummary" @table-keydown="onTablekeyDown">
      <qf-table-column type="selection"/>
      <qf-table-column label="序号" type="index"/>
      <qf-table-column label="商品名称" prop="name" minWidth="160px">
        <template slot-scope="props">
          <qf-search :value="getSearchValue(props.row.sku)" ref="name" type="sku3"
                     :queryParam="skuLineQueryParam"
                     @select="setRowSku($event, props.row, props.rowIndex)"></qf-search>
        </template>
      </qf-table-column>
      <qf-table-column label="商品编号" prop="sku.code">
        <template slot-scope="props">
          {{props.row.sku.code}}
        </template>
      </qf-table-column>
      <qf-table-column label="单位" prop="sku.munit" width="50px"></qf-table-column>
      <qf-table-column label="账面数量" prop="paperQty" align="right">
        <!--<template slot-scope="props">-->
        <!--<qf-input v-model="props.row.paperQty" select-onfocus-->
        <!--scale="2" align="right" :disabled="onDisabled(props.row.sku)"></qf-input>-->
        <!--</template>-->
      </qf-table-column>
      <qf-table-column label="实盘数量" prop="qty" align="right">
        <template slot-scope="props">
          <qf-input v-model="props.row.qty" select-onfocus align="right"
                    ref="qty" :maxlength="limits.inventory"
                    v-form:qty="validator" @change="onRowChange(props.row)"
                    :disabled="isEmptyLine(props.row)"></qf-input>
        </template>
      </qf-table-column>
      <qf-table-column v-if="false" label="成本价" prop="costPrice" align="right" :formatter="priceFormatter">
        <template slot-scope="props">
          <span>{{props.row.costPrice |priceSixBit}}</span>
          <!--<qf-input v-model="props.row.costPrice" select-onfocus align="right"-->
          <!--:disabled="isEmptyLine(props.row.sku)||!hasPermissions('inventory.check.editCostPrice')" ref="costPrice" :maxlength="limits.costPrice"-->
          <!--v-form:costPrice="validator" @change="onRowChange(props.row)"-->
          <!--&gt;</qf-input>-->
        </template>
      </qf-table-column>
      <qf-table-column v-if="false" label="盈亏金额" prop="amount" align="right">
        <template slot-scope="props">
          <span :style="filterColor(props.row.amount,'red','green')">{{props.row.amount}}</span>
        </template>
      </qf-table-column>
      <qf-table-column label="备注" prop="remark" align="right">
        <template slot-scope="props">
          <qf-input v-model="props.row.remark" select-onfocus
                    align="left" :disabled="isEmptyLine(props.row)" ref="remark"
                    :maxlength="limits.remark"></qf-input>
        </template>
      </qf-table-column>
    </qf-table>
  </div>
</template>

<script lang="ts" src="./InventoryCheckEditTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-check-edit-table {
    .qf-table-body-wrapper {
      overflow: visible !important;
    }

    .qf-input .qf-input-append {
      padding: 0 12px 0 6px;
    }
  }
</style>
