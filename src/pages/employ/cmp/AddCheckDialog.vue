<template>
  <div class="add-check-dialog-view">
    <qf-dialog-def class="dialog-body-wrap" confirmText="续订" title="提醒" @cancel="doCancel" @confirm="doConfirm">
      <section class="dialog-content">
        <p>当前员工上限：<span class="num">0</span>个</p>
        <p>员工数量已达上限，您可以删除员工或通过续订增加员工上限</p>
      </section>
    </qf-dialog-def>
  </div>
</template>
<script lang="ts" src='./AddCheckDialog.ts'></script>
<style lang="scss">
  .add-check-dialog-view {
    .dialog-content{
      padding-top: 30px;
      padding-bottom: 30px;
      p{
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        line-height: 28px;
        &:first-child{
          margin-bottom: 10px;
        }
      }
      .num{
        color: #FE514D;
      }
    }
  }
</style>
