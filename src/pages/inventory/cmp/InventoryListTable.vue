<template>
  <!-- 数据列表 -->
  <qf-table :data="data" @sort-change="doSortChange" @selection-change="doSelectionChange"
            ref="skuTable" row-key="id">
    <qf-table-column type="selection"/>
    <qf-table-column label="操作" align="center">
      <template slot-scope="props">
        <qf-button type="link" @click="doGoDetail(props.row.sku.id,props.row)"
                   v-if="hasPermissions('inventory.view.view')">
          查看流水
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="商品名称" minWidth="160px">
      <template slot-scope="props">
        <p class="sku-name" :title="props.row.sku.name">{{props.row.sku.name}}</p>
        <p>{{props.row.sku.barcode}}</p>
      </template>
    </qf-table-column>
    <qf-table-column label="商品编号" prop="sku.code" :formatter="checkNullValue"></qf-table-column>
    <qf-table-column label="规格" prop="sku.spec" :formatter="checkNullValue"
                     width="80"></qf-table-column>
    <qf-table-column label="单位" prop="sku.munit" :formatter="checkNullValue"
                     width="80"></qf-table-column>
    <qf-table-column label="分类" prop="sku.category.name"
                     :formatter="checkNullValue"></qf-table-column>
    <qf-table-column label="可用库存" align="right" sortable prop="availableQty"></qf-table-column>
    <qf-table-column label="当前存货" title="45654564564" align="right" sortable prop="qty">
      <template slot-scope="props">
        <div v-if="props.row.qty>=0">{{props.row.qty}}</div>
        <div v-if="props.row.qty<0" class="warning">{{props.row.qty}}
          <qf-tooltip content="未及时录入入库单可能导致库存、成本出现负值，请及时录入入库单">
            <qf-font-icon name="ic-ic_warning" color="#fe4352"></qf-font-icon>
          </qf-tooltip>
        </div>
      </template>
    </qf-table-column>
    <qf-table-column label="待入库数" align="right" sortable prop="inQty"></qf-table-column>
    <qf-table-column label="待出库数" align="right" sortable prop="outQty"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./InventoryListTable.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .warning {
    color: $--color-primary
  }
</style>
