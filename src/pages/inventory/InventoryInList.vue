<template>
  <page-body :menu="menu" class="inventory-list">

    <list-container>

      <inventory-entry-search slot="search" @setFilters="doGetFilter"></inventory-entry-search>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button type="primary" @click="doExport" v-if="hasPermissions('inventory.storage.export')">导出全部</qf-button>
        <qf-button type="default" :disabled="!(selectedData && selectedData.length)" @click="batchAudit"
                   v-if="hasPermissions('inventory.storage.storage')">确认入库
        </qf-button>
        <print-view :id="id" type="inventoryIn" btnType="default" :disabled="!(selectedData && selectedData.length)"
                    v-if="hasPermissions('inventory.storage.print')"></print-view>
      </div>
      <inventory-entry-table slot="list" :data="tableData" :query="query" @setSorters="onSortChange"
                             @selectData="doSelectData" @getList="doSearch"></inventory-entry-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>
    </list-container>

  </page-body>
</template>

<script lang="ts" src="./InventoryInList.ts"></script>

<style lang="scss">
  .inventory-list {
    .qf-date-editor .qf-range-input {
      height: 33px;
    }
  }
</style>
