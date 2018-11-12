<template>
  <div class="shop-list-search">
    <qf-row>
      <qf-col :span="16">
        <qf-form-item label="" label-width="0">
          <qf-input placeholder="请输入门店编号/名称进行搜索" v-model="queryCondition.keywords"
                    :maxlength="limits.keywords" @keydown.native.enter="doEnterSearch()"></qf-input>
        </qf-form-item>
      </qf-col>
      <qf-col :span="8">
        <div class="search-control">
          <qf-button type="primary" @click="doSearch">查询</qf-button>
        </div>
      </qf-col>
    </qf-row>
  </div>
</template>

<script lang="ts" src="./ShopSearch.ts"></script>

<style lang="scss">
  .shop-list-search {

    .qf-form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .search-control {
      padding-left: 20px;
    }

  }
</style>
