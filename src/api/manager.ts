import axios from '@/axios'
import type { managerList } from '@/types'

export function login(username: string, password: string){
  return axios.post('/admin/login',{
    username,
    password
  })
}

export function getInfo(){
  return axios.post('/admin/getinfo')
}

export function logout(){
  return axios.post('/admin/logout')
}

export function updatePassword(data: object){
  return axios.post('/admin/updatepassword', data)
}

export function getManagerList(page: number, query: managerList ) {
  const q:Array<string> = []
  Object.entries(query).forEach(([key, value]) => {
    q.push(`${key}=${encodeURIComponent(value)}`);
  });
  let r = q.join('&')
  r = r ? '?' + r : ''
  return axios.get(`/admin/manager/${page}${r}`)
}

export function updateManagerStatus(id: number, status: number) {
  return axios.post(`/admin/manager/${id}/update_status`, { status})
}

export function createManager(data: object) {
  return axios.post(`/admin/manager`, data)
}

export function updateManager(id: number, data: object) {
  return axios.post(`/admin/manager/${id}`, data)
}

export function deleteManager(id: number) {
  return axios.post(`/admin/manager/${id}/delete`)
}
