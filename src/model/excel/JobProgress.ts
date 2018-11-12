export default class JobProgress {
  static JOB_RESULT = 'job_result'

  static JOB_GROUP = 'job_progress'

  static JOB_SUCCESS_COUNT = 'successCount'

  static JOB_FAIL_COUNT = 'failCount'

  static JOB_IGNORE_COUNT = 'ignoreCount'

  minimum: number = 0
  maximum: number = 0
  position: number = 0
  percent: number = 0
  lastMessage: Nullable<string>
  started: boolean = false
  finished: boolean = false
  success: boolean = false
  result: any
  successCount: number = 0
  failCount: number = 0
  ignoreCount: number = 0
}
