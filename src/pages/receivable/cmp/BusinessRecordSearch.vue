<template>
  <query-condition @search="doSearch" @reset="doReset" @toggle="doToggle" class="sale-list-search">
    <qf-form-item label="">
      <qf-input placeholder="单号" v-model="queryCondition.billNum"
                :maxlength="limits.billNum"></qf-input>
    </qf-form-item>
    <template slot="opened">
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="单据信息">
            <qf-input placeholder="单号" v-model="queryCondition.billNum"
                      :maxlength="limits.billNum"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="业务类型">
            <qf-select v-model="queryCondition.billType" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="Begin" label="期初收款"></qf-option>
              <qf-option value="OtherReceiptLine" label="其他收入"></qf-option>
              <qf-option value="Sale" label="销售"></qf-option>
              <qf-option value="SaleReturn" label="销售退货"></qf-option>
            </qf-select>
          </qf-form-item>

        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="业务日期">
            <div class="qf-form-group">
              <qf-date-picker v-model="queryCondition.businessDate" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                              range-separator="~"
                              start-placeholder="开始日期" end-placeholder="结束日期"></qf-date-picker>
            </div>
          </qf-form-item>

        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="经办人">
            <search display-field="name" v-model="manager" @input="onManagerChange" type="user"
                    placeholder="请输入名称查询"/>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="制单日期">
            <div class="qf-form-group">
              <qf-date-picker v-model="queryCondition.createdDate" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                              range-separator="~"
                              start-placeholder="开始日期" end-placeholder="结束日期"></qf-date-picker>
            </div>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="制单人">
            <search display-field="name" v-model="creator" placeholder="请输入名称查询" @input="onCreatorChange" type="user"/>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="核销状态">
            <qf-select v-model="queryCondition.settleStatus" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="UNSETTLED" label="未核销"></qf-option>
              <qf-option value="PART_SETTLED" label="部分核销"></qf-option>
              <qf-option value="SETTLED" label="已核销"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </template>
  </query-condition>
</template>

<script lang="ts" src="./BusinessRecordSearch.ts"></script>

<style lang="scss"></style>
