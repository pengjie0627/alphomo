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
    <qf-table-column label="单号" sortable prop="billNum">
      <template slot-scope="props">
        <qf-button type="link" @click="doGoDetail(props.row.id)">{{props.row.billNum}}</qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="业务日期" sortable prop="transferDate" :formatter="dateFormatter"></qf-table-column>
    <qf-table-column label="调出仓库" prop="outWarehouse.name"></qf-table-column>
    <qf-table-column label="调入仓库" prop="inWarehouse.name"></qf-table-column>
    <qf-table-column label="备注" prop="remark" :formatter="remarkFormatter">
      <template slot-scope="props">
        <div class="sku-name" :title="props.row.remark">{{props.row.remark}}</div>
      </template>
    </qf-table-column>
    <qf-table-column label="状态" prop="status">
      <template slot-scope="props">
        <span :class="[statusFormatter(props.row.status)]">{{props.row.status | status}}</span>
      </template>
    </qf-table-column>
    <qf-table-column label="单据类型" prop="category" :formatter="categoryFormatter"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./InventoryTransferListTable.ts"></script>

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
