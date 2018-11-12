<template>
  <page-body :menu="menu" class="inventory-out-list">

    <list-container>

      <inventory-out-search slot="search" @setFilters="doGetFilter"></inventory-out-search>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button type="primary" @click="doExport" v-if="hasPermissions('inventory.deliver.export')">导出全部</qf-button>
        <qf-button type="default" :disabled="!(selectedData && selectedData.length)" @click="batchAudit"
                               v-if="hasPermissions('inventory.deliver.deliver')">确定出库
      </qf-button>
        <print-view :id="id" type="inventoryOut" btnType="default" :disabled="!(selectedData && selectedData.length)"
                    v-if="hasPermissions('inventory.deliver.print')"></print-view>
      </div>

      <inventory-out-table slot="list" :data="tableData" :query="query" @selectData="doSelectData" @getList="doSearch"
                           @setSorters="onSortChange"></inventory-out-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>
    </list-container>
  </page-body>
</template>

<script lang="ts" src="./InventoryOutList.ts"></script>

<style lang="scss">
  .inventory-out-list {
    .qf-date-editor .qf-range-input {
      height: 33px;
    }
  }
</style>
