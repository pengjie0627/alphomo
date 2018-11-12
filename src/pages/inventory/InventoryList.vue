<template>
  <page-body :menu="menu">

    <list-container>

      <inventory-list-search slot="search" @setFilters="doGetFilter" @queryWarehouse="onChangeWarehouse"></inventory-list-search>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button type="primary" @click="doExport" v-if="hasPermissions('inventory.check.export')">导出全部</qf-button>
      </div>

      <inventory-list-table slot="list" :data="tableData" :query="warehouse" @setFilter="doGetFilter" @setSorters="onSortChange"></inventory-list-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>
    </list-container>
  </page-body>
</template>

<script lang="ts" src="./InventoryList.ts"></script>

<style>

</style>
