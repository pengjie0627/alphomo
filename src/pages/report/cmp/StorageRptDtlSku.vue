<template>
  <div class="storage-rpt-dtl-sku">
    <qf-table
      :data="data"
      border>
      <qf-table-column label="序号" align="center" type="index" width="50px"/>
      <qf-table-column label="操作" align="center" width="50px">
        <template slot-scope="props">
          <qf-button type="link" @click="onCheck(props.row)"
                     v-if="hasPermission('report.inventory.view')">查看
          </qf-button>
        </template>
      </qf-table-column>
      <qf-table-column label="业务日期" prop="businessDate" :formatter="dateFormatter"/>
      <qf-table-column label="入库数" prop="inQty" align="right"/>
      <qf-table-column v-if="hasPermission('price.costPrice')" label="入库成本(元)" align="right"
                       prop="inAmount">
        <template slot-scope="props">
          <div>{{props.row.inAmount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column label="出库数" prop="outQty" align="right"/>
      <qf-table-column v-if="hasPermission('price.costPrice')" label="出库成本(元)" align="right"
                       prop="outAmount">
        <template slot-scope="props">
          <div>{{props.row.outAmount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column label="结余库存" prop="qty" align="right">
        <template slot-scope="props">
          <div v-if="props.row.qty>=0">{{props.row.qty}}</div>
          <div v-if="props.row.qty<0" class="warning">{{props.row.qty}}
            <qf-tooltip content="未及时录入入库单可能导致库存、成本出现负值，请及时录入入库单">
              <qf-font-icon name="ic-ic_warning" color="#fe4352"></qf-font-icon>
            </qf-tooltip>
          </div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.costPrice')" label="结余成本价(去税)" align="right"
                       prop="costPrice">
        <template slot-scope="props">
          <div v-if="props.row.costPrice>=0">{{props.row.taxExcCostPrice | priceSixBit}}</div>
          <div v-if="props.row.costPrice<0" class="warning">{{props.row.taxExcCostPrice | priceSixBit}}
            <qf-tooltip content="未及时录入入库单可能导致库存、成本出现负值，请及时录入入库单">
              <qf-font-icon name="ic-ic_warning" color="#fe4352"></qf-font-icon>
            </qf-tooltip>
          </div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.costPrice')" label="结余成本价(含税)" align="right"
                       prop="costPrice">
        <template slot-scope="props">
          <div v-if="props.row.costPrice>=0">{{props.row.costPrice | priceSixBit}}</div>
          <div v-if="props.row.costPrice<0" class="warning">{{props.row.costPrice | priceSixBit}}
            <qf-tooltip content="未及时录入入库单可能导致库存、成本出现负值，请及时录入入库单">
              <qf-font-icon name="ic-ic_warning" color="#fe4352"></qf-font-icon>
            </qf-tooltip>
          </div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.costPrice')" label="结余成本(去税)" align="right"
                       prop="amount">
        <template slot-scope="props">
          <div v-if="props.row.amount>=0">{{props.row.taxExcAmount | fmt}}</div>
          <div v-if="props.row.amount<0" class="warning">{{props.row.taxExcAmount | fmt}}
            <qf-tooltip content="未及时录入入库单可能导致库存、成本出现负值，请及时录入入库单">
              <qf-font-icon name="ic-ic_warning" color="#fe4352"></qf-font-icon>
            </qf-tooltip>
          </div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.costPrice')" label="结余成本(含税)" align="right"
                       prop="amount">
        <template slot-scope="props">
          <div v-if="props.row.amount>=0">{{props.row.amount | fmt}}</div>
          <div v-if="props.row.amount<0" class="warning">{{props.row.amount | fmt}}
            <qf-tooltip content="未及时录入入库单可能导致库存、成本出现负值，请及时录入入库单">
              <qf-font-icon name="ic-ic_warning" color="#fe4352"></qf-font-icon>
            </qf-tooltip>
          </div>
        </template>
      </qf-table-column>
    </qf-table>
  </div>
</template>

<script lang="ts" src="./StorageRptDtlSku.ts">

</script>

<style lang="scss">
  @import '~styles/var.scss';

  .warning {
    color: $--color-primary
  }
</style>
