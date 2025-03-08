import axios from "@/axios"
import type { rule_ids } from "@/types"

export function getRole(page: number) {
  return axios.get('/admin/role/' + page)
}

export function createRole(data: object) {
  return axios.post('/admin/role', data)
}

export function updateRole(id: number, data: object) {
  return axios.post('/admin/role/' + id, data)
}

export function deleteRole(id: number) {
  return axios.post(`/admin/role/${id}/delete`)
}

export function updateRoleStatus(id: number,status: number) {
  return axios.post(`/admin/role/${id}/update_status`,{ status })
}

export function steRoleRules(id: number, rule_ids: rule_ids) {
  return axios.post(`/admin/role/set_rules`, {id, rule_ids})
}
