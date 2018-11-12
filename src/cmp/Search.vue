<template>
  <div class="sku-search">
    <qf-popper ref="result" v-show="resultVisible" :popperClass="'sku-search-popper'" placement="bottom-start"
               trigger="manual"
               :preventOverflow=true :visibleArrow=false :z-index="100">
      <div v-show="items.length > 0" v-for="(item,index) in items" :key="index" @click="onClickSelect(index)">
        <div class="search-item sku-search-item" :class="{active:selectedIndex===index}" v-if="type==='sku'">
          <div class="sku-name">{{item.name}}</div>
          <div class="sku-barcode">{{item.barcode}}</div>
          <div class="sku-unit"><span v-if="item.munit">{{item.munit}}</span></div>
          <div class="sku-price">￥{{item.wholePrice|fmt}}</div>
        </div>
        <div class="search-item sku-search-item" :class="{active:selectedIndex===index}" v-if="type==='sku2'">
          <div class="sku-name">{{item.name}}</div>
          <div class="sku-barcode">{{item.barcode}}</div>
          <div class="sku-unit"><span v-if="item.munit">{{item.munit}}</span></div>
          <div class="sku-price">￥{{item.purchasePrice|fmt}}</div>
        </div>
        <div class="search-item sku-search-item" :class="{active:selectedIndex===index}" v-if="type==='sku3'">
          <div class="sku-name">{{item.name}}</div>
          <div class="sku-barcode">{{item.barcode}}</div>
          <div class="sku-unit"><span v-if="item.munit">{{item.munit}}</span></div>
        </div>
        <div class="search-item customer-search-item" :class="{active:selectedIndex===index}" v-if="type==='customer'">
          <div class="sku-name">{{item.name}}</div>
          <div class="sku-barcode">{{item.code}}</div>
        </div>
        <div class="search-item sku-search-item" :class="{active:selectedIndex===index}" v-if="type==='account'">
          <div class="sku-barcode">{{item.code}}</div>
          <div class="sku-name">{{item.name}}</div>
        </div>
        <div class="search-item supplier-search-item" :class="{active:selectedIndex===index}" v-if="type==='supplier'">
          <div class="sku-name">{{item.name}}</div>
          <div class="sku-barcode">{{item.code}}</div>
        </div>
        <div class="search-item user-search-item" :class="{active:selectedIndex===index}" v-if="type==='user'">
          <div class="sku-name">{{item.name}}</div>
        </div>
      </div>
      <div v-if="type==='sku'||type==='sku2'" v-show="items.length===0" class="search-empty sku-search-empty">没有找到匹配商品
      </div>
      <div v-if="type==='customer'" v-show="items.length===0" class="search-empty customer-search-empty">没有找到匹配客户</div>
      <div v-if="type==='account'" v-show="items.length===0" class="search-empty customer-search-empty">没有找到匹配科目</div>
      <div v-if="type==='supplier'" v-show="items.length===0" class="search-empty supplier-search-empty">没有找到匹配供应商</div>
      <div v-if="type==='user'" v-show="items.length===0" class="search-empty user-search-empty">没有找到匹配用户</div>
    </qf-popper>
    <qf-input :selectOnfocus="true" ref="input" v-model="keyword" v-popper:result :placeholder="placeholder"
              :maxlength="25"
              :disabled="disabled"
              :readonly="readonly"
              @keydown.native.13="onEnter"
              @keydown.native.38.40="onUpdown"
              @blur="onKeywordBlur"
              @keydown.native.9="onTab"
              @input="onKeywordChange"></qf-input>
  </div>
</template>

<script lang="ts" src="./Search.ts"></script>

<style lang="scss">
  @import '~styles/base.scss';

  .sku-search {
    width: 100%;
    .qf-popper {
      position: relative;
      padding: 0;
      max-height: 348px;
      overflow: auto;
    }

    .sku-search-popper {

      &.qf-popper[x-placement^=top] {
        margin-bottom: 4px;
      }

      &.qf-popper[x-placement^=bottom] {
        margin-top: 4px;
      }
      .split-line {
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44px;
        font-size: 12px;
        color: $--color-font-light-2;
        .line {
          border-bottom: 1px solid $--color-border-light-3;
          flex: auto;
        }
      }
      .search-item {
        width: 200px;
        padding: 0 0 0 16px;
        &.active {
          background: $--color-focus-light-3;
        }
        font-size: 16px;
        color: $--color-font;
        display: flex;
        height: 44px;
        align-items: center;
        .sku-name {
          .icon-provider {
            color: $--color-info;
          }
          flex: 6;
          @include ellipsis()
        }
        .sku-barcode {
          flex: 3;
          color: $--color-font-light-1;
          @include ellipsis()
        }
        .sku-unit {
          flex: 1;
          @include ellipsis();
        }
        .sku-price {
          flex: 2;
          @include ellipsis()
        }
      }
      .search-empty {
        padding: 16px;
      }
      .sku-search-item, .sku-search-empty {
        width: 550px;
      }
      .user-search-item, .user-search-empty {
        width: 200px;
      }
      .customer-search-item, .customer-search-empty {
        width: 300px;
      }
      .supplier-search-item, .supplier-search-empty {
        width: 300px;
      }
    }
  }
</style>
