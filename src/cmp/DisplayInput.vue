<template>
  <div :class="[
    type === 'textarea' ? 'qf-textarea' : 'qf-input',
    size ? 'qf-input-' + size : '',
    {
      'is-disabled': inputDisabled,
      'is-focus' : focused
    }
    ]"
       @mouseenter="hovering = true"
       @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <label class="qf-input-label" :style="labelStyles" v-if="label" v-html="label" :for="inputId"></label>
      <slot name="icon"></slot>
      <input
        :id="inputId"
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        :style="inputStyles"
        class="qf-input-inner"
        v-bind="$props"
        :disabled="inputDisabled"
        :autocomplete="autocomplete"
        :value="displayValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
      <qf-font-icon name="ic-ic_clean" v-show="showClear"
                    @click="clear" class="qf-input-clear"></qf-font-icon>
      <slot name="trigger"></slot>
      <div class="qf-input-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="qf-textarea-inner"
      :value="displayValue"
      @input="handleInput"
      ref="textarea"
      v-bind="$props"
      :disabled="inputDisabled"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
  </div>
</template>
<script>
import CommonUtil from 'util/CommonUtil'
import NumberUtil from 'util/NumberUtil'

export default {
  name: 'DisplayInput',
  componentName: 'DisplayInput',
  components: {},
  data() {
    return {
      currentValue: this.value,
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      inputId: null
    }
  },
  props: {
    value: [String, Number, Object],
    placeholder: String,
    resize: String,
    name: String,
    form: String,
    id: String,
    maxlength: Number,
    minlength: Number,
    readonly: Boolean,
    autofocus: Boolean,
    disabled: Boolean,
    selectOnfocus: Boolean,
    align: {
      type: String,
      default: 'left'
    },
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    size: String,
    rows: {
      type: Number,
      default: 2
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    autocorrect: {
      type: String,
      default: 'off'
    },
    max: {},
    min: {},
    step: {},
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    tabindex: String,
    labelWidth: String,
    labelAlign: String,
    scale: Number | String,
    autoFormat: {
      type: Boolean,
      default: true
    },
    regex: String,
    filter: Function,
    display: String
  },
  computed: {

    displayValue() {
      if (this.display && this.value) {
        return this.value[this.display]
      }
      String.format()
      return this.value
    },
    textareaStyle() {
      return CommonUtil.apply({}, this.textareaCalcStyle, { resize: this.resize })
    },
    labelStyles() {
      return {
        width: this.labelWidth,
        textAlign: this.labelAlign
      }
    },
    inputStyles() {
      return {
        textAlign: this.align
      }
    },
    inputDisabled() {
      return this.disabled
    },
    showClear() {
      return this.clearable && this.currentValue !== '' && (this.focused || this.hovering)
    },
    pattern() {
      if (this.regex) {
        if (this.regex instanceof RegExp) {
          return this.regex
        } else if (typeof this.regex === 'string') {
          return new RegExp(this.regex)
        }
      } else if (this.scale !== undefined) {
        return new RegExp('^\\d*\\.?\\d{0,' + this.scale + '}$')
      }
      return null
    }
  },
  watch: {
    'value'(val, oldValue) {
      if (this.focused) {
        this.setCurrentValue(val)
      } else {
        this.formatValue(val)
      }
    }
  },
  methods: {
    focus(caret) {
      let input = this.getInput()
      if (input) {
        input.focus()
        if (caret) {
          this.setSelectionStart(caret.start)
          this.setSelectionEnd(caret.end)
        } else if (!this.selectOnfocus) {
          this.$nextTick(() => {
            this.moveToEnd(input)
          })
        }
      }
    },
    handleBlur(event) {
      this.formatValue(this.currentValue)
      this.focused = false
      this.$emit('blur', event)
    },
    formatValue(value) {
      if (this.scale !== undefined && this.autoFormat && NumberUtil.isNumber(value)) {
        let num = parseFloat(value)
        this.setCurrentValue(num.toFixed(this.scale))
      } else {
        this.setCurrentValue(value)
      }
    },
    inputSelect() {
      let input = this.getInput()
      if (input) {
        input.select()
      }
    },
    getInput() {
      return this.$refs.input || this.$refs.textarea
    },
    handleFocus(event) {
      this.focused = true
      this.$emit('focus', event)
      if (this.selectOnfocus) {
        this.$nextTick(() => {
          this.inputSelect()
        })
      }
    },
    moveToEnd(el) {
      if (typeof el.selectionStart === 'number') {
        el.selectionStart = el.selectionEnd = el.value.length
      } else if (typeof el.createTextRange !== 'undefined') {
        var range = el.createTextRange()
        range.collapse(false)
        range.select()
      }
    },
    handleInput(event) {
      this.doInput(event.target.value)
    },
    doInput(value) {
      var valid = !value || !this.pattern || (this.pattern && this.pattern.test(value))
      if (valid && this.filter && !this.filter(value)) {
        valid = false
      }
      if (!valid) {
        value = this.currentValue || ''
      }
      this.$emit('input', value)
      this.setCurrentValue(value)
      // input.value 和 currentValue不同步
      if (this.getInput().value !== value) {
        this.getInput().value = value
      }
      return valid
    },
    handleChange(event) {
      this.$emit('change', event.target.value)
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return
      this.currentValue = value
    },
    clear() {
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
      this.setCurrentValue('')
      this.focus()
    },
    getSelectionStart() {
      return this.getInput().selectionStart
    },
    setSelectionStart(val) {
      this.getInput().selectionStart = val
    },
    getSelectionEnd() {
      return this.getInput().selectionEnd
    },
    setSelectionEnd(val) {
      this.getInput().selectionEnd = val
    }
  },
  created() {
    this.$on('inputSelect', this.inputSelect)
  },
  mounted() {
    this.inputId = Math.random().toString(36).substring(3, 8)
    this.formatValue(this.currentValue)

    if (this.type === 'number') {
      console.log('禁止使用number类型，请优先考虑text+scale或text+regex实现数字录入')
    }
  }
}
</script>

<style lang="scss">
  @import '~styles/var.scss';

  .qf-textarea {
    display: inline-block;
    width: 100%;
    vertical-align: bottom;
    font-size: 14px;

    .qf-textarea-inner {
      display: block;
      resize: vertical;
      padding: 5px 12px;
      line-height: 1.5;
      box-sizing: border-box;
      width: 100%;
      font-size: inherit;
      background-color: #fff;
      border: 1px solid $--color-border;
      border-radius: 4px;
      transition: border-color .2s cubic-bezier(.645, .045, .355, 1);

      &::placeholder {
        color: $--color-font-light-2;
      }

      &:hover {
        border-color: $--color-focus
      }

      &:focus {
        outline: 0;
        border-color: $--color-focus
      }
    }

    &.is-disabled {
      .qf-textarea-inner {
        background-color: $--color-bg-light;
        border-color: $--color-border-light-1;
        color: $--color-font-light-3;
        cursor: not-allowed;

        &::placeholder {
          color: $--color-font-light-2;
        }
      }
    }
  }

  .qf-input {
    position: relative;
    font-size: 14px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid $--color-border;
    background-color: #fff;
    padding: 0 12px;
    height: 36px;

    .qf-input-label {
      min-width: 40px;
    }

    &.is-focus {
      border-color: $--color-focus
    }

    &:hover {
      border-color: $--color-focus
    }

    .qf-input-inner {
      flex: 1;
      font-size: inherit;
      outline-style: none;
      border: none;
      background-color: transparent;
      box-sizing: border-box;
      height: 100%;
      line-height: 1;
      outline: 0;
      width: 100%;

      &::placeholder {
        color: $--color-placeholder;
      }

      &::-webkit-keygen-select {
        visibility: hidden;
        display: none !important;
        pointer-events: none;
        position: absolute;
        right: 0;
      }
    }

    .qf-input-clear {
      font-size: 14px;
      line-height: 16px;
      margin-left: 4px;
      cursor: pointer;

      &:hover {
        color: #909399
      }
    }

    .qf-input-append {
      line-height: 1;
      margin-right: -12px;
      padding: 0 12px;
    }

    &.is-disabled {
      background-color: $--color-bg;
      &:hover {
        border-color: $--color-border;
      }
    }

    &.qf-input-small {
      height: 32px;
      font-size: 13px;
    }
  }
</style>
