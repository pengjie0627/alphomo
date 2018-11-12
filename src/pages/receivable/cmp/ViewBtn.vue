<template>
  <div class="detail-button">
    <qf-button type="default" @click="onAbolish"
               v-if="hasPermissions('finance.receivable.abolish')&&receipt.status=='UNAUDITED'">作废
    </qf-button>
    <qf-button type="default" @click="onEdit" v-if="hasPermissions('finance.receivable.create')&&receipt.status!=='ABOLISHED'">
      编辑
    </qf-button>
    <qf-button type="primary" @click="onAudit" v-if="hasPermissions('finance.receivable.audit')&&receipt.status=='UNAUDITED'">审核
    </qf-button>
    <print-view :id="id" type="receipt" btnType="default"
                v-if="hasPermissions('finance.receivable.print') && receipt.status!=='ABOLISHED'"></print-view>
    <print-pre-view :id="id" type="receipt" btnType="default"
                    v-if="hasPermissions('finance.receivable.print') && receipt.status!=='ABOLISHED'"></print-pre-view>
    <print-maintenance-view type="receipt" btnType="default"
                            v-if="hasPermissions('系统管理.系统.系统设置') && receipt.status!=='ABOLISHED'"></print-maintenance-view>
  </div>

</template>
<script lang="ts" src="./ViewBtn.ts"/>

<style lang="scss">
  .detail-button {
    float: right
  }
</style>
