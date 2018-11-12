<template>
  <page-body :menu="menu" class="payable-detail">
    <qf-table v-show="false"></qf-table>
    <div slot="actions">
      <view-btn :receipt="receipt" @getDetail="getDetail" :ids="ids" :query="query"></view-btn>
    </div>
    <div class="content">
      <bill-body class="sale-detail-body">
        <bill-view-title slot="title" title="收款单" :receipt="receipt" :isView="isView"
                         :billNum="billNum" :status="status" :ids="ids" :query="query"
                         :customer="customer" @getDetail="onGetDetail"></bill-view-title>
        <template slot="header">
          <qf-row class="sale-view-header">
            <qf-col :span="8">
              <qf-form-item class="sku-code" label="客户：" labelWidth="70px">
                <span>{{receipt.customer.name}}</span>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item class="sku-code" label="经办人：" labelWidth="70px">
                {{receipt.manager.name}}

              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item class="sku-code" label="业务日期：" labelWidth="90px">
                <span>{{receipt.businessDate | dateFormatter}}</span>
              </qf-form-item>
            </qf-col>

          </qf-row>
        </template>
        <div slot="table">
          <bill-view-money-table :receipt="receipt"></bill-view-money-table>
        </div>

        <template slot="summary">
          <qf-form-item label="备注：">
            <span>{{receipt.remark}} </span>
          </qf-form-item>
        </template>
        <div slot="remark">
          <qf-form-item label="图片附件：">
            <img v-for="(item, index) in model" @click="onToCheck(item.url)" :key="index" :src="item.url" alt="暂无图片" style="width: 104px;height: 104px;margin-left: 10px">

          </qf-form-item>

        </div>
        <operate-log-view slot="operateLog" class="operate-log" :logs="logs"></operate-log-view>
        <div slot="bottomActions" v-if="status=='ABOLISHED'" class="bottomAction">
          <qf-form-item label="单据状态：">
            <span class="tag">  <qf-tag type="err" class="ml15"
            >{{receipt.status | statusFormatter}}</qf-tag> </span>
          </qf-form-item>
        </div>

      </bill-body>
      <div class="billList">
        <bill-view-action-table :data="receipt.lines"></bill-view-action-table>
        <div class="tools">
          <view-btn :receipt="receipt" @getDetail="getDetail"></view-btn>
        </div>

      </div>
    </div>
  </page-body>
</template>
<script lang="ts" src="./ReceiptBillView.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .payable-detail {
    .content {
      background: #ffffff;
      padding: 10px 20px;
      line-height: 36px;
      .qf-form-label {
        text-align: left;
        padding-left: 5px;
      }
      .tools {
        padding: 10px 0;
        clear: both;
        height: 200px;
      }
      .bottomAction {
        .qf-form-content {
          text-align: left
        }
      }
    }
  }

</style>
