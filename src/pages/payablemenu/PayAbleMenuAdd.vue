<template>
  <div class="pay-able-menu-add-view">
    <page-body :menu="menu">
      <template slot="actions">
        <qf-button v-if="hasPermissions('finance.payment.create')" type="primary" @click="onBtnSave()">保存</qf-button>
        <qf-button v-if="hasPermissions('finance.payment.create') && hasPermissions('finance.payment.audit')" @click="onBtnSaveAndAudit()">保存并审核</qf-button>
        <qf-button @click="onBtnCancel()">取消</qf-button>
      </template>
      <bill-body>
        <!--slot title-->
        <template slot="title">
          <qf-row>
            <qf-col>
              <div class="item" style="color: #909399">单号：{{payment.billNum}}</div>
            </qf-col>
            <qf-col>
              <div class="bull-name">付款单</div>
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
                <!--<qf-select v-model="payment.supplier.id" @change="onSelectChange()" v-form:supplyName="validator">-->
                  <!--<qf-option v-for="(item, index) in providerList" :key=index :value="item.id" :label="item.name">{{item.name}}</qf-option>-->
                <!--</qf-select>-->
                <search display-field="name" :value="payment.supplier" type="supplier"
                        @select="setSupplier($event)" placeholder="请输入名称/助记码/编码查询"
                        @clear="onSupplierClear" v-form:supplyName="validator">
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
              <qf-form-item label="币种" required="">
                <qf-select v-model="payment.currency" @change="onCurrencyChange" placeholder="请选择">
                  <!--<qf-option value="" label="全部">全部</qf-option>-->
                  <qf-option value="USD" label="USD">USD</qf-option>
                  <qf-option value="CNY" label="CNY">CNY</qf-option>
                </qf-select>
              </qf-form-item>
            </qf-col>
            <qf-col :span="16">
              <qf-form-item label="备注" style="padding-left: 8px">
                <qf-input placeholder="请输入备注内容" :maxlength="140" v-model="payment.remark"></qf-input>
              </qf-form-item>
            </qf-col>
          </qf-row>
        </template>
        <!--slot toolbar -->
        <template slot="toolbar">
          <div class="img-bar">
            <qf-table v-if="payment.currency === 'USD'"
            :data="usd">
              <qf-table-column label="本次付款（元）" width="150px" align="center" prop="amount">
                <template slot-scope="props">
                  <qf-input v-model="props.row.amount" scale="2" align="center" @change="onRowChange('amount', props.row)"></qf-input>
                </template>
              </qf-table-column>
              <qf-table-column label="合计应付金额（元）" width="150px" align="center" prop="totalAmount">
                <template slot-scope="props">
                  <span>{{ props.row.totalAmount | fmt}}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="汇兑损益参考（元）" min-width="150px" align="center" prop="lossesAmount">
                <template slot-scope="props">
                  <span>{{ props.row.lossesAmount | fmt}}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="汇率" width="150px" align="center" prop="exchangeRate" :render-header="renderHeader">
                <template slot-scope="props">
                  <qf-input v-model="props.row.exchangeRate" scale="4" align="center" @change="onRowChange('exchangeRate', props.row)"></qf-input>
                </template>
              </qf-table-column>
              <qf-table-column label="本次付款（美元）" width="150px" align="center" prop="usdAmount">
                <template slot-scope="props">
                  <qf-input v-model="props.row.usdAmount" scale="2" align="center"  @change="onRowChange('usdAmount', props.row)"></qf-input>
                </template>
              </qf-table-column>
              <qf-table-column label="预付金额（美元）" width="150px" align="center" prop="foreignAdvanceAmount">
                <template slot-scope="props">
                  <span>{{ props.row.foreignAdvanceAmount | fmt }}</span>
                </template>
              </qf-table-column>
              <qf-table-column label="合计已付（美元）" width="150px" align="center" prop="foreignTotalAmount">
                <template slot-scope="props">
                  <span>{{ props.row.foreignTotalAmount | fmt }}</span>
                </template>
              </qf-table-column>
            </qf-table>
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
                <div style="line-height: 36px;">{{user.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{getCurrentDate}}</div>
              </qf-form-item>
            </qf-row>
          </div>
        </template>
        <!--slot table-->
        <template slot="table">
          <qf-row>
            <qf-col :span="12">合计应付金额：<span class="item" style="color: #33CC66;font-weight: bold">{{getSumPay | fmt}}</span></qf-col>
            <qf-col :span="12">
              <div class="btn-right">
                <qf-button type="primary" @click="onSelectPayBill()">选择付款单据</qf-button>
              </div>
            </qf-col>
          </qf-row>
          <qf-row class="margin-top-10">
            <qf-col :span="24">
              <qf-table
                ref="tableDef"
                :data="payment.lines">
                <qf-table-column label="单据单号" align="center"  prop="billNum">
                </qf-table-column>
                <qf-table-column label="单据类型" prop="billType" align="center">
                  <template slot-scope="props">
                    {{ getStatusName(props.row.billType) }}
                  </template>
                </qf-table-column>
                <qf-table-column label="业务日期" prop="billBusinessDate" align="center">
                  <template slot-scope="props">
                    {{props.row.billBusinessDate ? props.row.billBusinessDate.substring(0,11) : ''}}
                  </template>
                </qf-table-column>
                <qf-table-column label="经办人" prop="billManager.name" align="center"></qf-table-column>
                <qf-table-column label="应付金额(元)" prop="status" align="right">
                  <template slot-scope="props">
                    {{props.row.amount | fmt}}
                  </template>
                </qf-table-column>
                <qf-table-column label="应付金额（美元)" prop="status" v-if="payment.currency === 'USD'" align="right">
                  <template slot-scope="props">
                    {{props.row.foreignAmount | fmt}}
                  </template>
                </qf-table-column>
                <qf-table-column label="" prop="name" align="center">
                  <template slot-scope="props">
                    <qf-font-icon @click="onDelRow(props)" name="ic-ic_clean" color="#f93e61"></qf-font-icon>
                  </template>
                </qf-table-column>
              </qf-table>
            </qf-col>
          </qf-row>
        </template>
        <!--slot summary-->
        <!--slot remark-->
        <!--slot operateLog-->
        <!--slot bottomActions-->
        <template slot="bottomActions">
          <qf-button v-if="hasPermissions('finance.payment.create')" type="primary" @click="onBtnSave()">保存</qf-button>
          <qf-button v-if="hasPermissions('finance.payment.create') && hasPermissions('finance.payment.audit')" @click="onBtnSaveAndAudit()">保存并审核</qf-button>
          <qf-button @click="onBtnCancel()">取消</qf-button>
        </template>
      </bill-body>
    </page-body>
  </div>
</template>
<script lang="ts" src='./PayAbleMenuAdd.ts'></script>
<style lang="scss">
  .pay-able-menu-add-view {
    .item {
      line-height: 36px;
      color: #909399;
    }
    .bull-name {
      line-height: 36px;
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
      min-height: 180px;
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
    .qf-img-upload .qf-img-upload-title .qf-img-group .qf-img .qf-img-delete{
      top: -6px;
    }
  }
</style>
