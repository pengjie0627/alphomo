<template>
  <div class="payable-summary">
    <div class="summary-name" v-if="customerName"><i class="iconfont qf-icon ic-ic_gerenziliao"></i>{{customerName}}
    </div>
    <div class="box-container">
      <div class="box borderRight">
        <span class="grey">应收欠款</span><br/>
        <span class="fail">￥{{obj.amount | fmtThumb}}</span>
      </div>
      <div class="box">
        <span class="grey">期初应收</span><br/>
        <span>￥{{obj.beginingAmount | fmtThumb}}</span>
      </div>
      <div class="box">
        <span class="grey">新增应收</span><br/>
        <span>+￥{{obj.inAmount | fmtThumb}}</span>
      </div>
      <div class="box">
        <span class="grey">已优惠</span><br/>
        <span>-￥{{obj.discountAmount | fmtThumb}}</span>
      </div>
      <div class="box">
        <span class="grey">已收款</span><br/>
        <span>-￥{{obj.receivedAmount | fmtThumb}}</span>
      </div>
    </div>

  </div>

</template>

<script src="./ReceivableSummary.ts" lang="ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .payable-summary {
    font-weight: bold;
    line-height: 32px;
    font-size: 16px;
    .summary-name {
      i {
        margin-right: 5px;
        color: $--color-font;
      }
    }
    .box-container {
      display: flex;
      height: 60px;
      overflow: hidden;
      .borderRight {
        border-right: 1px solid $--color-font-light-2;
      }
      .box {
        flex: 1;
        padding-left: 25px;
        .grey {
          color: $--color-font-light-2;

        }
        .fail {
          color: $--color-minor;
        }
      }
    }
  }

</style>
