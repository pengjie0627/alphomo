<template>
  <section class="inventory-check-summary">
    <qf-row justify="flex-end">
      <qf-col :span="8">
        <qf-form-item label="">
          <div class="summary-charge">
            <span class="label">盈亏总额</span>
            <span class="content red"
                  v-if="hasPermissions('price.costPrice') && amount>0">{{ `￥ ${amount.toFixed(2)}`
              }}</span>
            <span class="content green"
                  v-else-if="hasPermissions('price.costPrice') && amount<0">{{ `￥ ${amount.toFixed(2)}`
              }}</span>
            <span class="content"
                  v-else-if="hasPermissions('price.costPrice') && amount==0">{{ `￥ ${amount.toFixed(2)}`
              }}</span>
            <span class="content" v-else>*****</span>
          </div>
        </qf-form-item>
      </qf-col>
    </qf-row>
    <qf-row justify="flex-end">
      <qf-col :span="8">
        <qf-form-item label="其中">
          <div class="summary-charge">
            <span class="label">盘盈总额</span>
            <span class="content red"
                  v-if="hasPermissions('price.costPrice') &&profitAmount>0">{{ `￥ ${profitAmount.toFixed(2)}`
              }}</span>
            <span class="content"
                  v-else-if="hasPermissions('price.costPrice')&&profitAmount==0">{{ `￥ ${profitAmount.toFixed(2)}`
              }}</span>
            <span class="content green" v-else>*****</span>
          </div>
        </qf-form-item>
      </qf-col>
    </qf-row>
    <qf-row justify="flex-end">
      <qf-col :span="8">
        <qf-form-item label="">
          <div class="summary-charge">
            <span class="label">盘亏总额</span>
            <span class="content green"
                  v-if="hasPermissions('price.costPrice') &&lossAmount>0">{{ `￥ -${lossAmount.toFixed(2)}`
              }}</span>
            <span class="content"
                  v-else-if="hasPermissions('price.costPrice') &&lossAmount==0">{{ `￥ -${lossAmount.toFixed(2)}`
              }}</span>
            <span class="content red" v-else>*****</span>
          </div>
        </qf-form-item>
      </qf-col>
    </qf-row>
  </section>
</template>

<script lang="ts" src="./InventoryCheckSummary.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-check-summary {

    .qf-row {
      > div {
        max-width: 320px;
      }
    }

    .summary-charge {
      line-height: 36px;
      box-sizing: border-box;

      .label {
        float: left;
        width: 64px;
        font-weight: bold;
      }

      .content {
        float: right;
        font-weight: bold;
        max-width: calc(100% - 64px);
        word-wrap: break-word;
      }

      .green {
        color: $--color-success;
      }

      .red {
        color: $--color-error;
      }

    }

  }
</style>
