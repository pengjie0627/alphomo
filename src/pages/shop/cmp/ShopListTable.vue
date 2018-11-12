<template>
  <!-- 数据列表 -->
  <qf-table class="shop-list-table" :data="data" @sort-change="doSortChange"
            @selection-change="doSelectionChange"
            ref="table" row-key="id">
    <qf-table-column type="selection" align="center"/>
    <qf-table-column type="expand" ref="expand">
      <template slot-scope="props">
        <detail-info :id="props.row.id"></detail-info>
      </template>
    </qf-table-column>
    <qf-table-column label="操作" align="center" width="150px">
      <template slot-scope="props">
        <qf-button type="link" @click="doEdit(props.row.id)" v-if="hasPermissions('retail.retail.create')">编辑</qf-button>
        <qf-button type="link" @click="doDelete(props.row.id,props.row.version,props.row.name)" v-if="hasPermissions('retail.retail.delete')">
          删除
        </qf-button>
        <qf-button type="link" @click="doReset(props.row.id)" v-if="hasPermissions('retail.retail.create')">
          重置密码
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="门店编号" sortable prop="code"></qf-table-column>
    <qf-table-column label="门店名称" prop="name"></qf-table-column>
    <qf-table-column label="联系人" prop="contactInfo.contact"></qf-table-column>
    <qf-table-column label="联系电话" prop="contactInfo.mobile"></qf-table-column>
    <qf-table-column label="启用状态" prop="state" align="center" width="100px" v-if="hasPermissions('retail.retail.enabled')">
      <template slot-scope="props">
      <qf-switch @change="doChange(props.row.id,props.row.version,props.row.state)" :active-value="true" :value="judge(props.row.state)"></qf-switch>
      </template>
    </qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./ShopListTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .shop-list-table {
    .qf-table-expand {
      padding: 0px;
    }

    .qf-switch {
      height: 36px;
    }
  }

</style>
