<template>
  <page-body :menu="menu">
    <div slot="actions">
      <qf-button icon="ic_icon-add" type="primary" @click="doGoCreate" :disabled="!warehouse||!warehouse.id"
                 v-if="hasPermissions('inventory.beginning.create')">批量添加
      </qf-button>
      <qf-button icon="ic_icon-add" type="default" @click="doImport" :disabled="!(warehouse&&warehouse.id)"
                 v-if="hasPermissions('inventory.beginning.import')">导入期初库存
      </qf-button>
    </div>
    <list-container>

      <inventory-list-search slot="search" @setFilters="doGetFilter"
                             @queryWarehouse="onChangeWarehouse"></inventory-list-search>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button type="primary" @click="doExport" v-if="hasPermissions('inventory.beginning.export')">导出全部</qf-button>
        <qf-button type="default" :disabled="!(selectedData && selectedData.length)"
                   v-if="hasPermissions('inventory.beginning.delete')" @click="batchRemove">删除
        </qf-button>
      </div>

      <inventory-list-table slot="list" :data="tableData" :query="warehouse" @setFilter="doGetFilter"
                            @setSorters="onSortChange" @selectData="doSelectData"></inventory-list-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>
    </list-container>
  </page-body>
</template>

<script lang="ts" src="./List.ts"></script>

<style>

</style>
