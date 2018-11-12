<template>

  <qf-dialog-def class="verification-other" title="其他支出"
                 @cancel="doCancel" @confirm="doConfirm">
    <div class="content">
      <qf-row>
        <qf-col :span="12">
          <qf-form-item label="业务日期" label-width="80px" required>
            <qf-date-picker v-model="businessDate" value-format="yyyy-MM-dd" placeholder="选择日期"
            ></qf-date-picker>
          </qf-form-item>
        </qf-col>
        <qf-col :span="12">
          <qf-form-item label="应付金额" label-width="80px" required>
            <qf-input :auto-create="true" v-model="amount" :scale="2"></qf-input>

          </qf-form-item>
        </qf-col>
      </qf-row>
    </div>
  </qf-dialog-def>
</template>

<script lang="ts" src="./VerificationOther.ts"></script>

<style lang="scss">
  .verification-other {
    width: 550px;
    min-height: 350px;
    .content {
      padding: 40px 20px;
    }
    .qf-dialog-body {
      overflow: visible;
    }
    .qf-form-content {
      padding-right: 5px;
    }
    .qf-form-label {
      text-align: right;
      padding-right: 5px;
    }
  }
</style>
