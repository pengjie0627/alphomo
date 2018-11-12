<template>
  <div class="qf-nav" :class="[open ? 'is-open' : '']">
    <div class="qf-groups">
      <slot></slot>
    </div>
    <div class="qf-nav-trigger" @click="handleTrigger" :class="[open?'qf-nav-trigger-close':'qf-nav-trigger-open']"
         v-if="openable && !isHome"></div>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      rootMenu: this
    }
  },
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    openable: {
      type: Boolean,
      default: true
    },
    loaded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: this.openable && !this.collapse,
      groups: [],
      items: [],
      isHome: false
    }
  },
  mounted() {
    // this.open = false
  },
  watch: {
    loaded(value) {
      if (value) {
        this.$on('groupClick', this.onSelectGroup)
        this.$on('itemClick', this.onSelectItem)
        if (this.$route.path === '/home') {
          this.isHome = true
          this.open = false
        }
        this.matchRoute(this.$route)
      }
    },
    collapse(val) {
      this.open = !val
      this.doOpen(this.open)
    },
    '$route'(to, from) {
      if (to.path === '/home') {
        this.isHome = true
        this.open = false
      } else {
        this.isHome = false
      }
      this.matchRoute(to)
    }
  },
  methods: {
    matchRoute(route) {
      let matched = false
      let selectGroup, selectItem
      this.groups.forEach(group => {
        if (group.selected) {
          selectGroup = group
        }
        group.items.forEach(item => {
          if (item.selected) {
            selectItem = item
          }
        })
      })
      this.groups.forEach(group => {
        group.selected = group.routerLink === route.path || route.matched.some(toItem => group.routerLink === toItem.path)
        if (group.selected) {
          matched = true
        }
        group.items.forEach(item => {
          item.selected = item.routerLink === route.path || route.matched.some(toItem => group.routerLink === toItem.path)
          if (item.selected && !group.selected) {
            group.selected = true
          }
          if (item.selected) {
            matched = true
          }
        })
      })
      if (!matched) {
        if (selectGroup) {
          selectGroup.selected = true
          if (selectItem) {
            selectItem.selected = true
          } else if (selectGroup.items.length) {
            selectGroup.items[0].selected = true
          }
        } else if (this.groups.length) {
          this.groups[0].selected = true
        }
      }
      this.doOpen(this.open)
    },
    doOpen(val) {
      var group = this.groups.filter(item => item.selected)
      this.groups.forEach(value => {
        value.fixed = val && group.length && group[0].items.length === 0
      })
    },
    addGroup(group) {
      this.groups.push(group)
    }
    ,
    removeGroup(group) {
      this.groups.splice(this.groups.indexOf(group), 1)
    }
    ,
    onSelectGroup(group) {
      this.groups.forEach(value => {
        if (value !== group) {
          value.selected = false
        }
      })
      group.selected = true
      if (group.items.length > 0) {
        // 默认选中第一个
        group.items[0].handleClick()
        this.open = true
      }
      this.doOpen(this.open)
    }
    ,
    onSelectItem(item) {
      this.groups.forEach(group => {
        group.items.forEach(value => {
          if (value !== item) {
            value.selected = false
          }
        })
      })
      item.selected = true
    }
    ,
    handleTrigger() {
      // if (this.$route.path === '/home') {
      //   this.open = false
      // } else {
      //   this.open = !this.open
      // }
      this.open = !this.open
      this.doOpen(this.open)
    }
  }
}
</script>

<style lang="scss">
  .qf-nav {
    list-style: none;
    position: relative;
    width: 56px;
    color: rgba(255, 255, 255, 0.5);
    background-image: linear-gradient(to bottom, #2E334F, #4E3F54);

    .qf-groups {
      /*overflow: hidden;*/
      position: relative;
      height: 100%;
    }

    .qf-nav-trigger {
      position: absolute;
      top: 0;
      left: 56px;
      width: 22px;
      height: 40px;
      z-index: 100;
    }
    .qf-nav-trigger-open {
      background: url('~images/main/ic_open_side_menu.svg') center center no-repeat;
    }
    .qf-nav-trigger-close {
      background: url('~images/main/ic_close_side_menu.svg') center center no-repeat;
    }

    &.is-open {
      width: 188px;

      .qf-nav-trigger {
        left: 165px;
      }
    }
  }
</style>
