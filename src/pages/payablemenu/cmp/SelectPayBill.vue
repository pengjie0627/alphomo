<template>
  <div class="select-pay-bill-view">
    <qf-dialog-def class="dialog-body-wrap" title="选择付款单据" @cancel="doCancel" @confirm="doConfirm">
      <section class="dialog-content">
        <qf-row>
          <qf-col :span="8">
            <qf-form-item label="单据编号：">
              <qf-input ref="fuzzy" placeholder="单号"  :maxlength="38" v-model="query[0]"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="16">
            <qf-form-item label="业务日期：" style="padding-left: 8px">
              <qf-date-picker
                v-model="query[1]"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </qf-date-picker>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row class="margin-top-10">
          <qf-col :span="8">
            <qf-form-item label="经办人：">
              <qf-select v-model="query[2]">
                <qf-option v-for="(item, index) in manageList" :key="index" :value="item.id" :label="item.name">{{item.name}}</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="单据类型：" style="padding-left: 8px">
              <qf-select v-model="query[3]">
                <qf-option value="">全部</qf-option>
                <qf-option value="SupplierStatement" label="结算单">结算单</qf-option>
                <qf-option value="ChargeDeduction" label="费用单(账款结算)">费用单(账款结算)</qf-option>
                <qf-option value="ChargeCash" label="费用单(现金)">费用单(现金)</qf-option>
                <qf-option value="AdvancePayment" label="预付款单(CNY)" v-if="currency === 'CNY'">预付款单(CNY)</qf-option>
                <qf-option value="AdvancePayment" label="预付款单(USD)" v-if="currency !== 'CNY'">预付款单(USD)</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
          </qf-col>
        </qf-row>
        <qf-row>
          <qf-col :span="8"></qf-col>
          <qf-col :span="8"></qf-col>
          <qf-col :span="8" style="text-align: right;margin-top: 10px">
            <qf-button type="primary" @click="onSearch">查询</qf-button>
            <qf-button @click="onReset">重置</qf-button>
          </qf-col>
        </qf-row>
        <qf-table
          class="margin-top-10"
          ref="tableDef"
          @selection-change="onSelectionChange"
          :data="tableData">
          <qf-table-column type="selection" align="center"/>
          <qf-table-column label="单据单号" align="center" width="135px" prop="billNum">
          </qf-table-column>
          <qf-table-column label="单据类型" prop="billType" width="250px" align="center" >
            <template slot-scope="props">
              {{getStatusName(props.row.billType)}}
            </template>
          </qf-table-column>
          <qf-table-column label="业务日期" prop="businessDate" align="center">
            <template slot-scope="props">
              {{props.row.businessDate ? props.row.businessDate.substring(0,11) : ''}}
            </template>
          </qf-table-column>
          <qf-table-column label="经办人" prop="manager.name"></qf-table-column>
          <qf-table-column label="应付金额(元)" prop="status" align="right">
            <template slot-scope="props">
              {{props.row.amount | fmt}}
            </template>
          </qf-table-column>
          <qf-table-column label="应付金额（美元)" prop="status" v-if="currency === 'USD'" align="right">
            <template slot-scope="props">
              {{props.row.foreignAmount | fmt}}
            </template>
          </qf-table-column>
        </qf-table>
        <qf-pagination
          class="margin-top-10"
          slot="pagination"
          :total="pagination.total"
          :page-size="pagination.limit"
          v-model="pagination.start"
          @change="onPageChange">
        </qf-pagination>
      </section>
    </qf-dialog-def>
  </div>
</template>
<script lang="ts" src='./SelectPayBill.ts'></script>
<style lang="scss">
  .select-pay-bill-view {
    .dialog-content{
      padding-top: 20px;
      min-height: 450px;
      width: 940px;
    }
    .margin-top-10{
      margin-top: 10px;
    }
    .qf-date-editor--daterange.qf-input__inner{
      width: 100%;
    }
  }
</style>
