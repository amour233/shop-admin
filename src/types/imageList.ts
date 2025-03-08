export interface nameList {
  name: string
  id: number
  order: number
}

export interface imageList {
  url: string
  name?: string
  id: number
  checked?: boolean
}

export interface changeNameResponse {
  value: string
}
