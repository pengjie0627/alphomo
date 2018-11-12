<template>
  <!-- 数据列表 -->
  <qf-table :data="data" @sort-change="doSortChange" @selection-change="doSelectionChange"
            ref="skuTable" row-key="id" class="inventory-in-table">
    <qf-table-column type="selection"/>
    <qf-table-column label="操作" align="center">
      <template slot-scope="props">
        <qf-button type="link" @click="doGoDetail(props.row.id)" v-if="false"> 查看</qf-button>
        <qf-button type="link" v-if="props.row.status === 'UNAUDITED'&&hasPermissions('inventory.storage.storage')"
                   @click="doEntryInventory(props.row)">入库
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="业务单号" sortable prop="billNum">
      <template slot-scope="props">
        <qf-button type="link" @click="doGoDetail(props.row.id)">
          {{props.row.billNum}}
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="订单号" sortable prop="externalBillNum"></qf-table-column>
    <qf-table-column label="业务日期" sortable prop="businessDate" :formatter="dateFormatter"></qf-table-column>
    <qf-table-column label="入库仓库" prop="warehouse.name"></qf-table-column>
    <qf-table-column label="往来单位" prop="source.billName"></qf-table-column>
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
  </qf-table>
</template>

<script lang="ts" src="./InventoryInTable.ts"></script>

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
