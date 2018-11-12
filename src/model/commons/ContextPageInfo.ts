import QueryParam from 'model/request/QueryParam'

export default class ContextPageInfo {
  id: Nullable<string>
  ids: string[] = []
  query: Nullable<QueryParam>
}
