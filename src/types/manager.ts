export interface managerList{
  limit: number
  keyword: string
}

export interface roles {
  id: number,
  name: string
}

export interface rowList {
  id: number,
  status: number,
  statusLoading: boolean,
  super: number
}

export interface createUser{
  username: string,
  password: string,
  role_id: number | null ,
  status: number,
  avatar: string,
}

export interface updateUser {
  avatar: string,
  create_time: string,
  id: number,
  role?: Array<{id: number, name: string}>,
  role_id: number,
  status: number,
  super: number,
  update_time: string,
  username: string
}
