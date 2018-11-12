<template>
  <qf-dialog-def :title="title" @cancel="doCancel" @confirm="onConfirm" class="subject-edit">
    <qf-row>
      <qf-col :span="24">
        <qf-form-item label="所属上级科目" align="right">
          <!--<qf-input type="text" v-form:prentName="validator"></qf-input>-->
          <div style="line-height: 36px; font-size: 14px; text-align: left; margin-left: 12px;">{{ prentSubName }}</div>
        </qf-form-item>
      </qf-col>
    </qf-row>
    <qf-row class="subject-edit-row">
      <qf-col :span="24">
        <qf-form-item label="科目编号" required align="right">
          <qf-input type="text" v-form:code="validator" v-model="accountCategory.code" :maxlength="20" regex="^[^\u4e00-\u9fa5]{0,}$"></qf-input>
        </qf-form-item>
      </qf-col>
    </qf-row>
    <qf-row class="subject-edit-row">
      <qf-col :span="24">
        <qf-form-item label="科目名称" required align="right">
          <qf-input type="text" v-form:name="validator" v-model="accountCategory.name" :maxlength="12"></qf-input>
        </qf-form-item>
      </qf-col>
    </qf-row>
  </qf-dialog-def>
</template>
<script lang="ts" src="./AccountCategoryEdit.ts"/>
<style lang="scss">
  .subject-edit {
    width: 480px;
    .subject-edit-row {
      margin-top: 20px;
    }
    .qf-dialog-body {
      padding: 30px 0;
    }
    .qf-input {
      margin-left: 12px;
    }
  }
</style>
