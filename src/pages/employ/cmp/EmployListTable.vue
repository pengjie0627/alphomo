<template>
  <div class="employ-list-table-view">
    <qf-table ref="tableDef"
              @selection-change="selectionChange"
              @sort-change="sortChange"
              :data="employList">
      <!--<qf-table-column type="selection" align="center"/>-->
      <qf-table-column label="操作" align="center" width="135px">
        <template slot-scope="props">
          <!--<qf-button type="link" @click="onCheck(props.row)">查看</qf-button>-->
          <qf-button type="link" @click="onEdit(props.row)">编辑</qf-button>
          <qf-button type="link" @click="onDel(props.row)">删除</qf-button>
          <!--<qf-dropdown trigger="click" class="dropdown">-->
            <!--<template>-->
              <!--<span slot="text">更多 <qf-font-icon name="ic-ic_xiangxia"></qf-font-icon></span>-->
              <!--<qf-dropdown-menu  @click="onEdit(props.row)">编辑</qf-dropdown-menu>-->
              <!--<qf-dropdown-menu  @click="onDel(props.row)">删除</qf-dropdown-menu>-->
            <!--</template>-->
          <!--</qf-dropdown>-->
        </template>
      </qf-table-column>
      <qf-table-column label="姓名" prop="name" width="250px" align="center" sortable>
        <template slot-scope="props">
          <qf-button class="textOverflow" type="link" @click="onCheck(props.row)">{{props.row.name}}</qf-button>
        </template>
      </qf-table-column>
      <qf-table-column label="手机号" prop="mobile" sortable></qf-table-column>
      <qf-table-column label="角色" prop="roles" :formatter="roleFormatter"></qf-table-column>
      <qf-table-column label="状态" prop="status" align="center">
        <template slot-scope="props">
          <qf-pill type="success" v-if="props.row.status === 0">正常</qf-pill>
          <qf-pill type="warning" v-if="props.row.status === 1">锁定</qf-pill>
          <qf-pill type="danger" v-if="props.row.status === 2">删除</qf-pill>
        </template>
      </qf-table-column>
    </qf-table>
  </div>
</template>
<script lang="ts" src='./EmployListTable.ts'></script>
<style lang="scss">
  .employ-list-table-view {
    .textOverflow{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
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
