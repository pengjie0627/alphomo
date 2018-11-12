<template>
  <div class="sale-title">
    <div class="bill-info">
      <div class="bill-num">
        <label>单号: </label>
        <label>{{bill.billNum}}</label>
        <label class="mrgl60">来源: </label>
        <label v-if="bill.externalBill">{{bill.externalBill | source}}</label>
        <label v-else>--</label>
      </div>
      <div class="bill-num">
        <label v-if="bill.externalBill&&bill.externalBill.billNum">订单号: </label>
        <label v-if="bill.externalBill&&bill.externalBill.billNum">{{bill.externalBill.billNum}}</label>
        <div v-if="bill.saleReturns&&bill.saleReturns.length > 0" class="rtn-num">
          <label>退货单号: </label>
          <a v-for="saleReturn in bill.saleReturns" @click="toSaleRtnDtl(saleReturn.id)" :key="saleReturn.id" style="color: #007ace;margin-left: 5px">{{saleReturn.billNum}}</a>
        </div>
      </div>
    </div>
    <label class="billType">
      <span class="type-title">销售单</span>
      <qf-tag type="warning" class="ml15" v-if="bill.status=='UNAUDITED'">{{bill.status | status}}</qf-tag>
      <qf-tag type="info" class="ml15" v-if="bill.status=='AUDITED'">{{bill.status | status}}</qf-tag>
      <qf-tag type="success" class="ml15" v-if="bill.status=='PART_DELIVERED'">{{bill.status | status}}</qf-tag>
      <qf-tag type="success" class="ml15" v-if="bill.status=='DELIVERED'">{{bill.status | status}}</qf-tag>
      <qf-tag type="err" class="ml15" v-if="bill.status=='ABOLISHED'">{{bill.status | status}}</qf-tag>
      <qf-tag class="ml15" type="success" v-if="bill.settleStatus=='SETTLED'">{{bill.settleStatus | settleStatus}}
      </qf-tag>
      <qf-tag class="ml15" type="success" v-if="bill.settleStatus=='PART_SETTLED'">{{bill.settleStatus | settleStatus}}
      </qf-tag>
    </label>
    <div class="actions">
      <qf-button v-if="presentation=='view'" @click="prev">上一单</qf-button>
      <qf-button v-if="presentation=='view'" @click="next">下一单</qf-button>
    </div>
  </div>
</template>
<script lang="ts" src="./SaleTitle.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .sale-title {
    display: flex;
    align-items: center;

    .bill-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 33%;
      .bill-num {
        color: $--color-font-light-2;

        .mrgl60 {
          margin-left: 60px;
        }
        .rtn-num {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .billType {
      width: 250px;
      color: $--color-font;
      display: flex;
      align-items: center;
      overflow: hidden;
      .type-title {
        font-size: 20px;
      }
      .ml15 {
        margin-left: 15px;
      }
    }
    .actions {
      text-align: right;
      flex: 1;
    }
  }
</style>
