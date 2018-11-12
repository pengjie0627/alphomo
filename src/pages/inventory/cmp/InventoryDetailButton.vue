<template>
  <div class="inventory-detail-button">
    <qf-button :type="type?type:'primary'"
               v-if="hasPermissions('inventory.allocation.audit') && (btnPerm[0] = true) && btnStatus[0].show" @click="doAudited">
      审核
    </qf-button>
    <qf-button :type="type?type:'default'"
               v-if="hasPermissions('inventory.allocation.create')&& (btnPerm[1] = true) && btnStatus[1].show "
               @click="doEdit">编辑
    </qf-button>
    <qf-button :type="type?type:'default'"
               v-if="hasPermissions('inventory.allocation.delete')&& (btnPerm[2] = true) && btnStatus[2].show "
               @click="doDeleted">删除
    </qf-button>
    <qf-button :type="type?type:'default'"
               v-if="hasPermissions('inventory.allocation.abolish')&& (btnPerm[3] = true) && btnStatus[3].show "
               @click="doRemove">作废
    </qf-button>
    <qf-button :type="type?type:'default'"
               v-if="hasPermissions('inventory.allocation.create')&& (btnPerm[4] = true)&&btnStatus[4].show" @click="doCopy">复制
    </qf-button>
    <print-view :id="bill.id" type="inventory_transfer" btnType="default"
                v-if="hasPermissions('inventory.allocation.print') && target === 'detail'"></print-view>
    <print-pre-view :id="bill.id" type="inventory_transfer" btnType="default"
                v-if="hasPermissions('inventory.allocation.print') && target === 'detail'"></print-pre-view>
    <print-maintenance-view type="inventory_transfer" btnType="default"
                            v-if="hasPermissions('system.system.setup') && target === 'detail'"></print-maintenance-view>

    <qf-dropdown trigger="click" class="dropdown" v-if="btnShow.length > 3 && target === 'list'">
      <template>
        <span slot="text">更多 <qf-font-icon name="ic-ic_xiangxia"></qf-font-icon></span>
        <qf-dropdown-menu v-if="hasPermissions('inventory.allocation.audit')&& btnMore[0].show" @click="onAudit">审核</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('inventory.allocation.create')&& btnMore[1].show" @click="doEdit">编辑</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('inventory.allocation.delete')&& btnMore[2].show" @click="doDeleted">删除</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('inventory.allocation.abolish')&& btnMore[3].show" @click="doRemove">作废</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('inventory.allocation.create')&& btnMore[4].show" @click="doCopy">复制</qf-dropdown-menu>
      </template>
    </qf-dropdown>
  </div>

</template>
<script lang="ts" src="./InventoryDetailButton.ts"/>

<style lang="scss">
  .inventory-detail-button {
    /*float: right;*/
    .dropdown {
      display: inline-block;
      .qf-button {
        padding: 0;
        background: none !important;
        display: inline-block;
        margin-left: 12px;
        border: none;
        color: #007ace;
        &:hover {
          color: red;
        }
      }
    }
  }
</style>
