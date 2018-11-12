<template>
  <div class="charge-dtl-view">
    <page-body :menu="menu">
      <template slot="actions">
        <charge-detail-button :bill="bill" @getDetail="getDetail"></charge-detail-button>
      </template>
      <bill-body>
        <!--slot title-->
        <template slot="title">
          <qf-row>
            <qf-col>
              <div class="item" style="color: #909399;">单号：{{ bill.billNum }}</div>
            </qf-col>
            <qf-col>
              <div class="item bull-name">费用单
                <!--<qf-pill v-if="bill.status === 'UNAUDITED'" type="warning">未审核</qf-pill>-->
                <!--<qf-pill v-if="bill.status === 'AUDITED'" type="success">已审核</qf-pill>-->
                <!--<qf-pill v-if="bill.status === 'ABOLISHED'" type="danger">已作废</qf-pill>-->
                <!--<qf-pill v-if="bill.payStatus === 'PAID'" type="success">已付款</qf-pill>-->
                <!--<qf-pill v-if="bill.payStatus === 'UNPAID'" type="warning">未付款</qf-pill>-->
                <qf-tag type="warning" style="color: #FFCC66" class="ml15" v-if="bill.status=='UNAUDITED'">{{bill.status | status}}</qf-tag>
                <qf-tag type="info" style="color: #33CC66" class="ml15" v-if="bill.status=='AUDITED'">{{bill.status | status}}</qf-tag>
                <qf-tag type="success" class="ml15" v-if="bill.status=='PART_DELIVERED'">{{bill.status | status}}</qf-tag>
                <qf-tag type="success" class="ml15" v-if="bill.status=='DELIVERED'">{{bill.status | status}}</qf-tag>
                <qf-tag type="err" style="color: #FE514D" class="ml15" v-if="bill.status=='ABOLISHED'">{{bill.status | status}}</qf-tag>
                <qf-tag type="success" class="ml15" v-if="bill.payStatus == 'PAID' && bill.status !=='ABOLISHED'">{{bill.payStatus | payStatus}}</qf-tag>
                <qf-tag type="warning" class="ml15" v-if="bill.payStatus == 'UNPAID' && bill.status !=='ABOLISHED'">{{bill.payStatus | payStatus}}</qf-tag>
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
                <div class="item">{{ supplierName }}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="经办人：">
                <div class="item">{{ manangerName }}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="业务日期：">
                <div class="item">{{ bill.businessDate ? bill.businessDate.toString().substring(0,10) : '' }}</div>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <qf-row class="margin-top-10">
            <qf-col :span="8">
              <qf-form-item label="付款类型：">
                <div style="line-height: 36px;">{{ categoryFormatter(bill.category) }}</div>
              </qf-form-item>
            </qf-col>
          </qf-row>
        </template>
        <!--slot toolbar -->
        <template slot="toolbar">
        </template>
        <!--slot table-->
        <template slot="table">
          <qf-row>
            <qf-col :span="12">费用合计：<span class="item" style="color: #f93e61;font-weight: bold"> {{ bill.amount | fmt  }}</span></qf-col>
          </qf-row>
          <qf-row class="margin-top-10">
              <qf-table
                ref="tableDef"
                :data="bill.lines">
                <qf-table-column label="科目" prop="accountCategory">
                  <template slot-scope="props">
                    <span>{{ props.row.accountCategory.code }}  {{ props.row.accountCategory.name }}</span>
                  </template>
                </qf-table-column>
                <qf-table-column label="费用金额（元）" width="180px" prop="amount" align="center" :formatter="priceFormatter">
                </qf-table-column>
                <qf-table-column label="金额大写（选填）" prop="amountUpper" align="center" :formatter="amountUpperFormatter"></qf-table-column>
              </qf-table>
          </qf-row>
          <qf-row>
            <qf-col>
              <qf-form-item style="width: 100%;border: 1px solid #eee;padding-left: 10px;border-top: 0" label="备注：" labelWidth="45">
                <span style="line-height: 36px;">{{ bill.remark }}</span>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <div class="img-bar">
            <qf-row>
              <qf-form-item label="图片附件：">
                <img v-for="(item, index) in bill.images" :key="index" :src="item.url" style="width: 104px;height: 104px;margin-left: 10px"  @click="onToCheck(item.url)">
              </qf-form-item>
            </qf-row>
            <qf-row>
              <qf-form-item style="width: 100%" label="制单人：" labelWidth="45">
                <div class="item">{{user.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{makeBillDate}}</div>
              </qf-form-item>
            </qf-row>
          </div>
        </template>
        <!--slot summary-->
        <!--slot remark-->
        <!--slot operateLog-->
        <!--slot bottomActions-->
        <template slot="bottomActions">
          <charge-detail-button :bill="bill" @getDetail="getDetail"></charge-detail-button>
        </template>
      </bill-body>
    </page-body>
  </div>
</template>
<script lang="ts" src='./ChargeDetail.ts'></script>
<style lang="scss">
  .charge-dtl-view {
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
    .margin-top-20 {
      margin-top: 20px;
    }
    .ml15 {
      margin-left: 15px;
    }
    .img-bar {
      height: 180px;
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
