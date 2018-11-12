<template>
  <qf-dialog-def class="logisticscompany-edit" :title="title"
                 @cancel="doCancel" @confirm="doConfirm" confirm-text="保存">
    <div class="content">
      <h3>基本信息</h3>
      <qf-form-item label="物流公司名称" :required="true">
        <qf-input v-model="logisticscompany.name" v-form:name="validator"
                  :maxlength="limits.name"></qf-input>
      </qf-form-item>
      <h3>联系信息</h3>
      <qf-form-item label="地址">
        <qf-input v-model="logisticscompany.contactInfo.address"
                  :maxlength="limits.address"></qf-input>
      </qf-form-item>
      <qf-row class="marTop12">
        <qf-col :span="12">
          <qf-form-item label="联系人">
            <qf-input v-model="logisticscompany.contactInfo.contact"
                      :maxlength="limits.contact"></qf-input>
          </qf-form-item>
          <qf-form-item label="传真">
            <qf-input v-model="logisticscompany.contactInfo.fax"
                      :maxlength="limits.fax" v-form:fax="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="邮编">
            <qf-input v-model="logisticscompany.contactInfo.postcode"
                      :maxlength="limits.postcode" v-form:postCode="validator"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="12" class="padding-left-15">
          <qf-form-item label="联系电话">
            <qf-input v-model="logisticscompany.contactInfo.mobile"
                      :maxlength="limits.mobile" v-form:mobile="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="邮箱">
            <qf-input v-model="logisticscompany.contactInfo.email"
                      :maxlength="limits.email" v-form:email="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="QQ">
            <qf-input v-model="logisticscompany.contactInfo.qq" v-form:qq="validator"
                      :maxlength="limits.qq"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </div>
    <qf-button slot="footer-left" class="save-and-create" size="large" @click="saveAndCreate" type="default"
               v-if="!isEdit">
      保存并新增
    </qf-button>
  </qf-dialog-def>
</template>

<script lang="ts" src="./LogisticsEdit.ts"/>

<style lang="scss">
  @import '~styles/base.scss';

  .logisticscompany-edit {
    .content {
      padding: 20px 0;
      min-width: 500px;
      min-height: 200px;
      .marTop12 {
        margin-top: 12px;
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
