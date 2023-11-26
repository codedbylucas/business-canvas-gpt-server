export interface AddRandomUserRes {
  id: string
  userName: string
  token: string
}

export interface AddRandomUser {
  perform: () => Promise<AddRandomUserRes>
}
