<template>
  <div class="purchase-view-summary">
    <qf-form-item label="税额" labelWidth="100px" class="form-item">
      <div class="wid100" v-if="hasPermissions('price.refPurchasePrice')">{{bill.taxAmount}}</div>
      <div class="wid100" v-else>*****</div>
    </qf-form-item>
    <qf-form-item v-if="merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputOnlyTax" label="合计金额(去税)"
                  labelWidth="100px" class="form-item">
      <div class="wid100" v-if="hasPermissions('price.refPurchasePrice')">{{bill.taxExcAmount.toString() | fmtThumbFor}}
      </div>
      <div class="wid100" v-else>*****</div>
    </qf-form-item>
    <qf-form-item label="合计金额(含税)" labelWidth="100px" class="form-item">
      <div class="wid100" v-if="hasPermissions('price.refPurchasePrice')">{{totalAmount}}</div>
      <div class="wid100" v-else>*****</div>
    </qf-form-item>
    <qf-form-item v-if="false" label="其他费用" labelWidth="100px" class="form-item">
      <div class="wid100">{{bill.chargeAmount.toString() | fmtThumbFor}}</div>
    </qf-form-item>
    <qf-form-item v-if="false" label="优惠金额" labelWidth="100px" class="form-item">
      <div class="wid100">-&nbsp;&nbsp;{{bill.discountAmount.toString() | fmtThumbFor}}</div>
    </qf-form-item>
    <qf-form-item v-if="false" label="应付金额" labelWidth="100px" class="form-item label-bold">
      <div class="wid100 red-amount" v-if="hasPermissions('price.refPurchasePrice')">{{bill.realAmount.toString() |
        fmtThumbFor}}
      </div>
      <div class="wid100 red-amount" v-else>*****</div>
    </qf-form-item>
  </div>
</template>
<script lang="ts" src="./PurchaseViewSummary.ts"></script>

<style lang="scss">
  .purchase-view-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .form-item {
      width: 250px;
      text-align: right;
      line-height: 35px
    }
    .label-bold {
      font-weight: bold !important;
    }
    .red-amount {
      color: #FF554B;
      font-weight: bold;
    }
  }
</style>
