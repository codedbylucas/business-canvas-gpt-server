export interface AddRandomUserRes {
  id: string
  token: string
}

export interface AddRandomUser {
  perform: () => Promise<AddRandomUserRes>
}
