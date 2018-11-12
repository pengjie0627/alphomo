<template>
  <!-- 数据列表 -->
  <qf-table :data="data" @sort-change="doSortChange" @selection-change="doSelectionChange"
            ref="skuTable" row-key="id" class="inventory-in-table">
    <qf-table-column type="selection"/>
    <qf-table-column label="操作" align="center">
      <template slot-scope="props">
        <inventory-detail-button target="list" type="link" :bill="props.row"
                                 @getList="getList"></inventory-detail-button>
      </template>
    </qf-table-column>
    <qf-table-column label="单号" sortable prop="billNum" align="center">
      <template slot-scope="props">
        <qf-button type="link" @click="doGoDetail(props.row.id)">{{props.row.billNum}}</qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="盘点日期" sortable prop="checkDate" :formatter="dateFormatter" align="center"></qf-table-column>
    <qf-table-column label="仓库" prop="warehouse.name" align="center"></qf-table-column>
    <qf-table-column label="状态" prop="status" align="center">
      <template slot-scope="props">
        <span :class="[statusFormatter(props.row.status)]">{{props.row.status | status}}</span>
      </template>
    </qf-table-column>
    <qf-table-column v-if="hasPermissions('price.costPrice')" label="盘盈金额" prop="profitAmount" align="right" sortable
                     :formatter="priceFormatter">
      <template slot-scope="props">
        <span :style="filterColor(props.row.profitAmount,'red','green')">{{props.row.profitAmount|price}}</span>
      </template>
    </qf-table-column>
    <qf-table-column v-if="hasPermissions('price.costPrice')" label="盘亏金额" prop="lossAmount" align="right" sortable
                     :formatter="priceFormatter">
      <template slot-scope="props">
        <span :style="filterColor(props.row.lossAmount,'green','red')" v-if="props.row.lossAmount>0">-{{props.row.lossAmount|price}}</span>
        <span v-if="props.row.lossAmount==0"> {{props.row.lossAmount |price}}</span>
      </template>
    </qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./InventoryCheckListTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-in-table {
    .danger {
      color: $--color-error;
    }
    .success {
      color: $--color-success;
    }
    .info {
      color: $--color-info;
    }
    .warning {
      color: $--color-warning
    }
  }
</style>
