<template>
  <div class="purchase-rtn-edit-header">
    <qf-row>
      <qf-col class="header-col">
        <qf-form-item required label="供应商" labelWidth="80px">
          <!--<ucn-input placeholder="请选择" v-model="bill.customer" display="name"-->
          <!--:readonly="presentation === 'view'"></ucn-input>-->
          <search display-field="name" :value="bill.supplier" type="supplier" :disabled="isReturnFromPurchase"
                  @select="setSupplier($event)" placeholder="请输入名称/助记码/编码查询"
                  @clear="onSupplierClear" v-form:supplier="validator">
          </search>
        </qf-form-item>
      </qf-col>
      <qf-col class="header-col">
        <qf-form-item required label="仓库" labelWidth="80px">
          <qf-select v-model="bill.warehouse" placeholder="请选择" value-key="id" :readonly="presentation === 'view'"
                     v-form:warehouse="validator" @input="setWarehouse">
            <qf-option
              v-for="item in warehouses"
              :key="item.id"
              :label="item.name"
              :value="item">
            </qf-option>
          </qf-select>
        </qf-form-item>
      </qf-col>
      <qf-col class="header-col">
        <qf-form-item required label="经办人" labelWidth="80px">
          <search display-field="name" :value="bill.manager" type="user"
                  @select="setManager($event)" placeholder="请输入名称或编码查询"
                  @clear="onManagerClear" v-form:manager="validator">
          </search>
        </qf-form-item>
      </qf-col>
      <qf-col class="header-col">
        <qf-form-item required label="业务日期" labelWidth="80px">
          <qf-date-picker v-model="bill.businessDate" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"
                          :readonly="presentation === 'view'" disabled="disabled" v-form:businessDate="validator"></qf-date-picker>
        </qf-form-item>
      </qf-col>
    </qf-row>
  </div>
</template>

<script lang="ts" src="./PurchaseReturnEditHeader.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .purchase-rtn-edit-header {
    .header-col {
      margin-left: 20px;
    }
  }
</style>
