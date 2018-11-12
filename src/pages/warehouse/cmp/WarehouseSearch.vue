<template>
  <div class="customer-list-search">
    <qf-row>
      <qf-col :span="8">
        <qf-form-item label="" label-width="0">
          <qf-input placeholder="请输入仓库编号/名称/联系人/电话进行搜索" v-model="queryCondition.keyword"
                    :maxlength="limits.keywords" @keydown.native.enter="doEnterSearch()"></qf-input>
        </qf-form-item>
      </qf-col>
      <qf-col :span="8">
        <qf-form-item label="仓库类型">
          <qf-select v-model="queryCondition.category" clearable>
            <qf-option value="" label="全部"></qf-option>
            <qf-option value="NORMAL" label="仓库"></qf-option>
            <qf-option value="CAR" label="车辆"></qf-option>
          </qf-select>
        </qf-form-item>
      </qf-col>
      <qf-col :span="8">
        <div class="search-control">
          <qf-button type="primary" @click="doSearch">查询</qf-button>
          <qf-button @click="onReset">重置</qf-button>
        </div>
      </qf-col>
    </qf-row>
  </div>
</template>

<script lang="ts" src="./WarehouseSearch.ts"></script>

<style lang="scss">
  .customer-list-search {

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
