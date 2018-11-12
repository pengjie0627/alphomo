<template>
  <div class="account-bill-add-view">
    <page-body :menu="menu">
      <template slot="actions">
        <qf-button type="primary" @click="onSave()" v-if="hasPermissions('finance.supplierStatement.create')">保存</qf-button>
        <qf-button @click="onAudit()" v-if="hasPermissions('finance.supplierStatement.create') && hasPermissions('finance.supplierStatement.audit')">保存并审核</qf-button>
        <qf-button @click="onCancel()">取消</qf-button>
      </template>
      <bill-body>
        <!--slot title-->
        <template slot="title">
          <qf-row>
            <qf-col>
              <div class="item" style="color: #909399">单号：{{preNumber}}</div>
            </qf-col>
            <qf-col>
              <div class="item bull-name">结算单</div>
            </qf-col>
            <qf-col>
            </qf-col>
          </qf-row>
        </template>
        <!--slot header-->
        <template slot="header">
          <qf-row>
            <qf-col :span="8">
              <qf-form-item label="供应商" required v-if="type === 'add'">
                <!--<qf-select v-model="selectProvider" v-form:supplyName="validator">-->
                  <!--<qf-option v-for="(item,index) in providerList" :key="index" :value="item.id" :label="item.name">{{item.name}}</qf-option>-->
                <!--</qf-select>-->
                <search display-field="name" :value="selectProvider" type="supplier"
                        @select="setSupplier($event)" placeholder="请输入名称/助记码/编码查询"
                        @clear="onSupplierClear" v-form:supplyName="validator">
                </search>
              </qf-form-item>
              <qf-form-item label="供应商" v-if="type !== 'add'">
                <div style="line-height: 36px">{{editMerchant.supplier ? editMerchant.supplier.name : ''}}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item style="padding-left: 8px" label="经办人" required>
                <!--<qf-select v-model="selectManage" v-form:manage="validator">-->
                  <!--<qf-option v-for="item in manageList" :value="item.id" :label="item.name">{{item.name}}</qf-option>-->
                <!--</qf-select>-->
                <search display-field="name" :value="selectManage" type="user"
                        @select="setManager($event)" placeholder="请输入名称或编码查询"
                        @clear="onManagerClear" v-form:manage="validator">
                </search>
              </qf-form-item>
              <!--<qf-form-item style="padding-left: 8px" label="经办人" v-if="type !== 'add'" required>-->
                <!--&lt;!&ndash;<qf-input v-model="selectManageName" v-form:manage="validator"></qf-input>&ndash;&gt;-->
                <!--<search display-field="name" :value="selectManageName" type="user"-->
                        <!--@select="setManager($event)" placeholder="请输入名称或编码查询"-->
                        <!--@clear="onManagerClear" v-form:manage="validator">-->
                <!--</search>-->
              <!--</qf-form-item>-->
            </qf-col>
            <qf-col :span="8">
              <qf-form-item style="padding-left: 8px" label="业务日期" :required="type==='add'">
                <qf-date-picker
                  v-model="selectDate"
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
        </template>
        <!--slot toolbar -->
        <template slot="toolbar">
          <div>
            <qf-row>
              <qf-table
                ref="tableDef"
                :data="tableData">
                <qf-table-column label="实际结算(元)" prop="amount"  align="left">
                  <template slot-scope="props">
                    <qf-input v-model="props.row.amount" scale="2" @change="onAmountChange()" v-form:tableAmount="validator"></qf-input>
                  </template>
                </qf-table-column>
                <qf-table-column label="已优惠(元)" prop="discountAmount" align="left">
                  <template slot-scope="props">
                    <qf-input v-model="props.row.discountAmount" scale="2" @change="onDiscountChange()" v-form:tableDiscountAmount="validator"></qf-input>
                  </template>
                </qf-table-column>
                <qf-table-column label="结算金额(元)" prop="settleAmount" align="left">
                  <template slot-scope="props">
                    <div>{{props.row.settleAmount | fmt}}</div>
                  </template>
                </qf-table-column>
              </qf-table>
            </qf-row>
            <qf-row>
              <qf-form-item style="width: 100%;border: 1px solid #eee;padding-left: 10px" label="备注：" labelWidth="45">
                <qf-form-item>
                  <qf-input v-model="note" :maxlength="140" style="border:none" placeholder="请输入备注内容"></qf-input>
                </qf-form-item>
              </qf-form-item>
            </qf-row>
          </div>
          <div style="background: rgba(255, 204, 102, 0.266666666666667);">
            <qf-row class="margin-top-10 item pading-left-10">
              <qf-checkbox v-model="isInventoryFlag">已收票</qf-checkbox>
            </qf-row>
            <qf-row class="item pading-left-10 border-top" v-if="isInventoryFlag">
              <qf-col :span="8" class="color">供应商发票抬头: {{inventor.invoiceTitle}}</qf-col>
              <qf-col :span="8" class="color">纳税人识别号: {{inventor.registrationNo}}</qf-col>
              <qf-col :span="8" class="color">银行账户: {{inventor.bankAccount}} [{{inventor.bankName}}]</qf-col>
            </qf-row>
          </div>

        </template>
        <!--slot table-->
        <template slot="table">
          <qf-row class="margin-top-10" v-if="isInventoryFlag">
            <qf-col :span="24">
              <qf-table
                ref="tableDef"
                :data="inventoryTableData">
                <qf-table-column label="序号" align="center" type="index" width="50px"></qf-table-column>
                <qf-table-column label="发票类型" align="left" width="200px" prop="category">
                  <template slot-scope="props">
                    <qf-select v-model="props.row.category">
                      <qf-option value="VAT" label="增值税专用发票">增值税专用发票</qf-option>
                      <qf-option value="PLAIN" label="普通发票">普通发票</qf-option>
                    </qf-select>
                  </template>
                </qf-table-column>
                <qf-table-column label="发票号码" prop="number" width="250px" align="left" >
                  <template slot-scope="props">
                    <qf-input ref="invetory" v-model="props.row.number" :maxlength="12"></qf-input>
                  </template>
                </qf-table-column>
                <qf-table-column label="发票金额" prop="amount" >
                  <template slot-scope="props">
                    <qf-input  v-model="props.row.amount" scale="2" v-form:validatorInventorAmount="validator"></qf-input>
                  </template>
                </qf-table-column>
                <qf-table-column label="发票金额大写(选填)" prop="amountUpper">
                  <template slot-scope="props">
                    <qf-input :maxlength="32" v-model="props.row.amountUpper" @keydown.native.enter="onAddTableRow(props)"></qf-input>
                  </template>
                </qf-table-column>
                <qf-table-column label="" prop="name" width="50px" align="center">
                  <template slot-scope="props">
                    <qf-font-icon @click="onDelInvetoryRow(props)" name="ic-ic_clean" color="#f93e61"></qf-font-icon>
                  </template>
                </qf-table-column>
              </qf-table>
            </qf-col>
          </qf-row>
          <div class="img-bar">
            <qf-row>
              <qf-form-item label="图片附件：">
                <qf-img-upload
                  v-model="imgUploadData"
                  upload-type="shop"
                  :total="5"
                  @getImage="getImage">
                </qf-img-upload>
              </qf-form-item>
            </qf-row>
            <qf-row>
              <qf-form-item style="width: 100%" label="制单：" labelWidth="45">
                <div class="item">{{user.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{makeBillDate}}</div>
              </qf-form-item>
            </qf-row>
          </div>
          <qf-row class="margin-top-10">
            <qf-col :span="12"></qf-col>
            <!--<qf-col :span="12">结算金额／目前结算金额 ：<span class="item" :style="{color: getCurrentAmount === getRealAmount ? 'red' : ''}">{{getCurrentAmount | fmt}}/{{getRealAmount | fmt}}</span></qf-col>-->
            <qf-col :span="12">
              <div class="btn-right">
                <qf-button type="primary" @click="onSelectAccountBill()">结算单据</qf-button>
              </div>
            </qf-col>
          </qf-row>
          <qf-row class="margin-top-10">
            <qf-col :span="24">
              <qf-table
                ref="tableDef"
                :data="billTableData">
                <qf-table-column label="单据单号" align="left" width="120px" prop="billNum">
                </qf-table-column>
                <qf-table-column label="单据类型" prop="businessType" width="120px" align="center" >
                  <template slot-scope="props">
                    <div>{{props.row.billType === 'Purchase' ? '进货单' : (props.row.billType === 'Begining' ? '期初库存' : '进货退单')}}</div>
                  </template>
                </qf-table-column>
                <qf-table-column label="业务日期" width="180px" align="center" prop="billBusinessDate" ></qf-table-column>
                <qf-table-column label="经办人" prop="billManager.name"></qf-table-column>
                <qf-table-column label="应结金额(元)" prop="amount" align="right" :formatter="formatter"></qf-table-column>
                <qf-table-column label="剩余应结(元)" prop="remainAmount" align="right" :formatter="formatter"></qf-table-column>
                <qf-table-column label="本次结算(元)" prop="paidAmount" align="right">
                  <template slot-scope="props">
                    <qf-input :scale="2" v-model="props.row.paidAmount" @change="onPaidAmountChange(props.row)"></qf-input>
                  </template>
                </qf-table-column>
                <qf-table-column label="" prop="name" width="50px" align="center">
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
          <qf-button type="primary" @click="onSave()" v-if="hasPermissions('finance.supplierStatement.create')">保存</qf-button>
          <qf-button @click="onAudit()" v-if="hasPermissions('finance.supplierStatement.create') && hasPermissions('finance.supplierStatement.audit')">保存并审核</qf-button>
          <qf-button @click="onCancel()">取消</qf-button>
        </template>
      </bill-body>
    </page-body>
  </div>
</template>
<script lang="ts" src='./AccountBillAdd.ts'></script>
<style lang="scss">
  .account-bill-add-view {
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
      border-bottom: none;
      .cell{
        overflow: visible;
      }
    }
    .qf-img-group .qf-img img{
      width: 103px;
      height: 103px;
    }
    .qf-img-upload .qf-img-upload-title .qf-img-group .qf-img .qf-img-delete{
      top: -6px;
    }
  }
</style>
