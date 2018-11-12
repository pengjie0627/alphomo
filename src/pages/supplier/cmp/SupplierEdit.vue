<template>
  <qf-dialog-def class="supplier-edit" :title="title"
                 @cancel="doCancel" @confirm="doConfirm" confirm-text="保存">
    <div class="content">
      <h3>基本信息</h3>
      <qf-form-item label="供应商编号" :required="true">
        <qf-input v-model="supplier.code" :maxlength="limits.code" v-form:code="validator"
                  :selectOnfocus="true"
        ></qf-input>
      </qf-form-item>
      <qf-form-item label="供应商名称" :required="true">
        <qf-input v-model="supplier.name" v-form:name="validator"
                  :maxlength="limits.name"></qf-input>
      </qf-form-item>
      <qf-row class="marTop12">
        <qf-col :span="12">
          <qf-form-item label="期初应付欠款">
            <qf-input class="receivable" v-model="supplier.payable" type="number"
                      :maxlength="limits.amount" v-form:receivable="validator" scale="2"
                      @change="changeAmount"></qf-input>
          </qf-form-item>
          <qf-form-item label="发票抬头">
            <qf-input v-model="supplier.invoiceTitle"
                      :maxlength="limits.invoiceTitle"></qf-input>
          </qf-form-item>
          <qf-form-item label="银行账户">
            <qf-input v-model="supplier.bankAccount" v-form:bankAccount="validator"
                      :maxlength="limits.bankAccount"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="12" class="padding-left-15">
          <qf-form-item label="助记码">
            <qf-input v-model="supplier.smartCodes"
                      :maxlength="limits.name"></qf-input>
          </qf-form-item>
          <qf-form-item label="纳税人识别号">
            <qf-input v-model="supplier.registrationNo" v-form:registrationNo="validator"
                      :maxlength="limits.registrationNo"></qf-input>
          </qf-form-item>
          <qf-form-item label="银行名称">
            <qf-input v-model="supplier.bankName"
                      :maxlength="limits.bankName"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <h3>联系信息</h3>
      <qf-form-item label="地址">
        <qf-input v-model="supplier.contactInfo.address"
                  :maxlength="limits.address"></qf-input>
      </qf-form-item>
      <qf-row class="marTop12">
        <qf-col :span="12">
          <qf-form-item label="联系人">
            <qf-input v-model="supplier.contactInfo.contact"
                      :maxlength="limits.contact"></qf-input>
          </qf-form-item>
          <qf-form-item label="单位电话">
            <qf-input v-model="supplier.contactInfo.workPhone"
                      :maxlength="limits.mobile" v-form:mobile="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="传真">
            <qf-input v-model="supplier.contactInfo.fax"
                      :maxlength="limits.fax" v-form:fax="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="邮编">
            <qf-input v-model="supplier.contactInfo.postcode"
                      :maxlength="limits.postcode" v-form:postCode="validator"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="12" class="padding-left-15">
          <qf-form-item label="联系电话">
            <qf-input v-model="supplier.contactInfo.mobile"
                      :maxlength="limits.mobile" v-form:mobile="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="QQ">
            <qf-input v-model="supplier.contactInfo.qq"
                      :maxlength="limits.qq" v-form:qq="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="邮箱">
            <qf-input v-model="supplier.contactInfo.email"
                      :maxlength="limits.email" v-form:email="validator"></qf-input>
          </qf-form-item>

        </qf-col>
      </qf-row>
    </div>
    <qf-button slot="footer-left" class="save-and-create" size="large" @click="saveAndCreate"
               type="default"
               v-if="!isEdit">
      保存并新增
    </qf-button>
  </qf-dialog-def>
</template>

<script lang="ts" src="./SupplierEdit.ts"/>

<style lang="scss">
  @import '~styles/base.scss';

  .supplier-edit {
    .content {
      padding: 20px 0;
      min-width: 500px;
      min-height: 200px;
      .marTop12 {
        margin-top: 12px;
      }
      .receivable {
        text-align: right
      }
      .padding-left-15 {
        padding-left: 15px;
      }
    }
    .qf-dialog-body {
      overflow: visible;
    }
    .qf-dialog-footer-left {
      text-align: right;
      padding-right: 15px;
    }
  }
</style>
