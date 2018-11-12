<template>
  <qf-popper :trigger="trigger" :placement="placement" ref="popper" :reference="reference" :preventOverflow="preventOverflow"
             :popper-class="['qf-tooltip', type ? `qf-tooltip-${type}` : '']" appendToBody :open-delay=0 :close-delay=0 :transition="''">
    <span v-html="content" v-if="content"></span>
    <template slot="reference">
      <slot></slot>
    </template>
  </qf-popper>
</template>

<script>
import QfPopper from './Popper.vue'

export default {
  name: 'QfTooltip',
  components: {
    QfPopper
  },
  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    placement: {
      type: String
    },
    type: {
      type: String,
      default: 'warning'
    },
    content: {
      type: String,
      default: 'message'
    },
    autoClose: {
      type: Boolean,
      default: false
    },
    preventOverflow: {
      type: Boolean,
      default: true
    },
    reference: {}
  },
  methods: {
    destroyElement() {
      this.$destroy(true)
      if (this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    },

    show() {
      this.$refs.popper.doShow()
      if (this.autoClose) {
        this.timer = setTimeout(() => {
          this.close()
        }, 3000)
      }
    },

    close() {
      clearTimeout(this.timer)
      this.$refs.popper.doClose()
      this.destroyElement()
    }
  }
}
</script>

<style lang="scss">
  @import '~styles/base.scss';

  .qf-tooltip {
    &.qf-popper {
      background-color: $--color-primary !important;
      border: 1px solid $--color-primary;
      color: #fff;
      font-size: 13px;
      min-height: 32px;
      max-width: 200px;
      padding: 6px 16px;
      border-radius: 3px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }

    &.qf-popper[x-placement^=right] {
      background-color: white;
      .popper__arrow {
        border-right-color: $--color-primary;
        &::after {
          border-right-color: $--color-primary;
        }
      }
    }

    &.qf-popper[x-placement^=left] {
      background-color: white;
      .popper__arrow {
        border-left-color: $--color-primary;
        &::after {
          border-left-color: $--color-primary;
        }
      }
    }

    &.qf-popper[x-placement^=top] {
      background-color: white;
      .popper__arrow {
        border-top-color: $--color-primary;
        &::after {
          border-top-color: $--color-primary;
        }
      }
    }

    &.qf-popper[x-placement^=bottom] {
      background-color: white;
      .popper__arrow {
        border-bottom-color: $--color-primary;
        &::after {
          border-bottom-color: $--color-primary;
        }
      }
    }

    &.qf-popper.qf-tooltip-warning {
      background-color: $--color-warning-bg !important;
      border: 1px solid $--color-warning-border;
      color: $--color-warning;

      &.qf-popper[x-placement^=right] {
        margin-left: 10px;
        .popper__arrow {
          border-right-color: $--color-warning-border;
          &::after {
            border-right-color: $--color-warning-bg;
          }
        }
      }

      &.qf-popper[x-placement^=left] {
        background-color: white;
        margin-right: 10px;
        .popper__arrow {
          border-left-color: $--color-warning-border;
          &::after {
            border-left-color: $--color-warning-bg;
          }
        }
      }

      &.qf-popper[x-placement^=top] {
        background-color: white;
        margin-bottom: 10px;
        .popper__arrow {
          border-top-color: $--color-warning-border;
          &::after {
            border-top-color: $--color-warning-bg;
          }
        }
      }

      &.qf-popper[x-placement^=bottom] {
        background-color: white;
        margin-top: 10px;
        .popper__arrow {
          border-bottom-color: $--color-warning-border;
          &::after {
            border-bottom-color: $--color-warning-bg;
          }
        }
      }
    }

  }
</style>
