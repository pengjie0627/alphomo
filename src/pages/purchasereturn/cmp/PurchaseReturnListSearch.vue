<template>
  <query-condition ref="query" @search="doSearch" @reset="doReset" @toggle="doToggle" class="purchase-list-search">
    <qf-form-item label="" label-width="0">
      <qf-input placeholder="请输入单号/供应商名称/商品名称/备注进行搜索" v-model="queryCondition.keyword"
                :maxlength="limits.code" @keydown.native.enter="doEnterSearch()"></qf-input>
    </qf-form-item>
    <template slot="opened">
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="退货单号">
            <qf-input placeholder="请输入退货单号" v-model="queryCondition.billNumber" :maxlength="limits.billNum" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="供应商名称">
            <qf-input placeholder="请输入供应商" v-model="queryCondition.supplierName" :maxlength="limits.custom" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="制单人">
            <qf-input placeholder="请输入制单人" v-model="queryCondition.creatorName" :maxlength="limits.custom" @keydown.native.enter="doEnterSearch()"></qf-input>
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
          <qf-form-item label="单据状态">
            <qf-select v-model="queryCondition.status" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="UNAUDITED" label="草稿"></qf-option>
              <qf-option value="AUDITED" label="已审核"></qf-option>
              <qf-option value="PART_RETURNED" label="部分出库"></qf-option>
              <qf-option value="RETURNED" label="已出库"></qf-option>
              <qf-option value="ABOLISHED" label="已作废"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="结算状态">
            <qf-select v-model="queryCondition.settleStatus" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="UNSETTLED" label="未结算"></qf-option>
              <qf-option value="PART_SETTLED" label="部分结算"></qf-option>
              <qf-option value="SETTLED" label="已结算"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="付款状态">
            <qf-select v-model="queryCondition.payStatus" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="UNPAID" label="未付款"></qf-option>
              <qf-option value="PART_PAID" label="部分付款"></qf-option>
              <qf-option value="PAID" label="已付款"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8"></qf-col>
      </qf-row>
    </template>
  </query-condition>
</template>

<script lang="ts" src="./PurchaseReturnListSearch.ts"></script>

<style lang="scss">
  .purchase-list-search {

    .qf-form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .qf-date-editor {
        width: 100%;
      }
    }

  }
</style>
