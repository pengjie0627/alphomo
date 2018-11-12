<template>
  <query-condition ref="query" @search="doSearch" @reset="doReset" @toggle="doToggle"
                   class="balance-rpt-search">
    <qf-form-item label="" label-width="0">
      <qf-form-item label="单据编号">
        <qf-input placeholder="请输入" v-model="queryCondition.billNum" @keydown.native.enter="doEnterSearch()"></qf-input>
      </qf-form-item>
    </qf-form-item>
    <template slot="opened">
      <qf-row class="common-style date-style">
        <qf-col :span="8">
          <qf-form-item label="单据编号">
            <qf-input placeholder="请输入" v-model="queryCondition.billNum" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>

        <qf-col :span="16">
          <qf-form-item label="业务日期">
            <qf-date-picker v-model="queryCondition.businessDate"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            :disabled="businessTime === '全部'"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"></qf-date-picker>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <qf-row class="common-style date-style">

        <qf-col :span="8">
          <qf-form-item label="业务对象">
            <qf-input placeholder="请输入对象名称" v-model="queryCondition.csName" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>

        <qf-col :span="16">
          <qf-form-item label="制单日期">
            <qf-date-picker v-model="queryCondition.created"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            :disabled="businessTime === '全部'"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"></qf-date-picker>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row class="common-style date-style">
        <qf-col :span="8">
          <qf-form-item label="收支类型">
            <qf-select placeholder="全部" clearable v-model="queryCondition.billType">
              <qf-option value="receipt" label="收入"></qf-option>
              <qf-option value="payment" label="支出"></qf-option>
            </qf-select>
          </qf-form-item>

        </qf-col>
      </qf-row>
    </template>
  </query-condition>
</template>

<script lang="ts" src="./BalanceRptSearch.ts">

</script>

<style lang="scss">
  .balance-rpt-search {
    .qf-date-editor {
      width: 100% !important;
    }
  }
</style>
