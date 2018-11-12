<template>
  <span>
    <transition :name="transition" @after-leave="doDestroy">
      <div class="qf-popper" :class="popperClass" v-show="showPopper" :id="tooltipId" ref="popper" v-bind="$props">
        <slot></slot>
      </div>
    </transition>
    <slot name="reference"></slot>
  </span>
</template>
<script>
import { on, off } from 'util/DomUtil'
import CommonUtil from 'util/CommonUtil.js'
import Popper from 'popper.js'
import PopupManager from 'util/PopupManager.js'

export default {
  name: 'QfPopper',
  props: {
    trigger: {
      type: String,
      default: 'focus',
      validator: value => ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
    },
    transformOrigin: {
      type: [Boolean, String],
      default: true
    },
    popperClass: String | Array,
    placement: {
      type: String,
      default: 'bottom'
    },
    preventOverflow: {
      type: Boolean,
      default: true
    },
    reference: {},
    openDelay: {
      type: Number,
      default: 0
    },
    closeDelay: {
      type: Number,
      default: 200
    },
    visibleArrow: {
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    zIndex: Number,
    transition: {
      type: String,
      default: 'qf-fade-in-linear'
    }
  },
  computed: {
    tooltipId() {
      return `qf-popper-${CommonUtil.uuid()}`
    }
  },
  watch: {
    showPopper(val) {
      val ? this.updatePopper() : this.destroyPopper()
      val ? this.$emit('show') : this.$emit('hide')
    }
  },
  data() {
    return {
      appended: false,
      popperJS: null,
      showPopper: false
    }
  },
  mounted() {
    let reference = this.getReference()
    const popper = this.$refs.popper

    // 可访问性
    if (reference) {
      reference.setAttribute('aria-describedby', this.tooltipId)
      // reference.setAttribute('tabindex', 0) // tab序列
      popper.setAttribute('tabindex', 0)
      if (this.trigger !== 'click' && this.trigger !== 'hover') {
        on(reference, 'focusin', this.handleFocus)
        on(popper, 'focusin', this.handleFocus)
        on(reference, 'focusout', this.handleBlur)
        on(popper, 'focusout', this.handleBlur)
      }
      on(reference, 'keydown', this.handleKeydown)
      on(reference, 'click', this.handleClick)
    }
    if (this.trigger === 'click') {
      on(reference, 'click', this.doToggle)
      on(document, 'click', this.handleDocumentClick)
    } else if (this.trigger === 'hover') {
      on(reference, 'mouseenter', this.handleMouseEnter)
      on(popper, 'mouseenter', this.handleMouseEnter)
      on(reference, 'mouseleave', this.handleMouseLeave)
      on(popper, 'mouseleave', this.handleMouseLeave)
    } else if (this.trigger === 'focus') {
      let found = false
      if ([].slice.call(reference.children).length) {
        const children = reference.childNodes
        const len = children.length
        for (let i = 0; i < len; i++) {
          if (children[i].nodeName === 'INPUT' ||
            children[i].nodeName === 'TEXTAREA') {
            on(children[i], 'focusin', this.doShow)
            on(children[i], 'focusout', this.doClose)
            found = true
            break
          }
        }
      }
      if (found) return
      if (reference.nodeName === 'INPUT' ||
        reference.nodeName === 'TEXTAREA') {
        on(reference, 'focusin', this.doShow)
        on(reference, 'focusout', this.doClose)
      } else {
        on(reference, 'mousedown', this.doShow)
        on(reference, 'mouseup', this.doClose)
      }
    }
  },
  methods: {
    doToggle() {
      this.showPopper = !this.showPopper
    },

    doShow() {
      this.showPopper = true
    },

    doClose() {
      this.showPopper = false
    },

    updatePopper() {
      const popperJS = this.popperJS
      if (popperJS) {
        popperJS.update()
        if (popperJS.popper) {
          popperJS.popper.style.zIndex = this.zIndex || PopupManager.nextZIndex()
        }
      } else {
        this.createPopper()
      }
    },

    createPopper() {
      if (this.visibleArrow) this.appendArrow(this.$refs.popper)

      if (this.appendToBody) document.body.appendChild(this.$refs.popper)
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy()
      }
      if (this.getReference()) {
        this.popperJS = new Popper(this.getReference(), this.$refs.popper, {
          modifiers: {
            preventOverflow: {
              enabled: this.preventOverflow
            },
            computeStyle: {
              gpuAcceleration: false
            }
          },
          placement: this.placement,
          onCreate: (data) => {
            // data.instance.popper.style.willChange = ''
            this.$emit('created', this)
            this.resetTransformOrigin()
            this.$nextTick(this.updatePopper)
          },
          onUpdate: (data) => {
            // data.instance.popper.style.willChange = ''
          }
        })
        this.popperJS.popper.style.zIndex = this.zIndex || PopupManager.nextZIndex()
        this.$refs.popper.addEventListener('click', e => e.stopPropagation())
      }
    },

    getReference() {
      let reference = this.reference || this.$refs.reference
      if (!reference && this.$slots.reference && this.$slots.reference[0]) {
        reference = this.$slots.reference[0].elm
      }
      if (!reference) {
        reference = this.$parent.$refs.reference
      }
      return reference
    },

    appendArrow(element) {
      if (this.appended) {
        return
      }

      this.appended = true
      const arrow = document.createElement('div')

      arrow.setAttribute('x-arrow', '')
      arrow.className = 'popper__arrow'
      element.appendChild(arrow)
    },

    doDestroy(forceDestroy) {
      if (!this.popperJS || (this.showPopper && !forceDestroy)) return
      this.popperJS.destroy()
      this.popperJS = null
    },

    destroyPopper() {
      if (this.popperJS) {
        this.resetTransformOrigin()
      }
    },

    resetTransformOrigin() {
      if (!this.transformOrigin) return
      let placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      }
      let placement = this.popperJS.popper.getAttribute('x-placement').split('-')[0]
      let origin = placementMap[placement]
      this.popperJS.popper.style.transformOrigin = typeof this.transformOrigin === 'string'
        ? this.transformOrigin
        : ['top', 'bottom'].indexOf(placement) > -1 ? `center ${origin}` : `${origin} center`
    },

    handleFocus() {
      if (this.trigger !== 'manual') this.showPopper = true
    },

    handleBlur() {
      if (this.trigger !== 'manual') this.showPopper = false
    },

    handleMouseEnter() {
      clearTimeout(this._timer)
      if (this.openDelay) {
        this._timer = setTimeout(() => {
          this.showPopper = true
        }, this.openDelay)
      } else {
        this.showPopper = true
      }
    },

    handleKeydown(ev) {
      if (ev.keyCode === 27 && this.trigger !== 'manual') { // esc
        this.doClose()
      }
    },

    handleMouseLeave() {
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.showPopper = false
      }, this.closeDelay)
    },

    handleDocumentClick(e) {
      let reference = this.getReference()
      const popper = this.popper || this.$refs.popper

      if (!this.$el ||
        !reference ||
        this.$el.contains(e.target) ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target)) return
      this.showPopper = false
    }
  },

  beforeDestroy() {
    this.doDestroy(true)
    const popper = this.popper || this.$refs.popper
    if (popper && popper.parentNode === document.body) {
      document.body.removeChild(popper)
    }
  },

  deactivated() {
    this.doDestroy(true)
  },

  destroyed() {
    const reference = this.reference
    off(reference, 'click', this.doToggle)
    off(reference, 'mouseup', this.doClose)
    off(reference, 'mousedown', this.doShow)
    off(reference, 'focusin', this.doShow)
    off(reference, 'focusout', this.doClose)
    off(reference, 'mouseleave', this.handleMouseLeave)
    off(reference, 'mouseenter', this.handleMouseEnter)
    off(document, 'click', this.handleDocumentClick)
  }
}
</script>

