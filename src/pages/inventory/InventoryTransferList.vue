<template>
  <page-body :menu="menu" class="inventory-tran-list">

    <div slot="actions">
      <qf-button  type="primary" @click="doCreateBill" v-if="hasPermissions('inventory.allocation.create')"> 新建调拨单
      </qf-button>
      <qf-button type="default" @click="doImport" v-if="hasPermissions('inventory.allocation.import')">导入调拨单</qf-button>
    </div>

    <list-container>

      <inventory-transfer-search slot="search" @setFilters="doGetFilter"></inventory-transfer-search>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button type="primary" @click="doExport" v-if="hasPermissions('inventory.allocation.export')">导出全部</qf-button>
        <qf-button type="default" :disabled="!(selectedData && selectedData.length)" @click="batchAudit"
                   v-if="hasPermissions('inventory.allocation.audit')">审核
        </qf-button>
        <qf-button type="default" :disabled="!(selectedData && selectedData.length)" @click="batchRemove"
                   v-if="hasPermissions('inventory.allocation.delete')">删除
        </qf-button>
        <print-view :id="id" type="inventory_transfer" btnType="default" :disabled="!(selectedData && selectedData.length)"
                    v-if="hasPermissions('inventory.allocation.print')"></print-view>
      </div>

      <inventory-transfer-table slot="list" :data="tableData" :query="query" @selectData="doSelectData"
                                @getList="doSearch"
                                @setSorters="onSortChange"></inventory-transfer-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>
    </list-container>
  </page-body>
</template>

<script lang="ts" src="./InventoryTransferList.ts"></script>

<style lang="scss">
  .inventory-tran-list {
    .qf-date-editor .qf-range-input {
      height: 33px;
    }
  }
</style>
