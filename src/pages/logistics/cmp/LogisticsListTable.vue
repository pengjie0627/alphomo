<template>
  <!-- 数据列表 -->
  <qf-table class="customer-list-table" :data="data" @sort-change="doSortChange"
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
        <qf-button type="link" @click="doEdit(props.row.id)" v-if="hasPermissions('basicdata.LogisticsCompany.create')">编辑</qf-button>
        <qf-button type="link" @click="doDelete(props.row.id,props.row.version)" v-if="hasPermissions('basicdata.LogisticsCompany.delete')">
          删除
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="物流公司名称" prop="name"></qf-table-column>
    <qf-table-column label="联系人" prop="contactInfo.contact"></qf-table-column>
    <qf-table-column label="联系电话" prop="contactInfo.mobile"></qf-table-column>
    <qf-table-column label="邮箱" prop="contactInfo.email"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./LogisticsListTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .customer-list-table {
    .qf-table-expand {
      padding: 0px;
    }
  }
</style>
