<template>
  <page-body :menu="menu" class="inventory-check-list">

    <div slot="actions">
      <qf-button  type="primary" @click="doCreateBill" v-if="hasPermissions('inventory.check.create')"> 新建盘点单
      </qf-button>
      <qf-button type="default" @click="doImport" v-if="hasPermissions('inventory.check.import')">导入盘点单</qf-button>
    </div>

    <list-container>

      <inventory-list-search slot="search" @setFilters="doGetFilter"></inventory-list-search>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button type="primary" @click="doExport" v-if="hasPermissions('inventory.check.export')">导出全部</qf-button>
        <qf-button type="default" :disabled="!(selectedData && selectedData.length)" @click="batchAudit"
                   v-if="hasPermissions('inventory.check.audit')">审核
        </qf-button>
        <qf-button type="default" :disabled="!(selectedData && selectedData.length)" @click="batchRemove"
                   v-if="hasPermissions('inventory.check.delete')">删除
        </qf-button>
        <print-view :id="id" type="inventory_check" btnType="default" :disabled="!(selectedData && selectedData.length)"
                    v-if="hasPermissions('inventory.check.print')"></print-view>
      </div>

      <inventory-list-table slot="list" :data="tableData" :query="query" @selectData="doSelectData"
                            @getList="doSearch"
                            @setSorters="onSortChange"></inventory-list-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>
    </list-container>
  </page-body>
</template>

<script lang="ts" src="./InventoryCheckList.ts"></script>

<style lang="scss">
  .inventory-check-list {
    .qf-date-editor .qf-range-input {
      height: 33px;
    }
  }
</style>
