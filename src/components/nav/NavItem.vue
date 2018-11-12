<template>
  <li class="qf-nav-item" :class="[selected ? 'is-current' : '']"
      @click.stop.prevent="handleClick">
    <slot name="icon"></slot>
    <span class="qf-nav-item-title">
      <slot></slot>
    </span>
  </li>
</template>

<script>
export default {
  inject: ['rootMenu', 'groupMenu'],
  props: {
    routerLink: String,
    secRouteUrl: String
  },
  data() {
    return {
      selected: false
    }
  },
  created() {
    this.groupMenu.addItem(this)
  },
  mounted() {
    console.log(this.secRouteUrl)
  },
  beforeDestroy() {
    this.groupMenu.removeItem(this)
  },
  methods: {
    handleClick() {
      this.rootMenu.$emit('itemClick', this)
      if (this.routerLink) {
        if (this.routerLink.indexOf('thirdReport') >= 0) {
          this.$router.push({name: 'thirdReport', query: { url: this.secRouteUrl }})
          // this.$router.push('/thirdReport?url={0}'.format(this.secRouteUrl))
        } else {
          this.$router.push(this.routerLink)
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .qf-nav-item {
    height: 36px;
    width: 100%;
    line-height: 36px;
    padding-left: 20px;
    padding-right: 0px;
    font-size: 13px;
    cursor: pointer;

    &.is-current {
      background: rgba(235, 238, 245, 1);
      color: black;
      border-right: 3px solid #5084F3;
      &:hover {
        background: rgba(235, 238, 245, 1);
        color: black;
        border-right: 3px solid #5084F3;
        font-weight: bold;
      }
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.06);
      /*font-weight: bold;*/
      color: #5084F3;
      border-right: none
    }
  }
</style>
