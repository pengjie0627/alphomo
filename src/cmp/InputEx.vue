<template>
    <span class="text-input" @click="onClick">
        <template v-if="!showInput">{{value}}</template>
        <qf-input v-if="showInput" select-onfocus @blur="onBlur" ref="input" @change="onChange" :value="value"
                  v-bind="$props"></qf-input>
    </span>
</template>

<script lang="ts" src="./inputEx.ts">

</script>

<style lang="scss">
  .text-input {
    .qf-input {
      height: 24px;
    }
  }
</style>
