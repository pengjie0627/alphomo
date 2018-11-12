<template>
  <qf-dialog-def class="edit" title="编辑期初库存"
                 @cancel="doCancel" @confirm="doConfirm">
    <div class="editTable">
      <qf-form-item label="期初库存">
        <qf-input v-model="beginingInventory.beginingQty" @change="onRowChange('qty')"
                  v-form:qty="validator" :maxlength="limits.inventory"></qf-input>
      </qf-form-item>
      <qf-form-item label="成本价(去税)">
        <qf-input v-model="beginingInventory.taxExcBeginingCostPrice" v-form:price="validator"
                  :maxlength="limits.amount" @change="onRowChange('taxExcPrice')"
                  scale="6"></qf-input>
      </qf-form-item>
      <qf-form-item label="成本价(含税)">
        <qf-input v-model="beginingInventory.beginingCostPrice" v-form:price="validator"
                  :maxlength="limits.amount" @change="onRowChange('price')" scale="6"></qf-input>
      </qf-form-item>
      <qf-form-item label="成本金额(去税)">
        <qf-input class="receivable" v-model="beginingInventory.taxExcBeginingAmount"
                  :maxlength="limits.sumAmount" v-form:amount="validator" scale="2"
                  @change="onRowChange('taxExcAmount')"></qf-input>
      </qf-form-item>
      <qf-form-item label="成本金额(含税)">
        <qf-input class="receivable" v-model="beginingInventory.beginingAmount"
                  :maxlength="limits.sumAmount" v-form:amount="validator" scale="2"
                  @change="onRowChange('amount')"></qf-input>
      </qf-form-item>
    </div>
  </qf-dialog-def>
</template>

<script lang="ts" src="./Edit.ts"></script>

<style lang="scss">
  .edit {
    min-width: 600px;
    min-height: 300px;
    .editTable {
      padding: 20px;
    }
    .qf-dialog-body {
      overflow: visible;
    }
  }
</style>
