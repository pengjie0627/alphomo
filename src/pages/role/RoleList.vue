<template>
    <div class="role-list-view">
      <page-body class="sale-list" :menu="menu">
        <!-- 面包屑中间部分 插槽位slot="tip" -->
        <!--面包屑右边部分 插槽位slot="actions"-->
        <div slot="actions">
          <qf-button icon="ic_icon-add" type="primary" @click="onAddRole">新建角色</qf-button>
        </div>
        <list-container>
          <!-- 标准搜索栏 插槽位slot="search"-->
          <!-- 表格上面的按钮组 -->
          <div slot="toolbar">
            <!--<qf-button type="primary" @click="onExport">导出全部</qf-button>-->
          </div>
          <role-list-table
            slot="list"
            :roleList="roleList"
            @refreshListBySort="refreshListBySort"
            @refresh="onRefresh"></role-list-table>
          <qf-pagination
            slot="pagination"
            :total="pagination.total"
            :page-size="pagination.limit"
            v-model="pagination.start"
            @change="onPageChange">
          </qf-pagination>
        </list-container>
      </page-body>
    </div>
</template>
<script lang="ts" src='./RoleList.ts'></script>
<style lang="scss">
    .role-list-view {
      height: 100%;
      .qf-list-container .qf-search-box{
        padding: 0 20px;
        margin-bottom: 0;
      }
      .qf-list-container{
        margin-top: -30px;
      }
    }
</style>
