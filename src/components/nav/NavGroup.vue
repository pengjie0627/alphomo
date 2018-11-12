<template>
  <li class="qf-nav-group"
      v-popper:popper
      :class="[selected ? 'is-selected' : '', fixed ? 'is-fixed': '', home ? 'is-home' : '']"
      @click="handleClick" @mouseover="handleHover($event)" @mouseleave="handleLeave">
    <template v-if="!selected && !fixed && !hideTip">
      <qf-popper ref="popper"
                 class="width-style"
                 :popperClass="'menu-popper'"
                 placement="top"
                 trigger="manual"
                 v-if="!rootMenu.open"
                 :preventOverflow=true
                 :visibleArrow=false
                 :z-index="100000">
        <div style="width: 120px;height: auto" v-if="!secTitle && !thirdTitle">
          <div class="ul-title">{{firTitle ? firTitle : title}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.children">
              <li @click="onToRoute(child.url, $event, child.secUrl)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
        </div>
        <div style="width: 120px;height: auto" v-if="secTitle && !thirdTitle">
          <div class="ul-title">{{firTitle ? firTitle : title}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.children">
              <li @click="onToRoute(child.url, $event, child.secUrl)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
          <div style="height: 1px;border-top: 1px solid rgba(235,238,245,1);margin:10px;margin-bottom: 15px"></div>
          <div class="ul-title">{{secTitle}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.secChildren">
              <li @click="onToRoute(child.url, $event, child.secUrl)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
        </div>
        <div style="width: 120px;height: auto" v-if="thirdTitle">
          <div class="ul-title">{{firTitle ? firTitle : title}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.children">
              <li @click="onToRoute(child.url, $event, child.secUrl)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
          <div style="height: 1px;border-top: 1px solid rgba(235,238,245,1);margin:10px;margin-bottom: 15px"></div>
          <div class="ul-title">{{secTitle}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.secChildren">
              <li @click="onToRoute(child.url, $event, child.secUrl)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
          <div style="height: 1px;border-top: 1px solid rgba(235,238,245,1);margin:10px;margin-bottom: 15px"></div>
          <div class="ul-title">{{thirdTitle}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.thirdChildren">
              <li @click="onToRoute(child.url, $event, child.secUrl)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
        </div>
      </qf-popper>
      <div class="nav-btn">
        <div class="nav-icon" v-show="$slots.icon">
          <slot name="icon"></slot>
          <div class="bottom-name">{{title}}</div>
        </div>
        <span class="nav-title">{{title}}</span>
      </div>
    </template>
    <template v-else>
      <qf-popper ref="popper"
                 class="width-style"
                 :popperClass="'menu-popper'"
                 placement="top"
                 trigger="manual"
                 v-if="!rootMenu.open"
                 :preventOverflow=true
                 :visibleArrow=false
                 :z-index="100000">
        <div style="width: 120px;height: auto" v-if="!secTitle && !thirdTitle">
          <div class="ul-title">{{firTitle ? firTitle : title}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.children">
              <li @click="onToRoute(child.url, $event)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
        </div>
        <div style="width: 120px;height: auto" v-if="secTitle && !thirdTitle">
          <div class="ul-title">{{firTitle ? firTitle : title}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.children">
              <li @click="onToRoute(child.url, $event)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
          <div style="height: 1px;border-top: 1px solid rgba(235,238,245,1);margin:10px;margin-bottom: 15px"></div>
          <div class="ul-title">{{secTitle}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.secChildren">
              <li @click="onToRoute(child.url, $event)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
        </div>
        <div style="width: 120px;height: auto" v-if="thirdTitle">
          <div class="ul-title">{{firTitle ? firTitle : title}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.children">
              <li @click="onToRoute(child.url, $event)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
          <div style="height: 1px;border-top: 1px solid rgba(235,238,245,1);margin:10px;margin-bottom: 15px"></div>
          <div class="ul-title">{{secTitle}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.secChildren">
              <li @click="onToRoute(child.url, $event)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
          <div style="height: 1px;border-top: 1px solid rgba(235,238,245,1);margin:10px;margin-bottom: 15px"></div>
          <div class="ul-title">{{thirdTitle}}</div>
          <div v-for="item in menus" v-if="item.name === title">
            <ul class="ul-item" v-for="child in item.thirdChildren">
              <li @click="onToRoute(child.url, $event, child.secUrl)" class="hover-item">{{child.name}}</li>
            </ul>
          </div>
        </div>
      </qf-popper>
      <div class="nav-btn">
        <div class="nav-icon" v-show="$slots.icon">
          <slot name="icon"></slot>
          <div class="bottom-name">{{title}}</div>
        </div>
        <span class="nav-title">{{title}}</span>
      </div>
    </template>
    <transition :name="transition">
      <ul class="nav-items" v-show="showItems">
        <div class="nav-header-line">
          <span class="group-title">{{firTitle ? firTitle : title}}</span>
        </div>
        <slot></slot>
      </ul>
    </transition>
  </li>
</template>

<script>
import QfTooltip from 'components/Tooltip'
import QfPopper from 'components/Popper.vue'

export default {
  inject: ['rootMenu'],
  provide() {
    return {
      groupMenu: this
    }
  },
  data() {
    return {
      items: [],
      selected: false,
      fixed: false
    }
  },
  components: {
    QfTooltip,
    QfPopper
  },
  props: {
    title: String,
    firTitle: String,
    secTitle: String,
    thirdTitle: String,
    menus: Array,
    routerLink: String,
    home: {
      type: Boolean,
      default: false
    },
    hideTip: {
      type: Boolean,
      default: false
    },
    beforeRoute: Function
  },
  created() {
    this.rootMenu.addGroup(this)
  },
  mounted() {
    console.log(this.menus)
    this.rootMenu.handleTrigger()
  },
  beforeDestroy() {
    this.rootMenu.removeGroup(this)
  },
  computed: {
    showItems() {
      return this.rootMenu.open & this.selected && this.items.length > 0
    },
    transition() {
      if (this.selected) {
        return 'qf-nav-right-in'
      } else if (!this.selected && !this.fixed) {
        return 'qf-nav-select-out'
      } else if (!this.selected && this.fixed) {
        return 'qf-nav-fixed-out'
      }
      return ''
    }
  },
  methods: {
    addItem(item) {
      this.items.push(item)
    },
    removeItem(item) {
      this.items.splice(this.items.indexOf(item), 1)
    },
    handleClick(event) {
      if (event.target.className === 'nav-items') {
        return
      }
      if (this.items.length <= 0 && this.routerLink) {
        if (this.beforeRoute) {
          if (this.beforeRoute(this.routerLink)) {
            this.$router.push(this.routerLink, () => {
              this.rootMenu.$emit('groupClick', this)
            })
            return
          }
        } else {
          this.$router.push(this.routerLink, () => {
            this.rootMenu.$emit('groupClick', this)
            this.rootMenu.open = false
            this.rootMenu.doOpen(false)
          })
          return
        }
      }
      if (this.rootMenu.openable) {
        this.rootMenu.$emit('groupClick', this)
      }
    },
    handleHover(event) {
      // console.log(event)
      if (this.routerLink !== '/home') {
        console.log(document.documentElement.clientHeight)
        if (event.clientY >= 433) {
          if (document.documentElement.clientHeight < 860) {
            if (this.$refs && this.$refs.popper) {
              this.$refs.popper.$refs.popper.style.bottom = '20px'
            }
          } else {
            if (this.$refs && this.$refs.popper) {
              this.$refs.popper.$refs.popper.style.bottom = 'unset'
            }
          }
        }
        if (this.$refs && this.$refs.popper) {
          let menu = this.menus.filter(item => {
            return item.url === this.routerLink
          })
          if (menu.length > 0 && !menu[0].noPopper) {
            this.$refs.popper && this.$refs.popper.doShow()
          }
        }
      }
    },
    handleLeave() {
      this.$refs.popper && this.$refs.popper.doClose()
    },
    onToRoute(url, event, secUrl) {
      event.stopPropagation()
      this.$refs.popper && this.$refs.popper.doClose()
      console.log(url)
      if (url.indexOf('thirdReport') >= 0) {
        // if (url === '/thirdReport1') {
        //   this.$router.push({name: 'thirdReport', query: { url: 'http://www.baidu.com' }})
        // } else {
        //   this.$router.push({name: 'thirdReport', query: { url: secUrl }})
        // }
        this.$router.push({name: 'thirdReport', query: { url: secUrl }})
        // this.$router.push('/thirdReport?url={0}'.format(secUrl))
      } else {
        this.$router.push(url, () => {
          this.rootMenu.open = false
          this.rootMenu.doOpen(false)
        })
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~styles/var.scss';
  .qf-nav-group {
    overflow: hidden;
    width: 56px;
    height: 76px;
    line-height: 76px;
    font-size: 14px;
    transition: width .2s;
    cursor: pointer;
    .menu-popper {
      left: 56px;
      padding-left: 0;
      padding-right: 0;
      .ul-item {
        list-style: none;
      }
      .ul-title {
        height: 30px;
        padding-left: 12px;
        color: rgba(144, 147, 153, 1)
      }
      .hover-item {
        width: 150px;
        color: rgba(92, 96, 115, 1);
        padding-left: 20px;
        height: 36px;
        line-height: 36px;
        &:hover {
          color: #5084F3;
          background: none;
          border-right: none;;
        }
      }
    }
    .nav-title {
      left: 76px;
      top: 0;
      position: absolute;
    }

    .nav-btn {
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;
      outline: none;
      padding-bottom: 16px;
      .nav-icon {
        width: 100%;
        /*height: 32px;*/
        line-height: 32px;
        /*margin-left: 12px;*/
        text-align: center;
        .bottom-name {
          position: absolute;
          bottom: 9px;
          /* left: 24px; */
          width: 100%;
          text-align: center;
        }
      }

      .qf-icon {
        font-size: 16px;
        line-height: 32px;
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .nav-header-line {
      position: relative;
      height: 58px;
      &::after {
        content: '';
        /*border-bottom: rgba(0, 0, 0, 0.2) 1px solid;*/
        position: absolute;
        bottom: 0;
        left: 12px;
        right: 8px;
      }
    }

    .nav-items {
      position: absolute;
      width: 132px;
      top: 0;
      left: 56px;
      height: 100%;
      overflow: hidden;
      cursor: default;
      background: white;
      color: rgba(92, 96, 115, 1);
      border-right: 1px solid rgb(235, 238, 245);
      /*background-image: linear-gradient(to bottom, #3A3F59, #594A5E);*/

      list-style: none;
      margin: 0;
      padding: 0;

      .group-title {
        height: 36px;
        line-height: 36px;
        padding-left: 12px;
        font-size: 14px;
        color: rgba(144, 147, 153, 1);
      }
    }
    &:hover {
      background: rgba(255, 255, 255, 0.12)
    }

    &.is-home {
      height: 72px;
      line-height: 72px;
    }

    &.is-fixed {
      /*width: 100%;*/

      .nav-title {
        width: 100%;
      }

      &:hover {
        color: #fff;
      }
    }

    & > :not(ul):hover {
      color: #fff;
      .qf-icon {
        color: #fff;
      }
    }

    &.is-selected {
      /*background-color: rgba(255, 255, 255, 0.06);*/
      background-color: $--color-primary;
      & > :not(ul) {
        color: #fff;

        .nav-icon {
        }
        .qf-icon {
          color: #fff;
        }
      }
    }

    .qf-nav-right-in-enter {
      transform: translate(112, 0);
    }

    .qf-nav-right-in-enter-active {
      transition: .2s;
    }

    .qf-nav-select-out-leave-to {
      opacity: 0;
    }

    .qf-nav-select-out-leave-active {
      transition: .2s;
    }

    .qf-nav-fixed-out-leave-to {
      transform: translate(112, 0);
    }

    .qf-nav-fixed-out-leave-active {
      transition: .2s;
    }

  }
</style>
