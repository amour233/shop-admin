import axios from "@/axios";

export function getImageList(id: number,page: number) {
  return axios.get(`/admin/image_class/${id}/image/${page}`)
}

export function updateImage(id: number, name : string) {
  return axios.post(`/admin/image/${id}`, { name })
}

export function deleteImage(ids: Array<number>) {
  return axios.post(`/admin/image/delete_all`, { ids })
}

export const upLoadImageAction = '/api/admin/image/upload'
