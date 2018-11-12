<template>
  <div class="charge-add-view">
    <page-body :menu="menu">
      <template slot="actions">
        <qf-button  v-if="hasPermissions('finance.charge.create')" :type="presentation === 'edit' ? 'primary' : 'primary'" @click="onSave">保存</qf-button>
        <qf-button v-if="hasPermissions('finance.charge.create') && hasPermissions('finance.charge.audit')" @click="onSaveAndAudit">保存并审核</qf-button>
        <qf-button @click="onCancel">取消</qf-button>
      </template>
      <bill-body>
        <!--slot title-->
        <template slot="title">
          <qf-row>
            <qf-col>
              <div class="item" style="color: #909399;">单号： {{ bill.billNum ? bill.billNum : '' }}</div>
            </qf-col>
            <qf-col>
              <div class="item bull-name">费用单
                <qf-tag type="warning" class="ml15" v-if="bill.status=='UNAUDITED' && type !== 'add'">{{bill.status | status}}</qf-tag>
                <qf-tag type="info" class="ml15" v-if="bill.status=='AUDITED' && type !== 'add'">{{bill.status | status}}</qf-tag>
                <qf-tag type="success" class="ml15" v-if="bill.status=='PART_DELIVERED' && type !== 'add'">{{bill.status | status}}</qf-tag>
                <qf-tag type="success" class="ml15" v-if="bill.status=='DELIVERED' && type !== 'add'">{{bill.status | status}}</qf-tag>
                <qf-tag type="err" class="ml15" v-if="bill.status=='ABOLISHED' && type !== 'add'">{{bill.status | status}}</qf-tag>
                <qf-tag type="success" class="ml15" v-if="bill.payStatus == 'PAID' && bill.status !=='ABOLISHED' && type !== 'add'">{{bill.payStatus | payStatus}}</qf-tag>
                <qf-tag type="warning" class="ml15" v-if="bill.payStatus == 'UNPAID' && bill.status !=='ABOLISHED' && type !== 'add'">{{bill.payStatus | payStatus}}</qf-tag>
              </div>
            </qf-col>
            <qf-col>
            </qf-col>
          </qf-row>
        </template>
        <!--slot header-->
        <template slot="header">
          <qf-row>
            <qf-col :span="8">
              <qf-form-item label="供应商" required  labelWidth="80px">
                <!--<qf-select v-model="bill.supplier.id" v-form:supplier="validator">-->
                  <!--<qf-option v-for="item in supplierList" :key="item.code" :label="item.name"-->
                             <!--:value="item.id"></qf-option>-->
                <!--</qf-select>-->
                <search display-field="name" :value="bill.supplier" type="supplier"
                        @select="setSupplier($event)" placeholder="请输入名称/助记码/编码查询"
                        @clear="onSupplierClear" v-form:supplier0="validator">
                </search>
              </qf-form-item>
              <!--<qf-form-item label="供应商：" v-if="type !== 'add'">-->
                <!--<div>{{ bill.supplier.code }}</div>-->
              <!--</qf-form-item>-->
            </qf-col>
            <qf-col :span="8" class="margin-top-20">
              <qf-form-item label="经办人" required v-if="type === 'add'"  labelWidth="80px">
                <!--<qf-select v-model="bill.manager.id" v-form:manager="validator">-->
                  <!--<qf-option v-for="item in managerList" :key="item.code" :label="item.name"-->
                             <!--:value="item.id"></qf-option>-->
                <!--</qf-select>-->
                <search display-field="name" :value="bill.manager" type="user"
                        @select="setManager($event)" placeholder="请输入名称或编码查询"
                        @clear="onManagerClear" v-form:manager="validator">
                </search>
              </qf-form-item>
              <qf-form-item label="经办人" v-if="type !== 'add'"  labelWidth="80px">
                <!--<qf-select v-model="bill.manager.id">-->
                  <!--<qf-option v-for="item in managerList" :key="item.code" :label="item.name"-->
                             <!--:value="item.id"></qf-option>-->
                <!--</qf-select>-->
                <search display-field="name" :value="bill.manager" type="user"
                        @select="setManager($event)" placeholder="请输入名称或编码查询"
                        @clear="onManagerClear" v-form:manager="validator">
                </search>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8" class="margin-top-20">
              <qf-form-item label="业务日期" required v-if="type === 'add'" labelWidth="80px">
                <qf-date-picker
                  v-model="bill.businessDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  v-form:businessDate="validator"
                  :readonly="presentation === 'add'" :disabled=true>
                </qf-date-picker>
              </qf-form-item>
              <qf-form-item label="业务日期" v-if="type !== 'add'" labelWidth="80px">
                <qf-date-picker
                  v-model="bill.businessDate"
                  value-format="yyyy-MM-dd"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  v-form:businessDate="validator"
                  :readonly="presentation === 'add'" :disabled=true>
                </qf-date-picker>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <qf-row class="margin-top-10">
            <qf-col :span="8">
              <qf-form-item label="付款类型" required labelWidth="80px">
                <qf-select v-model="bill.category" v-form:payStatus="validator">
                  <!--<qf-option value="" label="请选择">请选择</qf-option>-->
                  <qf-option value="CASH" label="现金交款">现金交款</qf-option>
                  <qf-option value="DEDUCTION" label="账款抵扣">账款抵扣</qf-option>
                </qf-select>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8" class="margin-top-20"></qf-col>
            <qf-col :span="8" class="margin-top-20"></qf-col>
          </qf-row>
        </template>
        <!--slot toolbar -->
        <template slot="toolbar">
          <qf-row>
            <!--<qf-col :span="12">-->
              <!--<div class="btn-right">-->
                <!--<qf-button type="primary" @click="onSelectPayBill()">选择付款单据</qf-button>-->
              <!--</div>-->
            <!--</qf-col>-->
          </qf-row>
          <qf-row class="margin-top-10">
            <qf-col :span="24">
              <charge-add-table :lines="bill.lines" :bill="bill" ref="chargeTable" :tableValidator="validator"></charge-add-table>
            </qf-col>
          </qf-row>
          <qf-row>
              <qf-form-item style="width: 100%;border: 1px solid #eee;padding-left: 10px" label="备注：" labelWidth="45">
                <qf-input placeholder="请输入备注内容"  style="border:none" v-model="bill.remark"  v-form:remark="validator"></qf-input>
              </qf-form-item>
          </qf-row>
          <div class="img-bar">
            <qf-row>
              <qf-form-item label="图片附件：">
                <qf-img-upload
                  upload-type="shop"
                  :total="5"
                  @getImage="getImage"
                  v-model="bill.images">
                </qf-img-upload>
              </qf-form-item>
            </qf-row>
            <qf-row>
              <qf-form-item style="width: 100%" label="制单：" labelWidth="45">
                <div class="item">{{user.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{makeBillDate}}</div>
              </qf-form-item>
            </qf-row>
          </div>
        </template>
        <!--slot table-->
        <!--<template slot="table">-->
          <!--<qf-row>-->
            <!--<qf-col :span="12">合计应付金额：<span class="item" style="color: #33CC66;font-weight: bold">30000.00</span></qf-col>-->
            <!--<qf-col :span="12">-->
              <!--<div class="btn-right">-->
                <!--<qf-button type="primary" @click="onSelectPayBill()">选择付款单据</qf-button>-->
              <!--</div>-->
            <!--</qf-col>-->
          <!--</qf-row>-->
        <!--</template>-->
        <!--slot summary-->
        <!--slot remark-->
        <!--slot operateLog-->
        <!--slot bottomActions-->
        <template slot="bottomActions">
          <qf-button  v-if="hasPermissions('finance.charge.create')" :type="presentation === 'edit' ? 'primary' : 'primary'" @click="onSave">保存</qf-button>
          <qf-button v-if="hasPermissions('finance.charge.create') && hasPermissions('finance.charge.audit')"  @click="onSaveAndAudit">保存并审核</qf-button>
          <qf-button @click="onCancel">取消</qf-button>
        </template>
      </bill-body>
    </page-body>
  </div>
</template>
<script lang="ts" src='./ChargeAdd.ts'></script>
<style lang="scss">
  .charge-add-view {
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
    .margin-top-20 {
      margin-left: 20px;
      height: 36px;
    }
    .margin-top-30 {
      margin-top: 30px;
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
    .qf-table{
      border: 1px solid #eee;
      border-bottom: none;
      .cell{
        overflow: visible;
      }
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
      width: 103px;
      height: 103px;
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

  }
</style>
