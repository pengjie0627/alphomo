export default class BatchResult {
  // 成功条数
  successCount: number = 0
  // 失败条数
  failCount: number = 0
  // 忽略条数（重复或其他原因）
  ignoreCount: number = 0
  records: number = 0
  caption: Nullable<string>
  messages: string[] = []
}
