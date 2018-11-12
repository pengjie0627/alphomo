<template>
  <query-condition ref="query" @search="doSearch" @reset="doReset" @toggle="doToggle" class="sale-list-search">
    <qf-form-item label="" label-width="0">
      <qf-input placeholder="请输入单号/客户名称/商品名称/备注进行搜索" v-model="queryCondition.keyword"
                :maxlength="limits.code" @keydown.native.enter="doEnterSearch()"></qf-input>
    </qf-form-item>
    <template slot="opened">
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="单据编号">
            <qf-input placeholder="请输入" v-model="queryCondition.billNumber" :maxlength="limits.billNum" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="包含商品">
            <sku-search  display-field="name" :value="queryCondition.sku" type="sku"
                        @select="setRowSku"
                        @clear="onSkuClear"></sku-search>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="客户名称">
            <qf-input placeholder="请输入" v-model="queryCondition.customerName" :maxlength="limits.custom" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="16">
          <qf-form-item label="业务日期">
            <div class="qf-form-group">
              <qf-date-picker v-model="queryCondition.businessDate" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                              range-separator="~"
                              start-placeholder="开始日期" end-placeholder="结束日期"></qf-date-picker>
            </div>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="仓库">
            <qf-select v-model="queryCondition.warehouse" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option v-for="(item,index) in warehouseList" :key="index" :value="item.id"
                         :label="item.name"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="状态">
            <qf-select v-model="queryCondition.status" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="UNAUDITED" label="草稿"></qf-option>
              <qf-option value="AUDITED" label="已审核"></qf-option>
              <qf-option value="PART_DELIVERED" label="部分出库"></qf-option>
              <qf-option value="DELIVERED" label="已出库"></qf-option>
              <qf-option value="ABOLISHED" label="已作废"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="来源">
            <qf-select v-model="queryCondition.externalBillSource" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="alphamo" label="新建"></qf-option>
              <qf-option value="cloud_scm" label="商城"></qf-option>
              <qf-option value="carsale" label="车销"></qf-option>
              <qf-option value="dpos" label="零售"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </template>
  </query-condition>
</template>

<script lang="ts" src="./SaleListSearch.ts"></script>

<style lang="scss">
  .sale-list-search {

    .qf-form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .qf-date-editor {
        width: 100% !important;
      }
    }

  }
</style>
