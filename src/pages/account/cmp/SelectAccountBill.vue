<template>
  <div class="select-account-bill-view">
    <qf-dialog-def class="dialog-body-wrap" title="结算单据" @cancel="doCancel" @confirm="doConfirm">
      <section class="dialog-content">
        <qf-row>
          <qf-col :span="8">
            <qf-form-item label="单据信息：" style="padding-left: 8px">
              <qf-input v-model="query[0]" ref="fuzzy" placeholder="单据"  :maxlength="38"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="16">
            <qf-form-item label="业务日期：" style="padding-left: 8px">
              <qf-date-picker
                v-model="query[1]"
                value-format="yyyy-MM-dd HH:mm:ss"
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
            <qf-form-item label="经办人：" style="padding-left: 8px">
              <qf-select v-model="query[2]">
                <qf-option v-for="item in manageList" :value="item.id" :label="item.name">{{item.name}}</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="单据类型：" style="padding-left: 8px">
              <qf-select v-model="query[3]">
                <qf-option value="" label="全部">全部</qf-option>
                <qf-option value="Purchase" label="进货单">进货单</qf-option>
                <qf-option value="PurchaseReturn" label="进货退单">进货退单</qf-option>
                <qf-option value="Begining" label="期初库存">期初库存</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="结算状态：" style="padding-left: 8px">
              <qf-select v-model="query[4]">
                <qf-option value="" label="全部">全部</qf-option>
                <qf-option value="UNSETTLED" label="未结算">未结算</qf-option>
                <qf-option value="PART_SETTLED" label="部分结算">部分结算</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row>
          <qf-col :span="8" style="text-align: right"></qf-col>
          <qf-col :span="8" style="text-align: right"></qf-col>
          <qf-col :span="8" style="text-align: right;margin-top: 10px" >
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
          <qf-table-column label="单据单号" align="left" width="135px" prop="billNum">
          </qf-table-column>
          <qf-table-column label="单据类型" prop="businessType" width="120px" align="left">
            <template slot-scope="props">
              <div>{{props.row.businessType === 'Purchase' ? '进货单' : (props.row.businessType === 'Begining' ? '期初库存' : '进货退单')}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="业务日期" align="center" prop="businessDate" width="180px"></qf-table-column>
          <qf-table-column label="经办人" prop="manager.name" align="left" width="180px"></qf-table-column>
          <qf-table-column label="结算状态" prop="settleStatus" width="100px" align="center">
            <template slot-scope="props">
              <div style="color: #FFCC66" v-if="props.row.settleStatus === 'UNSETTLED'">未结算</div>
              <div style="color: #66CCFF" v-if="props.row.settleStatus === 'PART_SETTLED'">部分结算</div>
              <div style="color: #33CC66" v-if="props.row.settleStatus !== 'UNSETTLED' && props.row.settleStatus !== 'PART_SETTLED'">已结算</div>
            </template>
          </qf-table-column>
          <qf-table-column label="剩余应结(元)" prop="remainedAmount" :formatter="formatter" align="right"></qf-table-column>
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
<script lang="ts" src='./SelectAccountBill.ts'></script>
<style lang="scss">
  .select-account-bill-view {
    .dialog-content{
      padding-top: 20px;
      min-height: 450px;
    }
    .margin-top-10{
      margin-top: 10px;
    }
    .qf-date-editor--daterange.qf-input__inner{
      width: 100%;
    }
  }
</style>
