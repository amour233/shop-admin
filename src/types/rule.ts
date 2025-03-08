export interface ruleMenus {
  child: Array<ruleMenus>,
  id: number
  rule_id: number,
  status: number,
  menu: number,
  name: string,
  condition: string,
  method: string,
  order: number,
  icon: string,
  frontpath: string,
  statusLoading: boolean
}

export interface createRule {
  rule_id: number,
  status: number,
  menu: number,
  name: string,
  condition: string,
  method: string,
  order: number,
  icon: string,
  frontpath: string
}
