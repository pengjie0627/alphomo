<template>
    <div class="charge-list">
      <page-body :menu="menu">
        <!-- 面包屑中间部分 插槽位slot="tip" -->
        <div slot="tip">
          <!--<qf-tip type="info" class="tip-width">您当前员工数为1,最多可添加5个员工，<qf-button type="link" @click="onBuyNow">立即续订</qf-button></qf-tip>-->
        </div>
        <!--面包屑右边部分 插槽位slot="actions"-->
        <template slot="actions">
          <qf-button type="primary" @click="onAddPay()" v-if="hasPermissions('finance.charge.create')">新建费用单</qf-button>
          <qf-button  @click="doImport()" v-if="hasPermissions('finance.charge.import')">导入费用单</qf-button>
        </template>
        <list-container>
          <!-- 标准搜索栏 插槽位slot="search"-->
          <query-condition slot="search" @search="search" @reset="reset" @toggle="toggle" ref="search">
            <qf-form-item labelWidth="0px">
              <qf-input ref="fuzzy" @keydown.native.enter="doEnterSearch()" placeholder="请输入单号/供应商名称/备注进行搜索" v-model="query.closed[0]" :maxlength="255"></qf-input>
            </qf-form-item>
            <!--如果列数为3的倍数的插槽位 slot="opened"-->
            <template slot="opened">
              <qf-row>
                <qf-col :span="8">
                  <qf-form-item label="单据信息">
                    <qf-input @keydown.native.enter="doEnterSearch()" placeholder="单号" :maxlength="38" v-model="query.expand[0]"></qf-input>
                  </qf-form-item>
                </qf-col>
                <qf-col :span="16">
                  <qf-form-item label="业务日期">
                    <!--<qf-date-picker-->
                      <!--v-model="query.expand[1]"-->
                      <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                      <!--type="daterange"-->
                      <!--range-separator="~"-->
                      <!--start-placeholder="开始日期"-->
                      <!--end-placeholder="结束日期">-->
                    <!--</qf-date-picker>-->
                    <qf-date-picker v-model="query.expand[1]"
                                    value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                                    range-separator="~"
                                    start-placeholder="开始日期" end-placeholder="结束日期"></qf-date-picker>
                  </qf-form-item>
                </qf-col>
              </qf-row>
              <qf-row>
                <qf-col :span="8">
                  <qf-form-item label="经办人">
                    <!--<qf-select v-model="query.expand[2]">-->
                      <!--<qf-option v-for="item in managerList" :key="item.code" :label="item.name"-->
                                 <!--:value="item.id"></qf-option>-->
                    <!--</qf-select>-->
                    <qf-input placeholder="请输入经办人" v-model="query.expand[2]"
                              :maxlength="32" @keydown.native.enter="doEnterSearch()"></qf-input>
                  </qf-form-item>
                </qf-col>
                <qf-col :span="8">
                  <qf-form-item label="付款状态">
                    <qf-select v-model="query.expand[3]">
                      <qf-option value="" label="全部">全部</qf-option>
                      <qf-option value="UNPAID" label="未付款">未付款</qf-option>
                      <!--<qf-option value="PART_PAID" label="部分付款">部分付款</qf-option>-->
                      <qf-option value="PAID" label="已付款">已付款</qf-option>
                    </qf-select>
                  </qf-form-item>
                </qf-col>
                <qf-col :span="8">
                  <qf-form-item label="单据状态">
                    <qf-select v-model="query.expand[4]">
                      <qf-option value="" label="全部">全部</qf-option>
                      <qf-option value="UNAUDITED" label="未审核">未审核</qf-option>
                      <qf-option value="AUDITED" label="已审核">已审核</qf-option>
                      <qf-option value="ABOLISHED" label="已作废">已作废</qf-option>
                      <!--<qf-option value="REMOVE" label="已删除">已删除</qf-option>-->
                    </qf-select>
                  </qf-form-item>
                </qf-col>
              </qf-row>
              <qf-row>
                <qf-col :span="8">
                  <qf-form-item label="付款类型">
                    <qf-select v-model="query.expand[5]">
                      <qf-option value="" label="全部">全部</qf-option>
                      <qf-option value="CASH" label="现金交款">现金交款</qf-option>
                      <qf-option value="DEDUCTION" label="账款抵扣">账款抵扣</qf-option>
                    </qf-select>
                  </qf-form-item>
                </qf-col>
                <qf-col :span="8">
                  <qf-form-item label="其它">
                    <qf-input placeholder="备注" :maxlength="38" v-model="query.expand[6]" @keydown.native.enter="doEnterSearch()"></qf-input>
                  </qf-form-item>
                </qf-col>
              </qf-row>
            </template>
            <!--剩余2列和按钮在一行的插槽位 slot="openedQuery"-->
            <template slot="openedQuery"></template>
          </query-condition>
          <!-- 表格上面的按钮组 -->
          <div slot="toolbar">
            <qf-row>
              <qf-col :span="12">
                <qf-button type="primary" @click="onExport" v-if="hasPermissions('finance.charge.export')">导出全部</qf-button>
                <print-view :id="id" type="Charge" btnType="default" v-if="hasPermissions('finance.charge.print')"></print-view>
              </qf-col>
              <qf-col :span="12" class="summary-right">合计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="item" style="color: #f93e61;font-weight: bold"> {{ billAmount | fmt }}</span></qf-col>
            </qf-row>
          </div>
          <charge-list-table slot="list"
                             @refreshList="onRefreshList"
                             @refreshListBySort="onRefreshListBySort"
                             @printEvent="onPrintEvent"
                             :printFlag="printFlag"
                             :tableData="tableData"
                             :query="getQueryParams">
          </charge-list-table>
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

<script lang="ts" src='./ChargeList.ts'></script>
<style lang="scss">
  .charge-list {
    .qf-date-editor--daterange.qf-input__inner{
      width: 100%;
    }
    .summary-right {
      font-weight: bold;
      font-size: 13px;
      text-align: right;
      line-height: 36px;
    }
  }
</style>
