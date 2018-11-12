<template>
  <qf-dialog-def class="sku-edit" :title="title"
                 @cancel="doCancel" @confirm="doConfirm">
    <div class="content">

      <qf-form-item label="所属一级分类">
        <qf-select v-model="firstCategoryCode" ref="select" searchable
                   display-field="name" @change="getSecondCategory">
          <qf-option value="" label="请选择"></qf-option>
          <qf-option
            v-for="(item,index) in firstList"
            :key="index"
            :label="item.name"
            :value="item.code">
          </qf-option>
        </qf-select>
      </qf-form-item>
      <qf-form-item label="所属二级分类">
        <qf-select v-model="secondCategoryCode" ref="select" searchable
                   display-field="name">
          <qf-option value="" label="请选择"></qf-option>
          <qf-option
            v-for="(item,index) in secondList"
            :key="index"
            :label="item.name"
            :value="item.code">
          </qf-option>
        </qf-select>
      </qf-form-item>
      <qf-form-item label="所属三级分类">
        <qf-select v-model="thirdCategoryCode" ref="select" searchable
                   display-field="name">
          <qf-option value="" label="请选择"></qf-option>
          <qf-option
            v-for="(item,index) in thirdList"
            :key="index"
            :label="item.name"
            :value="item.code">
          </qf-option>
        </qf-select>
      </qf-form-item>
      <qf-form-item label="所属四级分类">
        <qf-select v-model="fourCategoryCode" ref="select" searchable
                   display-field="name">
          <qf-option value="" label="请选择"></qf-option>
          <qf-option
            v-for="(item,index) in fourList"
            :key="index"
            :label="item.name"
            :value="item.code">
          </qf-option>
        </qf-select>
      </qf-form-item>
      <qf-form-item label="分类编码" :required="true">
        <qf-input v-model="skuCategory.code" :maxlength="limits.categoryCode" v-form:code="validator"
        ></qf-input>
      </qf-form-item>
      <qf-form-item label="分类名称" :required="true">
        <qf-input v-model="skuCategory.name" :maxlength="limits.categoryName" v-form:name="validator"
        ></qf-input>
      </qf-form-item>
    </div>
  </qf-dialog-def>
</template>

<script lang="ts" src="./EditCategory.ts"/>

<style lang="scss">
  @import '~styles/base.scss';

  .sku-edit {
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
    }
    .qf-dialog-body {
      overflow: visible;
    }
  }
</style>
