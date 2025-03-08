import axios from "@/axios"

export function getNotice(page: number) {
  return axios.get('/admin/notice/' + page)
}

export function createNotice(data: object) {
  return axios.post('/admin/notice', data)
}

export function updateNotice(id: number, data: object) {
  return axios.post('/admin/notice/' + id, data)
}

export function deleteNotice(id: number) {
  return axios.post(`/admin/notice/${id}/delete`)
}
