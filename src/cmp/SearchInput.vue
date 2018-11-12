<template>
  <div class="qf-search">
    <qf-input :selectOnfocus="true" ref="input" v-model="keyword" v-popper:result :placeholder="placeholder" :maxlength="25"
              @keydown.native.13="onEnter"
              @keydown.native.38.40="onUpdown"
              @keydown.native.9="onTab"
              @blur="onKeywordBlur"
              @input="onKeywordChange"/>

    <qf-popper ref="result" v-show="resultVisible" :popperClass="'qf-search-popper'" placement="bottom-start" trigger="manual"
               :preventOverflow=true :visibleArrow=false :z-index="100">
      <div v-show="items.length > 0" v-for="(item,index) in items" :key="index" @click="onClickSelect(index)"
           :class="{active:selectedIndex===index,'qf-search-item':true}">
        <template>
          <slot :item="item"></slot>
        </template>
      </div>
      <div v-show="items.length===0" class="sku-search-empty">没有找到匹配</div>
    </qf-popper>
  </div>
</template>
<script>
import { DomUtil } from 'fant'
import debounce from 'lodash/debounce.js'
import CommonUtils from 'util/CommonUtil'
// import CancelPromise from 'util/CancelPromise'

export default {
  name: 'QfSearch',
  props: {
    value: {
      default: {}
    },
    list: {
      default: []
    },
    displayField: {
      default: 'name'
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data() {
    return {
      items: [],
      keyword: '', // 搜索关键字
      selectedIndex: -1, // 选择商品下标
      resultVisible: false,
      debounceQuery: debounce((self) => {
        ((keyword) => {
          self.$emit('match', keyword)
        })(self.keyword)
      }, 300)
    }
  },
  watch: {
    list(val) {
      this.items = val
      if (this.keyword.length === 0) {
        this.resultVisible = false
      } else {
        this.resultVisible = true
      }
    },
    resultVisible(val) {
      if (!val) {
        this.$refs.result.doClose()
        this.selectedIndex = -1
        this.items = []
      } else {
        this.$refs.result.doShow()
      }
    }
  },
  mounted() {
    DomUtil.on(document, 'click', this.handleDocumentClick)
    this.updateKeyword(this.value)
  },
  beforeDestroy() {
    DomUtil.off(document, 'click', this.handleDocumentClick)
  },
  methods: {
    handleDocumentClick(e) {
      const popper = this.$refs.result
      if (!this.$el || this.$el.contains(e.target) || !popper || popper.$el.contains(e.target)) return
      this.resultVisible = false
    },

    updateKeyword(value){
      let keys = this.displayField.split('.')
      let keyValue = value
      for (let i = 0; i < keys.length; i++) {
        if (keyValue) {
          keyValue = keyValue[keys[i]]
        } else {
          keyValue = ''
        }
      }
      this.keyword = keyValue
    },
    /**
     *  搜索框失去焦点
     */
    onKeywordBlur() {
      if (this.keyword.length === 0) {
        this.updateModel({})
      } else {
        // this.watch.value(this.value)
      }
      this.$emit('blur')
    },
    /**
     *  tab 切换
     */
    onTab() {
      this.resultVisible = false
    },
    /**
     *  监听输入框值的变化
     */
    onKeywordChange() {
      this.debounceQuery(this)
    },
    /**
     *  enter event
     */
    onEnter() {
      // 清空input
      if (this.keyword === '') {
        this.updateModel({})
      }
      // 回车选中商品
      if (this.items && this.items.length && this.selectedIndex >= 0) {
        return this.onSelected()
      }
      let keyword = this.keyword
      this.keyword = ''
      this.selectedIndex = -1
      this.items = []
      this.$refs.input.$el.getElementsByTagName('input')[0].value = ''
      this.debounceQuery.cancel() // 撤销模糊查询
      this.queryPromise && this.queryPromise.cancel()
      this.resultVisible = false
      this.$emit('enter', keyword)
    },
    /**
     * 商品上下键选中
     */
    onUpdown(ev) {
      if (this.items.length === 0) {
        return
      }
      let nextIndex = 0
      if (ev.keyCode === 38) {
        if (this.selectedIndex - 1 < 0) {
          nextIndex = this.items.length - 1
        } else {
          nextIndex = this.selectedIndex - 1
        }
        this.onSelecting(nextIndex)

        ev.preventDefault()
        ev.stopPropagation()
        ev.returnValue = false
        ev.cancelBubble = true
      } else if (ev.keyCode === 40) {
        if (this.selectedIndex + 1 > this.items.length - 1) {
          nextIndex = 0
        } else {
          nextIndex = this.selectedIndex + 1
        }
        this.onSelecting(nextIndex)

        ev.preventDefault()
        ev.stopPropagation()
        ev.returnValue = false
        ev.cancelBubble = true
      }
    },

    /**
     *  点击选中商品
     */
    onClickSelect(index) {
      this.onSelecting(index)
      this.onSelected()
    },
    /**
     * 选中商品
     */
    onSelecting(index) {
      this.selectedIndex = index
      CommonUtils.scrollIntoView(this.$refs.result.$el.children[0], document.getElementsByClassName('sku-search-item')[index])
    },
    /**
     * 确认商品
     */
    onSelected() {
      this.updateModel(this.items[this.selectedIndex])
      this.resultVisible = false
      this.selectedIndex = -1
      this.items = []
    },
    /**
     *  更新v-model数据
     */
    updateModel(sku) {
      this.updateKeyword(sku)
      this.$emit('input', sku)
      sku.id && this.$emit('select', sku)// 清空操作的时候，不触发select
    }
  }
}
</script>
<style lang="scss">
  @import '~styles/var.scss';

  .qf-search {
    .qf-popper {
      position: relative;
      padding: 0;
      min-width: 200px;
      max-height: 348px;
      overflow: auto;
    }
    .qf-search-popper {
      &.qf-popper[x-placement^=top] {
        margin-bottom: 4px;
      }
      &.qf-popper[x-placement^=bottom] {
        margin-top: 4px;
      }
      .qf-search-item {
        &.active {
          background: $--color-focus-light-3;
        }
      }
    }
  }
</style>
