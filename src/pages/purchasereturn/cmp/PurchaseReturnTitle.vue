<template>
  <div class="purchase-return-title">
    <div class="bill-info">
      <div class="bill-num">
        <label>单号: </label>
        <label>{{bill.billNum}}</label>
      </div>
      <div class="bill-num">
        <label v-if="bill.externalBill&&bill.externalBill.billNum">订单号: </label>
        <label v-if="bill.externalBill&&bill.externalBill.billNum">{{bill.externalBill.billNum}}</label>
        <div v-if="bill.purchase">
          <label>进货单号: </label>
          <a @click="toPurchaseDtl()" class="pre-bill">
            <label> {{bill.purchaseBillNum}}</label>
          </a>
        </div>
      </div>
    </div>
    <label class="billType">
      <span class="type-title">退货单</span>
      <qf-tag type="warning" class="ml15" v-if="bill.status=='UNAUDITED'">{{bill.status | status}}</qf-tag>
      <qf-tag type="info" class="ml15" v-if="bill.status=='AUDITED'">{{bill.status | status}}</qf-tag>
      <qf-tag type="success" class="ml15" v-if="bill.status=='PART_RETURNED'">{{bill.status | status}}</qf-tag>
      <qf-tag type="success" class="ml15" v-if="bill.status=='RETURNED'">{{bill.status | status}}</qf-tag>
      <qf-tag type="err" class="ml15" v-if="bill.status=='ABOLISHED'">{{bill.status | status}}</qf-tag>
      <qf-tag class="ml15" type="info" v-if="bill.settleStatus=='PART_SETTLED'">{{bill.settleStatus | settleStatus}}</qf-tag>
      <qf-tag class="ml15" type="success" v-if="bill.settleStatus=='SETTLED'">{{bill.settleStatus | settleStatus}}</qf-tag>
      <qf-tag class="ml15" type="info" v-if="bill.payStatus=='PART_PAID'">{{bill.payStatus | payStatus}}</qf-tag>
      <qf-tag class="ml15" type="success" v-if="bill.payStatus=='PAID'">{{bill.payStatus | payStatus}}</qf-tag>
    </label>
    <div class="actions">
      <qf-button v-if="presentation=='view'" @click="prev">上一单</qf-button>
      <qf-button v-if="presentation=='view'" @click="next">下一单</qf-button>
    </div>
  </div>
</template>
<script lang="ts" src="./PurchaseReturnTitle.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .purchase-return-title {
    display: flex;
    align-items: center;
    .bill-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      .bill-num {
        color: $--color-font-light-2;

        .mrgl60 {
          margin-left: 60px;
        }
        .pre-bill {
          text-decoration: none;
          cursor: pointer;
          color: #007ace;
        }
      }
    }
    .billType {
      // width: 230px;
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
