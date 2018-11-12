<template>
  <qf-dialog-def :title="title" @cancel="onCancel" @confirm="onConfirm" class="sku-selection-win">
    <div class="selection">
      <div class="left">
        <div>商品分类</div>
        <qf-tree
          :load="loadNode1"
          lazy
          :props="defaultProps"
          @node-click="onSelectSkuCategory"></qf-tree>
      </div>
      <div class="right">
        <div class="search">
          <qf-input class="search-box" v-model="keyword" placeholder="请输入商品编码或名称进行搜索"></qf-input>
          <qf-button class="search-btn" @click="onSearch">搜索</qf-button>
        </div>
        <qf-table v-if="multiple" class="grid" :data="datas" @selection-change="onSelectionChange" ref="table"
                  height="350"
                  row-key="id"
                  @sort-change="onSortChange" @row-click="onClick">
          <qf-table-column type="selection"/>
          <qf-table-column type="index"/>
          <qf-table-column v-for="column in columns" :key="column.id" :label="column.label" :prop="column.prop"
                           :align="column.align ? column.align : 'left'"></qf-table-column>
        </qf-table>
        <qf-table v-if="!multiple" class="grid" :data="datas" @current-change="onCurrentChange" ref="table" row-key="id"
                  @sort-change="onSortChange" @row-click="onClick" @row-dblclick="onDbClick" highlight-current-row>
          <qf-table-column type="index"/>
          <qf-table-column v-for="column in columns" :key="column.id" :label="column.label" :prop="column.prop"
                           :align="column.align ? column.align : 'left'"></qf-table-column>
        </qf-table>
        <div class="page">
          <qf-pagination :total='totalCount' v-model="currPage"
                         :page-size="pageSize"
                         @change="onPageChange"></qf-pagination>
        </div>
      </div>
    </div>
  </qf-dialog-def>
</template>

<script lang="ts" src="./SkuSelectionWin.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .sku-selection-win {
    width: 700px;
    .selection {

      padding: 20px;

      .left {
        padding: 0 20px 20px 0;
        float: left;
        width: 150px;
        height: 400px;
        overflow-x: auto;
        overflow-y: auto;
      }
      .right {
        margin-left: 150px;
        height: 100%;
        display: flex;
        flex-direction: column;

        .search {
          width: 100%;
          display: flex;
          .search-box {
            flex: 1;
          }
          .search-btn {
            margin-left: 10px;
          }
        }

        .grid {
          flex: 1;
          margin-top: 10px;
          overflow: auto;
        }

        .page {
          text-align: right;
          margin-top: 8px;
        }
      }
    }
  }
</style>
