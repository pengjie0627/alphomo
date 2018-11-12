<template>
  <div class="adv-pay-list-view">
    <page-body :menu="menu">
      <!-- 面包屑中间部分 插槽位slot="tip" -->
      <div slot="tip">
        <!--<qf-tip type="info" class="tip-width">您当前员工数为1,最多可添加5个员工，<qf-button type="link" @click="onBuyNow">立即续订</qf-button></qf-tip>-->
      </div>
      <!--面包屑右边部分 插槽位slot="actions"-->
      <template slot="actions">
        <qf-button type="primary" @click="onAddPay()" v-if="hasPermissions('finance.advancePayment.create')">新建预付款单</qf-button>
        <qf-button  @click="doImport()" v-if="hasPermissions('finance.advancePayment.import')">导入预付款单</qf-button>
      </template>
      <list-container>
        <!-- 标准搜索栏 插槽位slot="search"-->
        <query-condition slot="search" @search="search" @reset="reset" @toggle="toggle" ref="search">
          <qf-form-item labelWidth="0px">
            <qf-input ref="fuzzy" @keydown.native.enter="doEnterSearch()" placeholder="请输入单号/供应商/订单号/合同单号/备注进行搜索" v-model="query.closed[0]" :maxlength="255"></qf-input>
          </qf-form-item>
          <!--如果列数为3的倍数的插槽位 slot="opened"-->
          <template slot="opened">
            <qf-row>
              <qf-col :span="8">
                <qf-form-item label="单据编号">
                  <qf-input @keydown.native.enter="doEnterSearch()" placeholder="单号" :maxlength="38" v-model="query.expand[0]"></qf-input>
                </qf-form-item>
              </qf-col>
              <qf-col :span="16">
                <qf-form-item label="业务日期">
                  <qf-date-picker
                    v-model="query.expand[1]"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </qf-date-picker>
                </qf-form-item>
              </qf-col>
            </qf-row>
            <qf-row>
              <qf-col :span="8">
                <qf-form-item label="经办人">
                  <!--<qf-select v-model="query.expand[2]">-->
                    <!--<qf-option v-for="(item, index) in manageList" :key="index" :value="item.id" :label="item.name">{{item.name}}</qf-option>-->
                  <!--</qf-select>-->
                  <qf-input placeholder="请输入经办人" v-model="query.expand[2]"
                            :maxlength="32" @keydown.native.enter="doEnterSearch()"></qf-input>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="供应商">
                  <!--<qf-select v-model="query.expand[3]">-->
                    <!--<qf-option v-for="(item, index) in providerList" :key="index" :value="item.id" :label="item.name">{{item.name}}</qf-option>-->
                  <!--</qf-select>-->
                  <qf-input placeholder="请输入供应商" v-model="query.expand[3]"
                            :maxlength="32" @keydown.native.enter="doEnterSearch()"></qf-input>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="单据状态">
                  <qf-select v-model="query.expand[4]">
                    <qf-option value="" label="全部">全部</qf-option>
                    <qf-option value="UNAUDITED" label="未审核">未审核</qf-option>
                    <qf-option value="AUDITED" label="已审核">已审核</qf-option>
                    <qf-option value="ABOLISHED" label="已作废">已作废</qf-option>
                  </qf-select>
                </qf-form-item>
              </qf-col>
            </qf-row>
            <qf-row>
              <qf-col :span="8">
                <qf-form-item label="币种">
                  <qf-select v-model="query.expand[6]">
                    <qf-option value="" label="全部">全部</qf-option>
                    <qf-option value="USD" label="USD">USD</qf-option>
                    <qf-option value="CNY" label="CNY">CNY</qf-option>
                  </qf-select>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="抵扣状态">
                  <qf-select v-model="query.expand[5]">
                    <qf-option value="" label="全部">全部</qf-option>
                    <qf-option value="UNDEDUCT" label="未抵扣">未抵扣</qf-option>
                    <qf-option value="DEDUCTED" label="已抵扣">已抵扣</qf-option>
                  </qf-select>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="订单号">
                  <qf-input placeholder="订单号" :maxlength="38" v-model="query.expand[8]" @keydown.native.enter="doEnterSearch()"></qf-input>
                </qf-form-item>
              </qf-col>
            </qf-row>
            <qf-row>
              <qf-col :span="8">
                <qf-form-item label="合同单号">
                  <qf-input placeholder="合同单号" :maxlength="38" v-model="query.expand[7]" @keydown.native.enter="doEnterSearch()"></qf-input>
                </qf-form-item>
              </qf-col>
            </qf-row>
          </template>
          <!--剩余2列和按钮在一行的插槽位 slot="openedQuery"-->
          <template slot="openedQuery"></template>
        </query-condition>
        <!-- 表格上面的按钮组 -->
        <div slot="toolbar">
          <qf-row>
            <qf-col :span="12">
              <qf-button type="primary" @click="onExport" v-if="hasPermissions('finance.advancePayment.export')">导出全部</qf-button>
              <print-view :id="selectId" type="AdvancePayment" btnType="default" :disabled="selectId.length <= 0" v-if="hasPermissions('finance.advancePayment.print')"></print-view>
            </qf-col>
            <qf-col :span="12">
              <div class="total-amount line-height">合计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{getSumAmount | fmt}}</span></div>
            </qf-col>
          </qf-row>
        </div>
        <advance-able-menu-table
          slot="list"
          @refreshList="onRefreshList"
          @refreshListBySort="onRefreshListBySort"
          @printEvent="onPrintEvent"
          :printFlag="printFlag"
          :queryParams="getQueryParams"
          :tableData="tableData">
        </advance-able-menu-table>
        <qf-pagination
          slot="pagination"
          :total="pagination.total"
          :page-size="pagination.limit"
          v-model="pagination.start"
          @change="onPageChange">
        </qf-pagination>
      </list-container>
    </page-body>
  </div>
</template>
<script lang="ts" src='./AdvancePaymentList.ts'></script>
<style lang="scss">
  .adv-pay-list-view {
    .qf-date-editor--daterange.qf-input__inner{
      width: 100%;
    }
    .total-amount{
      font-weight: bold;
      font-size: 13px;text-align: right;
      span{
        font-weight: bold;
        color: #33CC66;
      }
    }
    .line-height{
      line-height: 36px;
    }
  }
</style>
