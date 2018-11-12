<template>
  <qf-dialog-def class="excel-import" :title="title" :showCancel="showCancel"
                 :confirmText="confirmText" :cancelText="cancelText" @cancel="doCancel"
                 @confirm="doConfirm"
                 :showConfirm="showConfirmBtn">
    <!-- 第一步 -->
    <div v-if="step==='step1'" class="import-content">
      <div class="excel-import-file">
        <!--选择文件-->
        <qf-button type="primary" @click="doUploadFile()" v-form:file=validatorFile>
          选择文件
        </qf-button>
        <input type="file" class="hidden-input" id="fileInput" ref="fileInput" @change="changeImportFile"
        />
        <div class="excel-template">
          <!--点击下载-->
          <qf-button @click="doDownloadTemplate">下载模板</qf-button>
        </div>
      </div>
      <div class="excel-import-description">
        <div class="import-result-title">导入说明</div>
        <ol type="1">
          <li v-for="(text,index) in description" :key="index">
            {{ text }}
          </li>
        </ol>
      </div>
    </div>

    <!-- 第二步 -->
    <div v-if="step==='step2'" class="import-content">
      <div class="excel-import-match">
        <!--上传文件名-->
        <div class="upload-file-name">您已上传文件{{fileName}}</div>
        <!--匹配列-->
        <div class="excel-match-list">

          <div class="match-tips">
            <qf-tip class="tip"><p>文件中的商品属性名称可能与系统中对应表述有区别,请帮助我们一一对应准确识别</p></qf-tip>
          </div>
          <div class="excel-match-table">
            <div v-for="(match, index) in fields" :key="index">
              <qf-form-item :label="match.text" labelWidth="150px" :required="match.require" v-form:match=validator>
                <qf-select v-model="match.value">
                  <qf-option v-for="item in fieldDate" :key="item.key" :label="item.columnName"
                             :value="item.key"></qf-option>
                </qf-select>
              </qf-form-item>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--第三步-->
    <div v-if="step=='step3'" class="import-content">
      <div v-if="!showCancel" class="import-progress">
        <div>{{fileName}}</div>
        <qf-progress :percentage="percentage" color="#5090f0"></qf-progress>
      </div>
      <div v-if="showCancel" class="import-progress">确定要取消导入吗？取消导入不影响已成功导入的数据</div>
      <div v-if="!showCancel" class="import-result"></div>
    </div>

    <!-- 第四部 -->
    <div v-if="step==='step4'" class="import-content">
      <div class="import-progress">
        <div>{{fileName}}</div>
        <div class="import-progress-success">
          <qf-progress :percentage="100" color="#64c73e"></qf-progress>
        </div>
      </div>
      <div class="import-result">
        <div class="import-result-title">导入结果</div>
        <ol>
          <li>成功<span class="success-num">{{successNum}}</span>条</li>
          <li>失败<span class="error-num">{{stopNum}}</span>条</li>
        </ol>
      </div>
    </div>

    <div v-if="step === 'step5'" class="import-content">
      <p>{{importError}}</p>
    </div>

  </qf-dialog-def>
</template>

<script lang="ts" src="./ExcelImport.ts"/>

<style lang="scss">
  $--color-border-light-1: #ccc;
  $--color-success: #0099ff;
  $--color-error: #ff6655;
  .excel-import {
    font-size: 14px;
    .import-content {
      min-width: 450px;
      padding-top: 20px;
      max-height: 550px;
      max-width: 650px;
      overflow-y: auto;
      .import-result-title {
        font-weight: bold;
        padding: 10px 0;
      }
      .excel-import-description {
        ol {
          li {
            margin-left: 15px;
          }
        }
      }
      .excel-import-file {
        padding-bottom: 20px;
        border-bottom: 1px dashed $--color-border-light-1;
        .hidden-input {
          display: none
        }
        .excel-template {
          float: right;
        }
      }
      .excel-import-match {
        .upload-file-name {
          text-align: center;
        }
        .excel-match-list {
          .match-tips {
            text-align: center;
            margin-top: 10px;
          }
          .excel-match-table {
            padding-top: 10px;
            .text-right {
              width: 40%;
              text-align: right;
            }
          }
        }
      }
      .import-progress {
        padding-bottom: 20px;
        border-bottom: 1px dashed $--color-border-light-1;
      }
      .import-result {
        min-height: 100px;
        ol {
          li {
            margin-left: 15px;
            .success-num {
              color: $--color-success;
            }
            .error-num {
              color: $--color-error;
            }
          }
        }
      }
    }
  }
</style>
