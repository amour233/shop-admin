import axios from "@/axios";

export function getImageClassList(page: number) {
  return axios.get('/admin/image_class/' + page)
}

export function createImageClass(data: object) {
  return axios.post('/admin/image_class', data)
}

export function updateImageClass(id: number,data: object) {
  return axios.post('/admin/image_class/' + id, data)
}

export function deleteImageClass(id: number) {
  return axios.post(`/admin/image_class/${id}/delete`)
}
