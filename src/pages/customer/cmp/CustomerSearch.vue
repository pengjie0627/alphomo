<template>
  <query-condition @search="doSearch" @reset="doReset" @toggle="doToggle" class="customer-list-search">
    <qf-form-item label="" label-width="0">
      <qf-input placeholder="请输入客户编号/名称/助记码/联系人/电话进行搜索" v-model="queryCondition.keywords"
                :maxlength="limits.keywords" @keydown.native.enter="doEnterSearch()"></qf-input>
    </qf-form-item>
    <template slot="opened">
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="客户编号">
            <qf-input placeholder="请输入" v-model="queryCondition.code" :maxlength="limits.code" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="客户名称">
            <qf-input placeholder="请输入" v-model="queryCondition.name" :maxlength="limits.name" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="客户类型">
            <qf-select v-model="queryCondition.category" clearable>
              <qf-option value="" label="全部"></qf-option>
              <qf-option value="NORMAL" label="一般客户"></qf-option>
              <qf-option value="JOIN" label="加盟店"></qf-option>
              <!--<qf-option value="DIRECT" label="直营店"></qf-option>-->
            </qf-select>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="联系人">
            <qf-input placeholder="请输入" v-model="queryCondition.contact" :maxlength="limits.contact" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="联系电话">
            <qf-input placeholder="请输入" v-model="queryCondition.mobile" :maxlength="limits.mobile" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="邮箱">
            <qf-input placeholder="请输入" v-model="queryCondition.email" :maxlength="limits.email" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </template>
  </query-condition>
</template>

<script lang="ts" src="./CustomerSearch.ts"></script>

<style lang="scss">
  .customer-list-search {

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
