<template>
  <query-condition ref="query" @search="doSearch" @reset="doReset" @toggle="doToggle" class="sku-list-search">
    <qf-form-item label="" label-width="0">
      <qf-input placeholder="请输入商品条码/名称/编号/助记码进行搜索" v-model="queryCondition.keyword"
                :maxlength="limits.keywords" @keydown.native.enter="doEnterSearch()"></qf-input>
    </qf-form-item>
    <template slot="opened">
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="商品名称">
            <qf-input placeholder="请输入" v-model="queryCondition.name" :maxlength="limits.name" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="条码">
            <qf-input placeholder="请输入" v-model="queryCondition.barcode" :maxlength="limits.barcode" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="商品编号">
            <qf-input placeholder="请输入" v-model="queryCondition.code" :maxlength="limits.code" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row>
        <qf-col :span="8">
          <qf-form-item label="外部编码">
            <qf-input placeholder="请输入" v-model="queryCondition.externalCode" :maxlength="limits.externalCode" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="所属供应商">
            <qf-select v-model="queryCondition.supplier" clearable placeholder="请选择" display-field="name" value-key="id">
              <!--// <qf-option label="无" value=""></qf-option>-->
              <qf-option v-for="(item,index) in supplierList" :key="index" :value="item"
                         :label="item.name"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </template>
  </query-condition>
</template>

<script lang="ts" src="./SkuSearch.ts"></script>

<style lang="scss">
  .sku-list-search {
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
