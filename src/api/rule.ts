import axios from "@/axios"

export function getRuleList() {
  return axios.get(`/admin/rule/1`)
}

export function createRuleList(data: object) {
  return axios.post('/admin/rule', data)
}

export function updateRuleList(id: number,data: object) {
  return axios.post('/admin/rule/' + id, data)
}

export function updateRuleStatus(id: number,status: number) {
  return axios.post(`/admin/rule/${id}/update_status`,{ status })
}

export function deleteRule(id: number) {
  return axios.post('/admin/rule/:id/delete' + id)
}
