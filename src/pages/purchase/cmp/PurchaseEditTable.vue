<template>
  <div class="grid">
    <qf-table :data="lines" @selection-change="selectionChange" ref="skuTable" row-key="id"
              @sort-change="sortChange" @table-keydown="onTableKeyDown" showSummary
              :summary-method="getSummaries">
      <qf-table-column type="selection"/>
      <qf-table-column type="index" label="序号"/>
      <qf-table-column label="商品名称" prop="name" minWidth="160px">
        <template slot-scope="props">
          <search display-field="name" :value="getRowSku(props.row.sku)"
                  type="sku2"
                  @select="setRowSku($event, props.row, props.rowIndex)"
                  :queryParam="skuLineQueryParam"
                  @clear="onSkuClear($event, props.row, props.rowIndex)" ref="name">
          </search>
        </template>
      </qf-table-column>
      <qf-table-column label="商品编码" prop="sku.code"></qf-table-column>
      <qf-table-column label="单位" prop="sku" width="100px" align="center">
        <template slot-scope="props" v-if="props.row.sku && props.row.sku.skuMunitList">

          <qf-select v-model="props.row.sku.munit"
                     display-field="value"
                     @change="munitSelectChange(props.row.sku.munit, props.row, props.row.sku)"
                     :maxlength="limits.munit" v-if="props.row.sku.skuMunitList.length > 0">
            <qf-option v-for="(item,index) in props.row.sku.skuMunitList" :key="index" :value="item.name"
                       :label="item.name"></qf-option>
          </qf-select>
          <div v-if="props.row.sku.skuMunitList.length === 0" @click="doSelectMunitList(props.row)">{{
            props.row.sku.munit }}
          </div>
        </template>
      </qf-table-column>
      <qf-table-column label="规格" prop="sku.spec" width="50px"></qf-table-column>
      <qf-table-column min-width="110px;" label="进价(去税)" prop="taxExcPrice" align="right"
                       v-if="merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputOnlyTax">
        <template slot-scope="props">
          <qf-input v-model="props.row.taxExcPrice" :disabled="isEmptyLine(props.row)" ref="taxExcPrice"
                    select-onfocus
                    :scale="merchantConfig.purchasePriceBit" align="right" @change="onRowChange('taxExcPrice', props.row)"></qf-input>
        </template>
      </qf-table-column>
      <qf-table-column min-width="110px;" label="进价(含税)" prop="price" align="right">
        <template slot-scope="props">
          <qf-input v-model="props.row.price" :disabled="isEmptyLine(props.row)" ref="price"
                    select-onfocus
                    :scale="merchantConfig.purchasePriceBit" align="right" @change="onRowChange('price', props.row)"></qf-input>
        </template>
      </qf-table-column>
      <qf-table-column label="数量" prop="qty" align="right">
        <template slot-scope="props">
          <qf-input v-model="props.row.qty" :disabled="isEmptyLine(props.row)" ref="qty"
                    select-onfocus
                    :maxlength="6"
                    scale="0" align="right" @change="onRowChange('qty', props.row)"
                    v-form="{validator: validator, id: 'lineQty', context: props}"></qf-input>
        </template>
      </qf-table-column>
      <qf-table-column  min-width="110px;" label="金额(去税)" prop="taxExcAmount" align="right"
                       v-if="merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputOnlyTax">
        <template slot-scope="props">
          <qf-input v-model="props.row.taxExcAmount" :disabled="isEmptyLine(props.row)" ref="taxExcAmount"
                    select-onfocus scale="2" align="right"
                    @change="onRowChange('taxExcAmount', props.row)"
                    v-form="{validator: validator, id: 'lineAmount', context: props}"></qf-input>
        </template>
      </qf-table-column>
      <qf-table-column  min-width="110px;" label="金额(含税)" prop="amount" align="right">
        <template slot-scope="props">
          <qf-input v-model="props.row.amount" :disabled="isEmptyLine(props.row)" ref="amount"
                    select-onfocus scale="2" align="right"
                    @change="onRowChange('amount', props.row)"
                    v-form="{validator: validator, id: 'lineAmount', context: props}"></qf-input>
        </template>
      </qf-table-column>
      <qf-table-column min-width="110px;" label="税率" prop="taxRate" align="right"
                       v-if="merchantConfig.enableInputTaxRateSupport">
        <template slot-scope="props">
          <qf-input v-model="props.row.taxRate" :disabled="isEmptyLine(props.row)" ref="taxRate"
                    select-onfocus scale="2" align="right"
                    @change="onRowChange('taxRate', props.row)"
                    v-form="{validator: validator, id: 'lineTaxRate', context: props}">
            <span slot="append">%</span>
          </qf-input>
        </template>
      </qf-table-column>
      <qf-table-column label="税额" prop="taxAmount" scale="2" :formatter="taxAmountFormat"
                       align="right" width="110px"
                       v-if="merchantConfig.enableInputTaxRateSupport"/>
    </qf-table>
  </div>
</template>

<script lang="ts" src="./PurchaseEditTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .grid {
    .qf-table .cell {
      overflow: visible;
    }
    .qf-input .qf-input-append {
      padding: 0 12px 0 6px;
    }
  }
</style>
