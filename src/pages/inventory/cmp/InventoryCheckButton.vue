<template>
  <div class="inventory-detail-button">
    <qf-button :type="type?type:'primary'"
               v-if="hasPermissions('inventory.check.audit') && btnStatus[0].show"
               @click="doAudited">
      审核
    </qf-button>
    <qf-button :type="type?type:'default'"
               v-if="hasPermissions('inventory.check.create') && btnStatus[1].show && target==='detail'"
               @click="doEdit">编辑
    </qf-button>
    <qf-button :type="type?type:'default'"
               v-if="hasPermissions('inventory.check.delete') && btnStatus[2].show && target==='detail'"
               @click="doDeleted">删除
    </qf-button>
    <qf-button :type="type?type:'default'"
               v-if="hasPermissions('inventory.check.create') && btnStatus[3].show"
               @click="doCopy">复制
    </qf-button>
    <print-view :id="bill.id" type="inventory_check" btnType="default"
                v-if="hasPermissions('inventory.check.print') && target === 'detail'"></print-view>
    <print-pre-view :id="bill.id" type="inventory_check" btnType="default"
                v-if="hasPermissions('inventory.check.print') && target === 'detail'"></print-pre-view>
    <print-maintenance-view type="inventory_check" btnType="default"
                            v-if="hasPermissions('system.system.setup') && target === 'detail'"></print-maintenance-view>
  </div>

</template>
<script lang="ts" src="./InventoryCheckButton.ts"/>

<style lang="scss">
  .inventory-detail-button {

  }
</style>
