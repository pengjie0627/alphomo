<template>
  <div class="account-bill-dtl-view">
    <page-body :menu="menu">
      <div slot="actions">
        <account-bill-detail-button :bill="accountDtl" @getDetail="getDetail"></account-bill-detail-button>
      </div>
      <bill-body>
        <!--slot title-->
        <template slot="title">
          <qf-row>
            <qf-col>
              <div class="item" style="color: #909399">单号：{{accountDtl.billNum}}</div>
            </qf-col>
            <qf-col>
              <div class="item bull-name">
                结算单
                <qf-tag v-if="accountDtl.status !== 'ABOLISHED' && accountDtl.status === 'UNAUDITED'" type="info">未审核</qf-tag>
                <qf-tag v-if="accountDtl.status !== 'ABOLISHED' && accountDtl.status === 'AUDITED'" type="success">已审核</qf-tag>
                <qf-tag v-if="accountDtl.status !== 'ABOLISHED' && !accountDtl.isInvoice" type="info">未收票</qf-tag>
                <qf-tag v-if="accountDtl.status !== 'ABOLISHED' && accountDtl.isInvoice" type="success">已收票</qf-tag>
                <qf-tag v-if="accountDtl.status !== 'ABOLISHED' && accountDtl.payStatus === 'UNPAID'" type="info">未付款</qf-tag>
                <qf-tag v-if="accountDtl.status !== 'ABOLISHED' && accountDtl.payStatus === 'PAID'" type="success">已付款</qf-tag>
                <qf-tag v-if="accountDtl.status === 'ABOLISHED'" type="err">已作废</qf-tag>
              </div>
            </qf-col>
            <qf-col>
              <div class=" item btn-right">
                <qf-button @click="onOtherBill('pre')">上一单</qf-button>
                <qf-button @click="onOtherBill('next')">下一单</qf-button>
              </div>
            </qf-col>
          </qf-row>
        </template>
        <!--slot header-->
        <template slot="header">
          <qf-row>
            <qf-col :span="8">
              <qf-form-item label="供应商：">
                <div class="item">{{accountDtl.supplier ? accountDtl.supplier.name : ''}}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="经办人：">
                <div class="item">{{accountDtl.manager ? accountDtl.manager.name : ''}}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="业务日期：">
                <div class="item">{{accountDtl.businessDate ? accountDtl.businessDate.substring(0,10) : ''}}</div>
              </qf-form-item>
            </qf-col>
          </qf-row>
        </template>
        <!--slot toolbar -->
        <template slot="toolbar">
          <div>
            <qf-row>
              <qf-table
                ref="tableDef"
                :data="tableData">
                <qf-table-column label="实际结算(元)" prop="amount"  align="right" :formatter="formatter">
                </qf-table-column>
                <qf-table-column label="已优惠(元)" prop="discountAmount" align="right" :formatter="formatter"></qf-table-column>
                <qf-table-column label="结算金额(元)" prop="settleAmount" align="right" :formatter="formatter"></qf-table-column>
                <!--<qf-table-column label="结算后剩余金额(元)" prop="status" align="right" :formatter="formatter"></qf-table-column>-->
              </qf-table>
            </qf-row>
            <qf-row>
              <qf-form-item style="width: 100%;border: 1px solid #eee;padding-left: 10px;border-top: 0" label="备注：" labelWidth="45">
                <qf-form-item>
                  <div class="item">{{accountDtl.remark}}</div>
                </qf-form-item>
              </qf-form-item>
            </qf-row>
          </div>
          <div style="margin-top: 10px;background: rgba(255, 204, 102, 0.266666666666667);height: 38px" v-if="accountDtl.isInvoice">
            <qf-row class="item pading-left-10">
              <qf-col :span="8" class="color">供应商发票抬头: {{inventor.invoiceTitle}}</qf-col>
              <qf-col :span="8" class="color">纳税人识别号: {{inventor.registrationNo}}</qf-col>
              <qf-col :span="8" class="color">银行账户: {{inventor.bankAccount}} [{{inventor.bankName}}]</qf-col>
            </qf-row>
          </div>
          <div style="margin-top: 10px;background: rgba(255, 204, 102, 0.266666666666667);height: 38px" v-if="!accountDtl.isInvoice">
            <div  class="item pading-left-10 color">未收票</div>
          </div>

        </template>
        <!--slot table-->
        <template slot="table">
          <qf-row class="margin-top-10">
            <qf-col :span="24">
              <qf-table
                ref="tableDef"
                :data="inventoryTableData">
                <qf-table-column label="序号" align="center" type="index" width="50px"></qf-table-column>
                <qf-table-column label="发票类型" align="left" width="250px">
                  <template slot-scope="props">
                    <div>{{props.row.category === 'VAT' ? '增值税专用发票' : '普通发票'}}</div>
                  </template>
                </qf-table-column>
                <qf-table-column label="发票号码" prop="number" width="250px" align="center" >
                </qf-table-column>
                <qf-table-column label="发票金额" prop="amount" align="center">
                  <template slot-scope="props">
                    <div>{{props.row.amount | fmt}}</div>
                  </template>
                </qf-table-column>
                <qf-table-column label="发票金额大写(选填)" prop="amountUpper" align="right"></qf-table-column>
              </qf-table>
            </qf-col>
          </qf-row>
          <!---->
          <div class="img-bar">
            <qf-row>
              <qf-form-item label="图片附件：">
                <img v-for="item in accountDtl.images" @click="onToCheck(item.url)" :src="item.url" style="width: 104px;height: 104px;margin-left: 10px">
              </qf-form-item>
            </qf-row>
            <qf-row>
              <qf-form-item style="width: 100%" label="制单人：" labelWidth="45">
                <div class="item">{{user.name}}&nbsp;&nbsp;&nbsp;&nbsp; {{accountDtl.created}}</div>
              </qf-form-item>
            </qf-row>
          </div>
          <qf-row class="margin-top-10">
            <!--<qf-col :span="12">结算金额／目前结算金额 ：<span class="item" style="color: #33CC66;font-weight: bold">30010.00/20000.00</span></qf-col>-->
            <!--<qf-col :span="12">-->
              <!--<div class="btn-right">-->
                <!--<qf-button type="primary">结算单据</qf-button>-->
              <!--</div>-->
            <!--</qf-col>-->
          </qf-row>
          <qf-row class="margin-top-10">
            <qf-col :span="24">
              <qf-table
                ref="tableDef"
                :data="billTableData">
                <qf-table-column label="单据单号" width="180px" prop="billNum" align="left">
                </qf-table-column>
                <qf-table-column label="单据类型" prop="billType" width="100px" align="left" >
                  <template slot-scope="props">
                    {{props.row.billType === 'Purchase' ? '进货单' : (props.row.billType === 'Begining' ? '期初库存' : '进货退单')}}
                  </template>
                </qf-table-column>
                <qf-table-column label="业务日期" align="center" prop="billBusinessDate" width="180px"></qf-table-column>
                <qf-table-column label="经办人" prop="billManager.name"></qf-table-column>
                <qf-table-column label="应结金额(元)" prop="amount" align="right" :formatter="formatter"></qf-table-column>
                <qf-table-column label="剩余应结(元)" prop="remainAmount" align="right" :formatter="formatter"></qf-table-column>
                <qf-table-column label="本次结算(元)" prop="paidAmount" align="right" :formatter="formatter"></qf-table-column>
              </qf-table>
            </qf-col>
          </qf-row>
        </template>
        <!--slot summary-->
        <!--slot remark-->
        <!--slot operateLog-->
        <!--slot bottomActions--->
        <div slot="bottomActions">
          <account-bill-detail-button :bill="accountDtl" @getDetail="getDetail"></account-bill-detail-button>
        </div>
      </bill-body>
    </page-body>
  </div>
</template>
<script lang="ts" src='./AccountBillDtl.ts'></script>
<style lang="scss">
  .account-bill-dtl-view {
    .item {
      line-height: 36px;
    }
    .color{
      color: #ff9900;
    }
    .border-top{
      border-top: 1px solid #FFCC66;
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
    .pading-left-10{
      margin-left: 10px;
      margin-right: 10px;
    }
    .img-bar {
      height: 180px;
      border-bottom: 1px dashed #c0c4cc;
      border-top: 1px dashed #c0c4cc;
      padding-top: 15px;
      margin-top: 20px;
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
