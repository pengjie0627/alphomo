<template>
  <div class="pay-able-menu-dtl-view">
    <page-body :menu="menu">
      <template slot="actions">
        <pay-able-menu-detail-button :bill="payment" @getDetail="getDetail"></pay-able-menu-detail-button>
      </template>
      <bill-body>

        <!--slot title-->
        <template slot="title">
          <qf-row>
            <qf-col>
              <div class="item" style="color: #909399">单号：{{payment.billNum}}</div>
            </qf-col>
            <qf-col>
              <div class="item bull-name">付款单
                <qf-tag v-if="payment.status === 'UNAUDITED'" type="info">未审核</qf-tag>
                <qf-tag v-if="payment.status === 'AUDITED'" type="success">已审核</qf-tag>
                <qf-tag v-if="payment.status === 'ABOLISHED'" type="danger">已作废</qf-tag>
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
                <div style="line-height: 36px;">{{ payment.currency }}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="备注：">
                <div class="item">{{payment.remark}}</div>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <qf-row v-if="payment.currency !== 'USD'">
            <qf-col :span="24">
              <qf-form-item class="sum-bar" label="合计应付金额：" label-width="100px">
                <div class="amount item">{{payment.paidAmount | fmt}}</div>
              </qf-form-item>
            </qf-col>
          </qf-row>
        </template>
        <!--slot toolbar -->
        <template slot="toolbar">
          <div class="img-bar">
            <qf-table v-if="payment.currency === 'USD'"
                      :data="usd">
              <qf-table-column label="本次付款" min-width="150px" align="center" prop="amount">
                <template slot-scope="props">
                  <span>{{ props.row.amount | fmt }}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="合计应付金额（元）" min-width="150px" align="center" prop="totalAmount">
                <template slot-scope="props">
                  <span>{{ props.row.totalAmount | fmt}}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="汇兑损益参考（元）" min-width="150px" align="center" prop="lossesAmount">
                <template slot-scope="props">
                  <span>{{ props.row.lossesAmount | fmt}}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="汇率" min-width="150px" align="center" prop="exchangeRate">
                <template slot-scope="props">
                  <span>{{ props.row.exchangeRate | PriceBit(4)}}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="本次付款（美元）" min-width="150px" align="center" prop="usdAmount">
                <template slot-scope="props">
                  <span>{{ props.row.usdAmount | fmt}}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="预付金额（美元）" min-width="150px" align="center" prop="foreignAdvanceAmount">
                <template slot-scope="props">
                  <span>{{ props.row.foreignAdvanceAmount | fmt }}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="合计已付（美元）" min-width="150px" align="center" prop="foreignTotalAmount">
                <template slot-scope="props">
                  <span>{{ props.row.foreignTotalAmount | fmt }}</span>
                </template>
              </qf-table-column>
            </qf-table>
            <qf-row>
              <qf-form-item label="图片附件：" style="padding-top: 15px;">
                <img v-for="(item, index) in payment.images" @click="onToCheck(item.url)" :key="index" :src="item.url" style="width: 104px;height: 104px;margin-left: 10px">
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
        <template slot="table">
          <qf-row>
            <qf-col :span="12" style="font-weight: bold">合计应付金额：<span class="item amount">{{getShouldPay | fmt}}</span></qf-col>
            <qf-col :span="12">
            </qf-col>
          </qf-row>
          <qf-row class="margin-top-10">
            <qf-col :span="24">
              <qf-table
                ref="tableDef"
                :data="payment.lines">
                <qf-table-column label="业务单据单号" align="center" width="135px" prop="billNum">
                </qf-table-column>
                <qf-table-column label="单据类型" prop="billType" width="250px" align="center" >
                  <template slot-scope="props">
                    {{ getStatusName(props.row.billType) }}
                  </template>
                </qf-table-column>
                <qf-table-column label="业务日期" prop="billBusinessDate" align="center"></qf-table-column>
                <qf-table-column label="经办人" prop="billManager.name"></qf-table-column>
                <qf-table-column label="应付金额(元)" prop="status" align="right">
                  <template slot-scope="props">
                    {{props.row.amount | fmt}}
                  </template>
                </qf-table-column>
                <qf-table-column label="应付金额（美元)" prop="status" v-if="payment.currency === 'USD'" min-width="120px" align="right">
                  <template slot-scope="props">
                    {{props.row.foreignAmount | fmt}}
                  </template>
                </qf-table-column>
              </qf-table>
            </qf-col>
          </qf-row>
        </template>
        <!--slot summary-->
        <!--slot remark-->
        <!--slot operateLog--->
        <template slot="bottomActions">
          <pay-able-menu-detail-button :bill="payment" @getDetail="getDetail"></pay-able-menu-detail-button>
        </template>
      </bill-body>
    </page-body>
  </div>
</template>
<script lang="ts" src='./PayAbleMenuDtl.ts'></script>
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
      /*min-height: 180px;*/
      border-bottom: 1px dashed #c0c4cc;
      padding-top: 15px;
      padding-bottom: 15px;
    }
    .sum-bar {
      margin-top: 15px;
      border-top: 1px dashed #c0c4cc;
      padding-top: 15px;
      font-weight: bold;
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

  }
</style>
