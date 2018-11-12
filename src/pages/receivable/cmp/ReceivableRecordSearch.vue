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
          <qf-form-item label="业务日期">
            <div class="qf-form-group">
              <qf-date-picker v-model="queryCondition.businessDate" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                              range-separator="~"
                              start-placeholder="开始日期" end-placeholder="结束日期"></qf-date-picker>
            </div>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="经办人">
            <search display-field="name" v-model="manager" @input="onManagerChange" placeholder="请输入名称查询" type="user"/>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="审核状态">
            <qf-select v-model="queryCondition.status" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="UNAUDITED" label="未审核"></qf-option>
              <qf-option value="AUDITED" label="已审核"></qf-option>
              <qf-option value="ABOLISHED" label="已作废"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
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
        <qf-col :span="8">
          <qf-form-item label="其他">
            <qf-input :maxlength="limits.billNum" v-model="queryCondition.businessBillNum"
                      placeholder="业务单据单号"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </template>
  </query-condition>
</template>

<script lang="ts" src="./ReceivableRecordSearch.ts"></script>

<style scoped>

</style>
