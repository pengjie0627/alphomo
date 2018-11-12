<template>
  <div class="sell-rpt-list-search">
    <qf-row>
      <qf-col :span="15">
        <qf-form-item label="业务日期">
          <qf-date-picker v-model="businessDate" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期"></qf-date-picker>
        </qf-form-item>
      </qf-col>
      <qf-col :span="1"></qf-col>
      <qf-col :span="8">
        <qf-radio-group v-model="businessTime" @input="changeTime">
          <qf-radio-button label="今天"></qf-radio-button>
          <qf-radio-button label="昨天"></qf-radio-button>
          <qf-radio-button label="本周"></qf-radio-button>
          <qf-radio-button label="本月"></qf-radio-button>
          <qf-radio-button label="全部"></qf-radio-button>
        </qf-radio-group>
      </qf-col>
    </qf-row>
  </div>
</template>


<script lang="ts" src="./SellRptListSearch.ts"></script>

<style lang="scss">
  .sell-rpt-list-search {

    background-color: white;

  .qf-row {
    margin: 8px auto;
  }

  .qf-input {
    width: 80%;
  }

  .qf-form-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  }
</style>
