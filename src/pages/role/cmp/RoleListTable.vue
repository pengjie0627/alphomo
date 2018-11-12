<template>
  <div class="employ-list-table-view">
    <qf-table
      :data="roleList"
      ref="tableDef"
      :border="true"
      @sort-change="sortChange"
      @selection-change="selectionChange">
      <!--<qf-table-column type="selection" align="center"/>-->
      <qf-table-column label="操作" align="center" width="150px">
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
      <qf-table-column label="角色名称" prop="name" align="center" sortable>
        <template slot-scope="props">
          <qf-button type="link" @click="onCheck(props.row)">{{props.row.name}}</qf-button>
        </template>
      </qf-table-column>

      <qf-table-column label="备注" prop="remark">
        <template slot-scope="props">
          <div class="test-ellpise" :title="props.row.remark">{{props.row.remark}}</div>
        </template>
      </qf-table-column>
    </qf-table>
  </div>
</template>
<script lang="ts" src='./RoleListTable.ts'></script>
<style lang="scss">
  .employ-list-table-view {
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
    .test-ellpise{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
</style>
