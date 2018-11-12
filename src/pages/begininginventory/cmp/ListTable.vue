<template>
  <!-- 数据列表 -->
  <qf-table :data="data" @sort-change="doSortChange" @selection-change="doSelectionChange"
            ref="skuTable" row-key="id">
    <qf-table-column type="selection"/>
    <qf-table-column label="操作" align="center" min-width="80px">
      <template slot-scope="props">
        <qf-button type="link" v-if="props.row.editable&&hasPermissions('inventory.beginning.create')"
                   @click="doGoEdit(props.row.id,props.row)">编辑
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="商品名称" width="120px">
      <template slot-scope="props">
        <p class="sku-name" :title="props.row.sku.name">{{props.row.sku.name}}</p>
        <p>{{props.row.sku.barcode}}</p>
      </template>
    </qf-table-column>
    <qf-table-column label="商品编号" prop="sku.code" :formatter="checkNullValue" min-width="100"></qf-table-column>
    <qf-table-column label="规格" prop="sku.spec" :formatter="checkNullValue" min-width="80"></qf-table-column>
    <qf-table-column label="单位" prop="sku.munit" :formatter="checkNullValue" min-width="80"></qf-table-column>
    <qf-table-column label="分类" prop="sku.category.name" :formatter="checkNullValue" width="80"></qf-table-column>
    <qf-table-column label="期初库存" prop="beginingQty" min-width="80"></qf-table-column>
    <qf-table-column label="成本价(去税)" v-if="hasPermissions('price.costPrice')" sortable prop="taxExcBeginingCostPrice" :formatter="priceFormatter" min-width="120"></qf-table-column>
    <qf-table-column label="成本价(含税)" v-if="hasPermissions('price.costPrice')" sortable prop="beginingCostPrice" :formatter="priceFormatter" min-width="120"></qf-table-column>
    <qf-table-column label="成本金额(去税)" v-if="hasPermissions('price.costPrice')" sortable prop="taxExcBeginingAmount" :formatter="amountFormatter" min-width="130"></qf-table-column>
    <qf-table-column label="成本金额(含税)" v-if="hasPermissions('price.costPrice')" sortable prop="beginingAmount" :formatter="amountFormatter" min-width="130"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./ListTable.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';
  .warning {
    color: $--color-primary
  }
</style>
