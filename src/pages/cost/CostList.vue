<template>
  <page-body class="cost-list" :menu="menu">

    <!-- 头部 -->
    <div slot="actions">
      <qf-button icon="ic_icon-add" type="default" @click="doImport" v-if="hasPermissions('finance.payable.export')">导出
      </qf-button>
      <qf-button icon="ic_icon-add" type="primary" @click="doGoCreate" v-if="hasPermissions('finance.payable.create')">
        新建费用单
      </qf-button>
    </div>
    <div class="container">
      <cost-list-search @resetFilters="resetFilters" @setFilters="setFilters">
      </cost-list-search>
      <div class="summary"></div>
      <div class="table">
        <qf-table :data="data" row-key="id" class="business-record-table" @sort-change="doSortChange">
          <qf-table-column label="序号" type="index" width="70"></qf-table-column>
          <qf-table-column label="操作" align="center">
            <template slot-scope="props">
              <qf-button type="link" v-if="props.row.billType=='Purchase'&&hasPermissions('purchase.purchase.view')"
                         @click="doGoDetail(props.row.id,props.row.billType)">审核
              </qf-button>
              <qf-button type="link"
                         v-if="props.row.billType=='PurchaseReturn'&&hasPermissions('purchase.purchaseReturn.view')"
                         @click="doGoDetail(props.row.id,props.row.billType)">编辑
              </qf-button>
              <qf-button type="link"> 作废</qf-button>
            </template>
          </qf-table-column>

          <qf-table-column label="单号" prop="billNum"></qf-table-column>

          <qf-table-column label="业务日期" sortable prop="businessDate" :formatter="dateFormatter"></qf-table-column>
          <qf-table-column label="供应商" prop="supplier.name"></qf-table-column>
          <qf-table-column label="经办人 " prop="manager.name" :formatter="billTypeFormatter"></qf-table-column>
          <qf-table-column label="付款状态" prop="settleStatus" :formatter="settleFormatter"></qf-table-column>
          <qf-table-column label="单据状态" prop="amount" :formatter="priceFormatter"></qf-table-column>
          <qf-table-column label="付款类型" sortable prop="paidAmount" :formatter="priceFormatter"></qf-table-column>
          <qf-table-column label="费用金额(元)">
            <template slot-scope="props">
              <span class="success">{{props.row.remainAmount | price}}</span>
            </template>
          </qf-table-column>
        </qf-table>
      </div>
    </div>
  </page-body>
</template>

<script lang="ts" src="./CostList.ts"></script>

<style lang="scss">

</style>
