<template>
  <div class="inventory-view-title">

    <qf-row>
      <qf-col :span="8">
        <div class="font-tips">
          <label>单号: </label>
          <label>{{billNum}}</label>
        </div>
      </qf-col>
      <qf-col :span="8">
        <div class="header">
          <span class="header-text">{{title}}</span>
          <qf-tag type="warning" class="ml15" v-if="receipt.status=='UNAUDITED'">{{receipt.status | statusFormatter}}
          </qf-tag>
          <qf-tag type="success" class="ml15" v-if="receipt.status=='AUDITED'">{{receipt.status | statusFormatter}}
          </qf-tag>
          <qf-tag type="err" class="ml15" v-if="receipt.status=='ABOLISHED'">{{receipt.status | statusFormatter}}
          </qf-tag>
          <qf-tag class="ml15" type="success" v-if="receipt.settleStatus=='SETTLED'">{{receipt.settleStatus |
            settleFormatter}}
          </qf-tag>
          <qf-tag class="ml15" type="err" v-if="receipt.settleStatus=='PART_SETTLED'">{{receipt.settleStatus |
            settleFormatter}}
          </qf-tag>
        </div>
      </qf-col>
      <qf-col :span="8">
        <div class="header-actions" v-if="isView">
          <qf-button @click="prev">上一单</qf-button>
          <qf-button @click="next">下一单</qf-button>
        </div>
      </qf-col>
    </qf-row>
  </div>
</template>

<script lang="ts" src="./ViewTitle.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-view-title {

    .qf-row {
      align-items: center;
    }

    .font-tips {
      color: $--color-placeholder;
    }

    .header {
      text-align: center;

      .header-text {
        font-size: 20px;
      }

    }

    .header-actions {
      float: right;
    }

  }
</style>
