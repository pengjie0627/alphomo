<template>
  <div class="sale-edit-summary">
    <qf-form-item label="税额" labelWidth="100px" class="form-item">
      <qf-input readonly v-model="bill.taxAmount" scale="2" align="right" class="readOnly-input"></qf-input>
    </qf-form-item>
    <qf-form-item label="合计金额(去税)" labelWidth="100px" class="form-item"
                  v-if="merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputOnlyTax">
      <qf-input readonly v-model="bill.taxExcAmount" scale="2" align="right" class="readOnly-input"></qf-input>
    </qf-form-item>
    <qf-form-item label="合计金额(含税)" labelWidth="100px" class="form-item">
      <qf-input readonly :value="totalAmount()" scale="2" align="right" class="readOnly-input"></qf-input>
    </qf-form-item>
    <qf-form-item v-if="false" label="其他费用" labelWidth="100px" class="form-item">
      <qf-input
        v-model="bill.chargeAmount"
        selectOnfocus
        scale="2"
        align="right"
        v-form:chargeAmount="validator">
      </qf-input>
    </qf-form-item>
    <qf-form-item v-if="false" label="优惠金额" labelWidth="100px" class="form-item">
      <qf-input v-model="bill.discountAmount" selectOnfocus scale="2" align="right" v-form:discountAmount="validator">
        <span slot="icon">-</span>
      </qf-input>
    </qf-form-item>
    <qf-form-item v-if="false" label="销售金额(含税)" labelWidth="100px" class="form-item label-bold">
      <qf-input readonly :value="realAmount()" scale="2" align="right" class="readOnly-input red-amount"></qf-input>
    </qf-form-item>
  </div>
</template>

<script lang="ts" src="./SaleSummary.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .sale-edit-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .form-item {
      width: 300px;
      .readOnly-input {
        border: none;
      }
      .red-amount input {
        color: #FF554B !important;
        font-weight: bold !important;
      }
    }
    .label-bold {
      font-weight: bold !important;
    }
  }
</style>
