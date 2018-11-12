<template>
  <div class="adv-able-menu-add-view">
    <page-body :menu="menu">
      <template slot="actions">
        <qf-button v-if="hasPermissions('finance.advancePayment.create')" type="primary" @click="onBtnSave()">保存</qf-button>
        <qf-button v-if="hasPermissions('finance.advancePayment.create') && hasPermissions('finance.payment.audit')" @click="onBtnSaveAndAudit()">保存并审核</qf-button>
        <qf-button @click="onBtnCancel()">取消</qf-button>
      </template>
      <bill-body>
        <!--slot title-->
        <template slot="title">
          <qf-row>
            <qf-col>
              <div class="item" style="color: #909399;">单号：{{payment.billNum}}</div>
            </qf-col>
            <qf-col>
              <div class="item bull-name">预付款单</div>
            </qf-col>
            <qf-col>
              <!--<div class=" item btn-right">-->
              <!--<qf-button>上一单</qf-button>-->
              <!--<qf-button>下一单</qf-button>-->
              <!--</div>-->
            </qf-col>
          </qf-row>
        </template>
        <!--slot header-->
        <template slot="header">
          <qf-row>
            <qf-col :span="8">
              <qf-form-item label="供应商" required v-if="type === 'add'">
                <search display-field="name" :value="payment.supplier" type="supplier"
                        @select="setSupplier($event)" placeholder="请输入名称/助记码/编码查询"
                        @clear="onSupplierClear" v-form:supplier0="validator">
                </search>
              </qf-form-item>
              <qf-form-item label="供应商" v-if="type !== 'add'">
                <div style="line-height: 36px;">{{payment.supplier ? payment.supplier.name : ''}}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item style="padding-left: 8px" label="经办人" required>
                <!--<qf-select v-model="payment.manager.id" @change="onSelectChange()" v-form:manage="validator">-->
                <!--<qf-option v-for="(item, index) in manageList" :key=index :value="item.id" :label="item.name">{{item.name}}</qf-option>-->
                <!--</qf-select>-->
                <search display-field="name" :value="payment.manager" type="user"
                        @select="setManager($event)" placeholder="请输入名称或编码查询"
                        @clear="onManagerClear" v-form:manage="validator">
                </search>
              </qf-form-item>
              <!--<qf-form-item style="padding-left: 8px" label="经办人" v-if="type !== 'add'" required>-->
              <!--&lt;!&ndash;<qf-input type="text" v-model="payment.manager.name" v-form:manage="validator"></qf-input>&ndash;&gt;-->
              <!--<search display-field="name" :value="payment.manager" type="user"-->
              <!--@select="setManager($event)" placeholder="请输入名称或编码查询"-->
              <!--@clear="onManagerClear" v-form:manage="validator">-->
              <!--</search>-->
              <!--</qf-form-item>-->
            </qf-col>
            <qf-col :span="8">
              <qf-form-item style="padding-left: 8px" label="业务日期" :required="type === 'add'">
                <qf-date-picker
                  v-model="payment.businessDate"
                  v-form:date="validator"
                  :disabled="true"
                  value-format="yyyy-MM-dd"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </qf-date-picker>

              </qf-form-item>
            </qf-col>
          </qf-row>
          <qf-row class="margin-top-10">
            <qf-col :span="8">
              <qf-form-item label="币种" required>
                <qf-select v-model="payment.currency" @change="onCurrencyChange">
                  <!--<qf-option value="" label="全部">全部</qf-option>-->
                  <qf-option value="USD" label="USD">USD</qf-option>
                  <qf-option value="CNY" label="CNY">CNY</qf-option>
                </qf-select>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="订单号" style="padding-left: 8px">
                <qf-input v-model="payment.externalBillNum" @change="onCurrencyChange" :maxlength="38" placeholder="请输入">
                </qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="业务单号" style="padding-left: 8px">
                <qf-input v-model="payment.contractNum" @change="onCurrencyChange" :maxlength="38" placeholder="请输入">
                </qf-input>
              </qf-form-item>
            </qf-col>
          </qf-row>
        </template>
        <!--slot toolbar -->
        <template slot="toolbar">
          <qf-row>
            <qf-table :data="payment.lines" ref="tableDef">
              <qf-table-column label="科目"  align="left" prop="accountCategory" min-width="250px">
                <template slot-scope="props">
                  <search type="account" display-field="name" :value="getRowAccount(props.row.accountCategory)"
                          @select="setRowChargeLine($event, props.row, props.rowIndex)"
                          @clear="onAdvPaymentLineClear($event, props.row, props.rowIndex)" ref="accountCategory"
                          placeholder="编码/名称">
                  </search>
                </template>
              </qf-table-column>
              <qf-table-column label="预付金额（元）" min-width="250px" align="left" prop="amount">
                <template slot-scope="props">
                  <qf-input v-model="props.row.amount" scale="2"  v-form:amount="validator" @change="onRowChange('amount', props.row)"></qf-input>
                </template>
              </qf-table-column>
              <qf-table-column label="金额大写（选填）" min-width="150px" align="left" prop="amountUpper">
                <template slot-scope="props">
                  <qf-input v-model="props.row.amountUpper" align="left" :maxlength="32"></qf-input>
                </template>
              </qf-table-column>
              <!--:render-header="renderHeader"-->
              <qf-table-column label="汇率" width="150px" align="left" prop="exchangeRate" :render-header="renderHeader" v-if="payment.currency === 'USD'">
                <!--v-form:exchangeRate="validator"-->
                <template slot-scope="props">
                  <qf-input v-model="props.row.exchangeRate" scale="4" align="left" @change="onRowChange('exchangeRate', props.row)"></qf-input>
                </template>
              </qf-table-column>
              <qf-table-column label="预付金额（美元）" width="150px" align="left" prop="foreignAmount" v-if="payment.currency === 'USD'">
                <template slot-scope="props">
                  <qf-input v-model="props.row.foreignAmount" scale="2" align="left" v-form:usdAmount="validator" @change="onRowChange('foreignAmount', props.row)"></qf-input>
                </template>
              </qf-table-column>
            </qf-table>
          </qf-row>
          <qf-row>
            <qf-col :span="24">
              <qf-form-item style="width: 100%;border: 1px solid #eee;padding-left: 10px" label="备注：" labelWidth="45">
                <qf-form-item>
                  <qf-input placeholder="请输入备注内容" style="border:none" :maxlength="140" v-model="payment.remark"></qf-input>
                </qf-form-item>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <div class="img-bar">
            <qf-row style="padding-top: 15px;">
              <qf-form-item label="图片附件：">
                <qf-img-upload
                  v-model="payment.images"
                  upload-type="shop"
                  :total="5"
                  @getImage="getImage">
                </qf-img-upload>
              </qf-form-item>
            </qf-row>
            <qf-row>
              <qf-form-item style="width: 100%" label="制单：" labelWidth="45">
                <div class="item">{{user.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{getCurrentDate}}</div>
              </qf-form-item>
            </qf-row>
          </div>
        </template>
        <!--slot table-->
        <!--slot summary-->
        <!--slot remark-->
        <!--slot operateLog-->
        <!--slot bottomActions-->
        <template slot="bottomActions">
          <qf-button v-if="hasPermissions('finance.advancePayment.create')" type="primary" @click="onBtnSave()">保存</qf-button>
          <qf-button v-if="hasPermissions('finance.advancePayment.create') && hasPermissions('finance.payment.audit')" @click="onBtnSaveAndAudit()">保存并审核</qf-button>
          <qf-button @click="onBtnCancel()">取消</qf-button>
        </template>
      </bill-body>
    </page-body>
  </div>
</template>
<script lang="ts" src='./AdvancePaymentAdd.ts'></script>
<style lang="scss">
  .adv-able-menu-add-view {
    .item {
      line-height: 36px;
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
    .margin-top-30 {
      margin-top: 10px;
      border-bottom: 1px dashed #c0c4cc;
      padding-bottom: 15px;
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
    .qf-img-group .qf-img img{
      width: 104px;
      height: 104px;
    }
    .qf-table{
      border: 1px solid #eee;
      border-bottom: none;
      .cell{
        overflow: visible;
      }
    }
    .qf-img-upload .qf-img-upload-title .qf-img-group .qf-img .qf-img-delete{
      top: -6px;
    }
    .sku-search .sku-search-popper.qf-popper[x-placement^=bottom] {
      margin-top: 4px;
      max-width: 480px;
      overflow-x: hidden;
    }
    .sku-search .sku-search-popper.qf-popper[x-placement^=top] {
      max-width: 480px;
      overflow-x: hidden;
    }
    /*.qf-table-body-wrapper {*/
      /*overflow: visible !important;*/
    /*}*/
    /*.qf-table .cell {*/
      /*overflow: visible;*/
    /*}*/
  }
</style>
