<template>
  <div class="sale-return-view-summary">
    <qf-form-item label="税额" labelWidth="100px" class="form-item">
      <div class="wid100">{{bill.taxAmount.toString() | fmtThumbFor}}</div>
    </qf-form-item>
    <qf-form-item v-if="merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputOnlyTax" label="合计金额(去税)"
                  labelWidth="100px" class="form-item">
      <div class="wid100">{{bill.taxExcAmount.toString() | fmtThumbFor}}
      </div>
    </qf-form-item>
    <qf-form-item label="合计金额(含税)" labelWidth="100px" class="form-item">
      <div class="wid100">{{totalAmount.toString() | fmtThumbFor}}</div>
    </qf-form-item>
    <qf-form-item v-if="false" label="其他费用" labelWidth="100px" class="form-item">
      <div class="wid100">{{bill.chargeAmount.toString() | fmtThumbFor}}</div>
    </qf-form-item>
    <qf-form-item v-if="false" label="退款金额(含税)" labelWidth="100px" class="form-item label-bold">
      <div class="wid100 red-amount">{{bill.realAmount.toString() | fmtThumbFor}}</div>
    </qf-form-item>
  </div>
</template>
<script lang="ts" src="./SaleReturnViewSummary.ts"></script>

<style lang="scss">
  .sale-return-view-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .form-item {
      width: 250px;
      text-align: right;
      line-height: 35px;
      .red-amount {
        color: #FF554B;
        font-weight: bold;
      }
    }
    .label-bold {
      font-weight: bold !important;
    }
  }
</style>
