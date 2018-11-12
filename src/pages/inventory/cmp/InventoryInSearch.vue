<template>
  <query-condition ref="query" @search="doSearch" @reset="doReset" @toggle="doToggle" class="inventory-entry-list-search">
    <qf-form-item label="" label-width="0">
      <qf-input placeholder="请输入单号/订单号/商品名称/备注进行搜索" v-model="queryCondition.keyword"
                :maxlength="limits.keyword" @keydown.native.enter="doEnterSearch()"></qf-input>
    </qf-form-item>
    <template slot="opened">
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="单号">
            <qf-input placeholder="请输入" v-model="queryCondition.billNumber" :maxlength="limits.billNum" @keydown.native.enter="doEnterSearch()"></qf-input>
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
        <qf-col :span="8">
          <qf-form-item label="状态">
            <qf-select v-model="queryCondition.status" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="UNAUDITED" label="未入库"></qf-option>
              <qf-option value="AUDITED" label="已入库"></qf-option>
              <qf-option value="ABOLISHED" label="已作废"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="16">
          <qf-form-item label="制单日期">
            <div class="qf-form-group">
              <qf-date-picker v-model="queryCondition.createDate" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                              range-separator="~"
                              start-placeholder="开始日期" end-placeholder="结束日期"></qf-date-picker>
            </div>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="经办人">
            <qf-input placeholder="请输入经办人名称" v-model="queryCondition.managerName"
                      :maxlength="limits.name" @keydown.native.enter="doEnterSearch()"></qf-input>
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
          <qf-form-item label="订单号">
            <qf-input placeholder="请输入" v-model="queryCondition.externalBillNum" :maxlength="limits.billNum" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="业务单号">
            <qf-input placeholder="请输入" v-model="queryCondition.businessNum" :maxlength="limits.billNum" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="商品名称">
            <qf-input placeholder="请输入" v-model="queryCondition.sku" :maxlength="limits.name" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="备注">
            <qf-input placeholder="请输入" v-model="queryCondition.remark" :maxlength="limits.remark" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </template>
  </query-condition>
</template>

<script lang="ts" src="./InventoryInSearch.ts"></script>

<style lang="scss">
  .inventory-entry-list-search {

    .qf-form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .qf-date-editor {
      width: 100% !important;
    }

  }
</style>
