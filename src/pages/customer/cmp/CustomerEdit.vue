<template>
  <qf-dialog-def class="customer-edit" :title="title"
                 @cancel="doCancel" @confirm="doConfirm" confirm-text="保存">
    <div class="content">
      <h3>基本信息</h3>
      <qf-form-item label="客户编号" :required="true">
        <qf-input v-model="customer.code" :maxlength="limits.code" v-form:code="validator"
        ></qf-input>
      </qf-form-item>
      <qf-row  class="marTop12">
        <qf-col :span="12">
        <qf-form-item label="客户名称" :required="true">
          <qf-input v-model="customer.name" v-form:name="validator"
                    :maxlength="limits.name" :disabled="isJoin"></qf-input>
        </qf-form-item>
        </qf-col>
        <qf-col :span="12" class="padding-left-15">
          <qf-form-item label="助记码">
            <qf-input v-model="customer.smartCodes"
                      :maxlength="limits.name"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row class="marTop12">
        <qf-col :span="12">
          <qf-form-item label="期初应收欠款">
            <qf-input class="receivable" v-model="customer.receivable" type="number"
                      :maxlength="limits.amount" v-form:receivable="validator" scale="2"
                      @change="changeAmount"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="12" class="padding-left-15">
          <qf-form-item label="客户类型" style="font-size: 15px;">
            <span class="category">{{customer.category | customerCategory}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <h3>联系信息</h3>
      <qf-form-item label="地址">
        <qf-input v-model="customer.contactInfo.address"
                  :maxlength="limits.address" :disabled="isJoin"></qf-input>
      </qf-form-item>
      <qf-row class="marTop12">
        <qf-col :span="12">
          <qf-form-item label="联系人">
            <qf-input v-model="customer.contactInfo.contact"
                      :maxlength="limits.contact" :disabled="isJoin"></qf-input>
          </qf-form-item>
          <qf-form-item label="传真">
            <qf-input v-model="customer.contactInfo.fax"
                      :maxlength="limits.fax" v-form:fax="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="邮编">
            <qf-input v-model="customer.contactInfo.postcode"
                      :maxlength="limits.postcode" v-form:postCode="validator" :disabled="isJoin"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="12" class="padding-left-15">
          <qf-form-item label="联系电话">
            <qf-input v-model="customer.contactInfo.mobile"
                      :maxlength="limits.mobile" v-form:mobile="validator" :disabled="isJoin"></qf-input>
          </qf-form-item>
          <qf-form-item label="邮箱">
            <qf-input v-model="customer.contactInfo.email"
                      :maxlength="limits.email" v-form:email="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="QQ">
            <qf-input v-model="customer.contactInfo.qq"
                      :maxlength="limits.qq" v-form:qq="validator"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </div>
    <qf-button slot="footer-left" class="save-and-create" size="large" @click="saveAndCreate" type="primary"
               v-if="!isEdit&&hasPermissions('basicdata.customer.create')">
      保存并新增
    </qf-button>
  </qf-dialog-def>
</template>

<script lang="ts" src="./CustomerEdit.ts"/>

<style lang="scss">
  @import '~styles/base.scss';

  .customer-edit {
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

    .category {
      font-size: 13px;
      line-height: 36px;
    }
  }
</style>
