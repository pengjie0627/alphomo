import StandardEntity from 'model/entity/StandardEntity'

export default class Menu extends StandardEntity {
  name: Nullable<string>
  code: Nullable<string>
  firName: Nullable<string>
  secName: Nullable<string>
  thirdName: Nullable<string>
  permissions: string[] = []
  icon: Nullable<string>
  home: boolean = false
  upper: Nullable<string>
  sequence: number = 0
  url: Nullable<string>
  secUrl: Nullable<string>
  children: Menu[] = []
  secChildren: Menu[] = []
  thirdChildren: Menu[] = []
}
