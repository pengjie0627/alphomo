<template>
  <table slot="total" width="100%">
    <tr>
      <td width="50px">合计</td>
      <td>&nbsp;</td>
      <td width="150px">{{summary.receivedAmount.toString() | fmtThumb }}</td>
      <td width="150px">{{summary.paidAmount.toString() | fmtThumb}}</td>
    </tr>
  </table>
</template>

<script lang="ts" src="./BalanceRptSummary.ts">
</script>

<style lang="scss">
</style>
