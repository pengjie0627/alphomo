<template>
  <page-body class="shop-list" :menu="menu">

    <!-- 列表页面模板 -->
    <list-container>

      <!-- 搜索栏 -->
      <list-search slot="search" @setFilters="onSetFilter">
      </list-search>
      <!-- 表格工具栏 -->
      <div class="qf-row" slot="toolbar">
          <div style="width:50%">
            <qf-button type="primary" @click="doExport" v-if="hasPermissions('retail.retail.export')">导出全部</qf-button>
            <qf-button type="default" @click="doDelete" :disabled="!(selectedData && selectedData.length)" v-if="hasPermissions('retail.retail.delete')">删除</qf-button>
          </div>
          <div class="text-right" style="width:50%">
            <div style="font-size:15px">
              新增直营店：请千帆掌柜中的门店扫码绑定。
              <qf-button type="link" @click="onAuth()" class="normal-font">点此查看授权码</qf-button>
            </div>
          </div>
      </div>

      <!-- 数据列表 -->
      <list-table slot="list" :query="query" :data="tableData" @setSorters="onSortChange"
                  @selectData="onSelectionChange" @getList="doSearch" @reload="doReload"></list-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>

    </list-container>

  </page-body>
</template>

<script lang="ts" src="./ShopList.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .shop-list {
    background: $--color-bg;
  }

  .text-right{
    text-align: right;
    padding-right: 15px;
  }

  .normal-font{
    font-size:15px;
  }

</style>
