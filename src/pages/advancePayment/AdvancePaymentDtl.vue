<template>
  <div class="pay-able-menu-dtl-view">
    <page-body :menu="menu">
      <template slot="actions">
        <advance-payment-detail-button :bill="payment" @getDetail="getDetail"></advance-payment-detail-button>
      </template>
      <bill-body>

        <!--slot title-->
        <template slot="title">
          <qf-row>
            <qf-col>
              <div class="item" style="color: #909399;">单号：{{payment.billNum}}</div>
            </qf-col>
            <qf-col>
              <div class="item bull-name">预付款单
                <qf-tag v-if="payment.status === 'UNAUDITED'" type="warning">未审核</qf-tag>
                <qf-tag v-if="payment.status === 'AUDITED'" type="success">已审核</qf-tag>
                <qf-tag v-if="payment.status === 'ABOLISHED'" type="danger">已作废</qf-tag>
                <qf-tag v-if="payment.deductStatus === 'DEDUCTED' && payment.status !== 'ABOLISHED'" type="success">已抵扣</qf-tag>
                <qf-tag v-if="payment.deductStatus === 'UNDEDUCT' && payment.status !== 'ABOLISHED'" type="warning">未抵扣</qf-tag>
              </div>
            </qf-col>
            <qf-col>
              <div class=" item btn-right">
                <qf-button @click="onBtnOther('pre')">上一单</qf-button>
                <qf-button @click="onBtnOther('next')">下一单</qf-button>
              </div>
            </qf-col>
          </qf-row>
        </template>
        <!--slot header-->
        <template slot="header">
          <qf-row>
            <qf-col :span="8">
              <qf-form-item label="供应商：">
                <div class="item">{{payment.supplier ? payment.supplier.name : ''}}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="经办人：">
                <div class="item">{{payment.manager ? payment.manager.name : ''}}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="业务日期：">
                <div class="item">{{payment.businessDate ? payment.businessDate.toString().substring(0,10) : ''}}</div>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <qf-row class="margin-top-10">
            <qf-col :span="8">
              <qf-form-item label="币种：">
                <span style="line-height: 36px;">{{ payment.currency ? payment.currency : '' }}</span>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="订单号：">
                <span style="line-height: 36px;">{{ payment.externalBillNum ? payment.externalBillNum : '' }}</span>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="合同单号：">
                <span style="line-height: 36px;">{{ payment.contractNum ? payment.contractNum : ''}}</span>
              </qf-form-item>
            </qf-col>
          </qf-row>
        </template>
        <!--slot toolbar -->
        <template slot="toolbar">
          <qf-row>
            <qf-table :data="payment.lines" ref="tableDef">
              <qf-table-column label="科目"  align="left" prop="accountCategory">
                <template slot-scope="props">
                  <span>{{ props.row.accountCategory.code }}&nbsp;&nbsp;&nbsp; {{ props.row.accountCategory.name}}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="预付金额（元）" width="150px" align="center" prop="amount">
                <template slot-scope="props">
                  <span>{{ props.row.amount | fmt }}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="金额大写（选填）" min-width="150px" align="center" prop="amountUpper">
                <template slot-scope="props">
                  <span>{{ props.row.amountUpper }}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="汇率" width="150px" align="center" prop="exchangeRate" v-if="payment.currency === 'USD'">
                <template slot-scope="props">
                  <span>{{ props.row.exchangeRate | PriceBit(4)}}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="预付金额（美元）" width="150px" align="center" prop="foreignAmount" v-if="payment.currency === 'USD'">
                <template slot-scope="props">
                  <span>{{ props.row.foreignAmount | fmt}}</span>
                </template>
              </qf-table-column>
            </qf-table>
          </qf-row>
          <qf-row>
            <qf-col :span="24">
              <qf-form-item style="width: 100%;border: 1px solid #eee;padding-left: 10px;border-top: 0" label="备注：" labelWidth="45">
                <span style="line-height: 36px;">{{ payment.remark }}</span>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <div class="img-bar">
            <qf-row>
              <qf-form-item label="图片附件：">
                <img v-for="(item, index) in payment.images" :key="index" :src="item.url" @click="onToCheck(item.url)" style="width: 104px;height: 104px;margin-left: 10px">
              </qf-form-item>
            </qf-row>
            <qf-row>
              <qf-form-item style="width: 100%" label="制单人：" labelWidth="45">
                <div class="item">{{user.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{payment.created}}</div>
              </qf-form-item>
            </qf-row>
          </div>
        </template>
        <!--slot table-->
        <!--<template slot="table">-->
          <!--<qf-row>-->
            <!--<qf-col :span="12" style="font-weight: bold">合计应付金额：<span class="item amount">{{getShouldPay | fmt}}</span></qf-col>-->
            <!--<qf-col :span="12">-->
            <!--</qf-col>-->
          <!--</qf-row>-->
        <!--</template>-->
        <!--slot summary-->
        <!--slot remark-->
        <!--slot operateLog-->
        <template slot="bottomActions">
          <advance-payment-detail-button :bill="payment" @getDetail="getDetail"></advance-payment-detail-button>
        </template>
      </bill-body>
    </page-body>
  </div>
</template>
<script lang="ts" src='./AdvancePaymentDtl.ts'></script>
<style lang="scss">
  .pay-able-menu-dtl-view {
    .item {
      line-height: 36px;
    }
    .amount{
      color: #33CC66;font-weight: bold
    }
    .bull-name {
      text-align: center;
      font-size: 20px
    }
    .btn-right {
      text-align: right;
    }
    .margin-top-10 {
      margin-top: 10px;
    }
    .img-bar {
      /*height: 180px;*/
      border-bottom: 1px dashed #c0c4cc;
      padding-top: 15px;
    }
    .bill-body .bill-toolbar {
      font-size: 13px;
      padding-left: 0;
      padding-right: 0;
    }
    .qf-img-upload-btn .upload-image {
      width: 104px;
      height: 104px;
      i {
        margin-top: 32px;
        display: inline-block;
      }
      span {
        margin-top: 10px;
        display: inline-block;
      }
    }
    .qf-img-upload-btn #upload {
      width: 104px;
      height: 104px;
    }
    .qf-table{
      border: 1px solid #eee;
      border-bottom: 1px solid rgb(238, 238, 238);
    }
  }
</style>