<style lang="scss">
  @import '~styles/var.scss';

  .qf-popper {
    box-sizing: border-box;
    outline: none;
    position: absolute;
    background: #fff;
    border-radius: 4px;
    border: 1px solid $--color-border-light-2;
    padding: 12px;
    z-index: 2000;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.12);

    .popper__arrow,
    .popper__arrow::after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border: solid transparent;
    }

    .popper__arrow {
      border-width: 6px;
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    }

    .popper__arrow::after {
      content: ' ';
      border-width: 6px;
    }
  }

  .qf-popper[x-placement^='top'] {
    margin-bottom: 12px;

    .popper__arrow {
      bottom: -6px;
      left: 50%;
      margin-right: 3px;
      border-top-color: #ebeef5;
      border-bottom-width: 0;

      &::after {
        bottom: 1px;
        margin-left: -6px;
        border-top-color: #fff;
        border-bottom-width: 0;
      }
    }
  }

  .qf-popper[x-placement^='bottom'] {
    margin-top: 12px;

    .popper__arrow {
      top: -6px;
      left: 50%;
      margin-right: 3px;
      border-top-width: 0;
      border-bottom-color: #ebeef5;

      &::after {
        top: 1px;
        margin-left: -6px;
        border-top-width: 0;
        border-bottom-color: #fff;
      }
    }
  }

  .qf-popper[x-placement^='right'] {
    margin-left: 12px;

    .popper__arrow {
      top: 50%;
      left: -6px;
      margin-bottom: 3px;
      border-right-color: #ebeef5;
      border-left-width: 0;

      &::after {
        bottom: -6px;
        left: 1px;
        border-right-color: #fff;
        border-left-width: 0;
      }
    }
  }

  .qf-popper[x-placement^='left'] {
    margin-right: 12px;

    .popper__arrow {
      top: 50%;
      right: -6px;
      margin-bottom: 3px;
      border-right-width: 0;
      border-left-color: #ebeef5;

      &::after {
        right: 1px;
        bottom: -6px;
        margin-left: -6px;
        border-right-width: 0;
        border-left-color: #fff;
      }
    }
  }
</style>
