<template>
  <div class="inventory-list-search">
    <qf-row>
      <qf-col :span="8">
        <qf-form-item label="仓库">
          <qf-select v-model="queryCondition.warehouse" display-field="name" value-key="id"
                     clearable>
            <qf-option value="" label="全部"></qf-option>
            <qf-option v-for="(item,index) in warehouseList" :key="index" :value="item"
                       :label="item.name"></qf-option>
          </qf-select>
        </qf-form-item>
      </qf-col>
      <qf-col :span="8">
        <qf-form-item label="商品类别">
          <qf-select v-model="queryCondition.type" clearable>
            <qf-option value="" label="全部"></qf-option>
            <qf-option v-for="(item,index) in skuCategoryList" :key="index" :value="item.id"
                       :label="item.name"></qf-option>
          </qf-select>
        </qf-form-item>
      </qf-col>
      <qf-col :span="8">
        <qf-form-item label="商品">
          <qf-input v-model="queryCondition.keyword" :maxlength="limits.keyword"
                    placeholder="商品条码/编号/名称" @keydown.native.enter="doEnterSearch()"></qf-input>
        </qf-form-item>
      </qf-col>
    </qf-row>
    <qf-row>
      <qf-col :span="8">
        <qf-form-item label="所属供应商">
          <search display-field="name" :value="searchObj" type="supplier"
                  @select="setSupplier($event)" placeholder="请输入名称或编码查询"
                  @clear="onSupplierClear" @keydown.native.enter="doEnterSearch()">
          </search>
        </qf-form-item>
      </qf-col>
    </qf-row>
    <qf-row>
      <qf-col>
        <div class="search-control">
          <qf-button type="primary" @click="doSearch">查询</qf-button>
          <qf-button type="default" @click="doReset">重置</qf-button>
        </div>
      </qf-col>
    </qf-row>
  </div>
</template>

<script lang="ts" src="./InventoryListSearch.ts"></script>

<style lang="scss">

  .inventory-list-search {
    .search-control {
      float: right;
    }

    .qf-row {
      margin: 10px auto;
    }
  }
</style>
