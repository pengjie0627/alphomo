<template>
  <div class="account-bill-list">
    <page-body :menu="menu">
      <!-- 面包屑中间部分 插槽位slot="tip" -->
      <div slot="tip">
        <!--<qf-tip type="info" class="tip-width">您当前员工数为1,最多可添加5个员工，<qf-button type="link" @click="onBuyNow">立即续订</qf-button></qf-tip>-->
      </div>
      <!--面包屑右边部分 插槽位slot="actions"-->
      <template slot="actions">
        <qf-button type="primary" @click="onAddPay()" v-if="hasPermissions('finance.supplierStatement.create')">新建结算单</qf-button>
        <qf-button @click="onImportPay()" v-if="hasPermissions('finance.supplierStatement.import')">导入结算单</qf-button>
      </template>
      <list-container>
        <!-- 标准搜索栏 插槽位slot="search"-->
        <query-condition slot="search" @search="search" @reset="reset" @toggle="toggle" ref="search">
          <qf-form-item labelWidth="0px">
            <qf-input ref="fuzzy" placeholder="请输入单号/供应商名称/其他业务单据单号/备注进行搜索" @keydown.native.enter="doEnterSearch()" v-model="query.closed[0]" :maxlength="255"></qf-input>
          </qf-form-item>
          <!--如果列数为3的倍数的插槽位 slot="opened"-->
          <template slot="opened">
            <qf-row>
              <qf-col :span="8">
                <qf-form-item label="单据信息">
                  <qf-input placeholder="单号" :maxlength="38" v-model="query.expand[0]" @keydown.native.enter="doEnterSearch()"></qf-input>
                </qf-form-item>
              </qf-col>
              <qf-col :span="16">
                <qf-form-item label="业务日期">
                  <qf-date-picker
                    v-model="query.expand[1]"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </qf-date-picker>
                </qf-form-item>
              </qf-col>
            </qf-row>
            <qf-row>
              <qf-col :span="8">
                <qf-form-item label="经办人">
                  <!--<qf-select v-model="query.expand[2]">-->
                    <!--<qf-option v-for="item in manageList" :value="item.id" :label="item.name">{{item.name}}</qf-option>-->
                  <!--</qf-select>-->
                  <qf-input v-model="query.expand[2]" placeholder="请输入" @keydown.native.enter="doEnterSearch()"></qf-input>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="供应商">
                  <!--<qf-select v-model="query.expand[3]">-->
                    <!--<qf-option v-for="item in providerList" :value="item.id" :label="item.name">{{item.name}}</qf-option>-->
                  <!--</qf-select>-->
                  <qf-input v-model="query.expand[3]" placeholder="请输入" @keydown.native.enter="doEnterSearch()"></qf-input>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="单据状态">
                  <qf-select v-model="query.expand[4]">
                    <qf-option value="" label="全部">全部</qf-option>
                    <qf-option value="UNAUDITED" label="未审核">未审核</qf-option>
                    <qf-option value="AUDITED" label="已审核">已审核</qf-option>
                    <qf-option value="ABOLISHED" label="已作废">已作废</qf-option>
                  </qf-select>
                </qf-form-item>
              </qf-col>
            </qf-row>
            <qf-row>
              <qf-col :span="8">
                <qf-form-item label="收票状态">
                  <qf-select v-model="query.expand[5]">
                    <qf-option value="" label="全部">全部</qf-option>
                    <qf-option value="0" label="未收票">未收票</qf-option>
                    <qf-option value="1" label="已收票">已收票</qf-option>
                  </qf-select>

                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="付款状态">
                  <qf-select v-model="query.expand[6]">
                    <qf-option value="" label="全部">全部</qf-option>
                    <qf-option value="UNPAID" label="未付款">未付款</qf-option>
                    <qf-option value="PAID" label="已付款">已付款</qf-option>
                  </qf-select>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item label="其它">
                  <qf-input placeholder="业务单据单号" :maxlength="38" v-model="query.expand[7]" @keydown.native.enter="doEnterSearch()"></qf-input>

                </qf-form-item>
              </qf-col>
            </qf-row>
          </template>
          <template slot="openedQuery">

          </template>
          <!--剩余2列和按钮在一行的插槽位 slot="openedQuery"-->
          <template slot="openedQuery"></template>
        </query-condition>
        <!-- 表格上面的按钮组 -->
        <div slot="toolbar">
          <qf-row>
            <qf-col :span="12">
              <qf-button type="primary" @click="onExport" v-if="hasPermissions('finance.supplierStatement.export')">导出全部</qf-button>
              <print-view :id="selectId" type="SupplierStatement" btnType="default" :disabled="selectId.length <= 0" v-if="hasPermissions('finance.supplierStatement.print')"></print-view>
            </qf-col>
            <qf-col :span="12">
              <div class="total-amount line-height">合计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{getSumAmount | fmt}}</span></div>
            </qf-col>
          </qf-row>
        </div>
        <account-bill-list-table
          slot="list"
          @refreshList="onRefreshList"
          @refreshListBySort="onRefreshListBySort"
          @printEvent="onPrintEvent"
          :printFlag="printFlag"
          :queryParams="getQueryParams"
          :tableData="tableData">
        </account-bill-list-table>
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
<script lang="ts" src='./AccountBillList.ts'></script>
<style lang="scss">
  .account-bill-list {
    .qf-date-editor--daterange.qf-input__inner{
      width: 100%;
    }
    .total-amount{
      font-weight: bold;
      font-size: 13px;text-align: right;
      span{
        font-weight: bold;
        color: #33CC66;
      }
    }
    .line-height{
      line-height: 36px;
    }
  }
</style>
