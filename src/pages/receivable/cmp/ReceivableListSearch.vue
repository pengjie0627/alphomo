<template>
  <query-condition ref="query" @search="doSearch" @reset="doReset" @toggle="doToggle" class="sale-list-search">
    <qf-form-item label-width="0">
      <qf-input placeholder="请输入客户编号/名称/联系人等" v-model="queryCondition.customer"
                :maxlength="limits.code" @keydown.native.enter="doEnterSearch()"></qf-input>
    </qf-form-item>
    <template slot="opened">
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="客户：">
            <qf-input :maxlength="limits.customer" v-model="queryCondition.customer"
                      placeholder="客户编号／名称／联系人等" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="业务日期:">
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
          <qf-checkbox v-model="checkbox" class="checkbox">
            不显示从未交易过的客户
          </qf-checkbox>
        </qf-col>
      </qf-row>
    </template>
  </query-condition>
</template>

<script lang="ts" src="./ReceivableListSearch.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .sale-list-search {
    .qf-form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .checkbox {
      color: $--color-font-light-2
    }

  }
</style>
