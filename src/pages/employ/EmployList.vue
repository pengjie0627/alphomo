<template>
  <div class="employ-list-view">
    <!--导航面包屑-->
    <page-body class="sale-list" :menu="menu">
      <!-- 面包屑中间部分 插槽位slot="tip" -->
      <div slot="tip" class="tip-wrap">
        <!--<qf-tip type="info" class="tip-width">您当前员工数为1,最多可添加5个员工，<qf-button type="link" @click="onBuyNow">立即续订</qf-button></qf-tip>-->
      </div>
      <!--面包屑右边部分 插槽位slot="actions"-->
      <div slot="actions">
        <qf-button icon="ic_icon-add" type="primary" @click="onAddEmploy">新建员工</qf-button>
        <qf-button type="default" @click="onImportEmploy">导入员工</qf-button>
      </div>
      <list-container>
        <!-- 标准搜索栏 插槽位slot="search"-->
        <query-condition ref="query" slot="search" @search="search" @reset="reset" @toggle="toggle">
          <qf-form-item labelWidth="0px">
            <qf-input ref="selName" v-model='query.nameAndNote' placeholder="请输入角色名称进行搜索" :maxlength="255" @keydown.native.enter="doEnterSearch()"></qf-input>
          </qf-form-item>
          <!--如果列数为3的倍数的插槽位 slot="opened"-->
          <template slot="opened">
            <qf-row>
              <qf-col :span="8">
                <qf-form-item label="姓名">
                  <qf-input placeholder="请输入" v-model="query.name" :maxlength="38" @keydown.native.enter="doEnterSearch()"></qf-input>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="手机号">
                  <qf-input type="text" regex="^[0-9]*$" :maxlenth="11" placeholder="请输入"
                            v-model="query.mobile" @keydown.native.enter="doEnterSearch()"></qf-input>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="状态">
                  <qf-select v-model="query.status" class="status_select">
                    <qf-option value="" label="全部">全部</qf-option>
                    <qf-option value="0" label="正常">正常</qf-option>
                    <qf-option value="1" label="锁定">锁定</qf-option>
                  </qf-select>
                </qf-form-item>
              </qf-col>
            </qf-row>
          </template>
          <!--剩余2列和按钮在一行的插槽位 slot="openedQuery"-->
          <template slot="openedQuery">
            <qf-row>
              <qf-col :span="12">
                <qf-form-item label="角色">
                  <qf-select v-model="query.role">
                    <qf-option value="" label="全部">全部</qf-option>
                    <qf-option v-for="(item, index) in roleList" :value="item.id" :label="item.name" :key="index">
                      {{item.name}}
                    </qf-option>
                  </qf-select>
                </qf-form-item>
              </qf-col>
              <!--<qf-col :span="12">-->
              <!--<qf-form-item label="备注">-->
              <!--<qf-input placeholder="请输入" v-model="query.note" :maxlength="255"></qf-input>-->
              <!--</qf-form-item>-->
              <!--</qf-col>-->
            </qf-row>
          </template>
        </query-condition>
        <!-- 表格上面的按钮组 -->
        <div slot="toolbar">
          <qf-button type="primary" @click="onExport">导出全部</qf-button>
        </div>
        <employ-list-table
          slot="list"
          @refreshList="onRefreshList"
          @refreshListBySort="refreshListBySort"
          :employList="employList"></employ-list-table>
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
<script lang="ts" src='./EmployList.ts'></script>
<style lang="scss">
  .employ-list-view {
    .status_select .qf-select-options {
      max-width: 250px;
    }
    height: 100%;
    .tip-wrap {
      text-align: center;
    }
    .tip-width {
      width: 350px;
      margin: 0 auto;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>
