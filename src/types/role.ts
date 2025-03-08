export interface rule_ids {
  id: number
  pivot: {
    id: number,
    role_id: number,
    rule_id: number
  }
}

export interface roleList {
  id: number
  status: number
  create_time: string
  update_time: string
  name: string
  desc: string
  rules: Array<rule_ids>,
  statusLoading: boolean
}

export interface checkedList {
  checkedKeys: Array<number>,
  halfCheckedKeys: Array<number>
}
