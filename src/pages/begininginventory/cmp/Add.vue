<template>
  <qf-dialog-def class="begin-inventory-add" title="批量添加"
                 @cancel="doCancel" @confirm="doConfirm">
    <div class="addTable">
      <qf-table :data="data" row-key="id" ref="table">
        <qf-table-column label="#" type="index"/>
        <qf-table-column label="商品" prop="name" minWidth="160px">
          <template slot-scope="props">
            <qf-search :value="getSearchValue(props.row.sku)" ref="name" type="sku3"
                       @select="setRowSku($event, props.row, props.rowIndex)" v-form:sku="validator"></qf-search>
          </template>
        </qf-table-column>
        <qf-table-column label="期初库存" prop="sku.code">
          <template slot-scope="props">
            <qf-input v-model="props.row.beginingQty" select-onfocus align="right"
                      @change="onRowChange('qty',props.row)" v-form:qty="validator" :disabled="isEmptyLine(props.row)"
                      :maxlength="limits.inventory"></qf-input>
          </template>
        </qf-table-column>
        <qf-table-column label="成本价(去税)">
          <template slot-scope="props">
            <qf-input v-model="props.row.taxExcBeginingCostPrice" select-onfocus :maxlength="limits.sumAmount"
                      :disabled="isEmptyLine(props.row)"
                      scale="6" align="right" @change="onRowChange('taxExcPrice',props.row)"
                      v-form:price="validator"></qf-input>
          </template>
        </qf-table-column>
        <qf-table-column label="成本价(含税)">
          <template slot-scope="props">
            <qf-input v-model="props.row.beginingCostPrice" select-onfocus :maxlength="limits.sumAmount"
                      :disabled="isEmptyLine(props.row)"
                      scale="6" align="right" @change="onRowChange('price',props.row)"
                      v-form:price="validator"></qf-input>
          </template>
        </qf-table-column>
        <qf-table-column label="成本金额(去税)" align="right">
          <template slot-scope="props">
            <qf-input v-model="props.row.taxExcBeginingAmount" select-onfocus :disabled="isEmptyLine(props.row)"
                      scale="2" align="right" @change="onRowChange('taxExcAmount',props.row)" :maxlength="limits.sumAmount"
                      v-form:amount="validator"></qf-input>
          </template>
        </qf-table-column>
        <qf-table-column label="成本金额(含税)" align="right">
          <template slot-scope="props">
            <qf-input v-model="props.row.beginingAmount" select-onfocus :disabled="isEmptyLine(props.row)"
                      scale="2" align="right" @change="onRowChange('amount',props.row)" :maxlength="limits.sumAmount"
                      v-form:amount="validator"></qf-input>
          </template>
        </qf-table-column>
      </qf-table>
    </div>
  </qf-dialog-def>
</template>

<script lang="ts" src="./Add.ts"></script>

<style lang="scss">
  .begin-inventory-add {
    min-width: 800px;
    min-height: 300px;
    .addTable {
      min-width: 800px;
    }
    .qf-dialog-body {
      overflow: visible;
    }
  }
</style>
