<template>
  <div class="search">
    <query-condition ref="query" @search="doSearch" @reset="doReset" @toggle="doToggle" class="sale-list-search">
      <qf-form-item label-width="0">
        <qf-input placeholder="单号" v-model="queryCondition.billNo"
                  :maxlength="limits.code"></qf-input>
      </qf-form-item>
      <template slot="opened">
        <qf-row>
          <qf-col :span="8">
            <qf-form-item label="单据信息：">
              <qf-input :maxlength="limits.billNo" v-model="queryCondition.billNo"
                        placeholder="单号"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="业务日期:">
              <div class="qf-form-group">
                <qf-date-picker v-model="queryCondition.businessDate" value-format="yyyy-MM-dd HH:mm:ss"
                                type="daterange"
                                range-separator="~"
                                start-placeholder="开始日期" end-placeholder="结束日期"></qf-date-picker>
              </div>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="经办人：">
              <search display-field="name" v-model="queryCondition.manager" @input="onManagerChange" type="user"
                      placeholder="请输入名称查询"/>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row>
          <qf-col :span="8">
            <qf-form-item label="付款状态：">
              <qf-select v-model="queryCondition.payStatus" clearable>
                <qf-option value="" label="全部"></qf-option>
                <qf-option value="Begin" label="未付款"></qf-option>
                <qf-option value="OtherPaymentLine" label="已付款"></qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="单据状态：">
              <qf-select v-model="queryCondition.billStatus" clearable>
                <qf-option value="" label="全部"></qf-option>
                <qf-option value="anAudit" label="未审核"></qf-option>
                <qf-option value="audit" label="已审核"></qf-option>
                <qf-option value="abolished" label="已作废"></qf-option>
              </qf-select>

            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="付款类型：">
              <qf-select v-model="queryCondition.payType" clearable>
                <qf-option value="" label="全部"></qf-option>
                <qf-option value="Begin" label="账款抵扣"></qf-option>
                <qf-option value="OtherPaymentLine" label="现金交款"></qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row>
          <qf-col :span="8">
            <qf-input placeholder="备注" v-model="queryCondition.remarks" :maxlength="limits.remark"></qf-input>
          </qf-col>
        </qf-row>
      </template>
    </query-condition>
  </div>
</template>

<script lang="ts" src="./CostListSearch.ts"></script>

<style lang="scss">

</style>
