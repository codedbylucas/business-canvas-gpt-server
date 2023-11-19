export interface UserBusinessCanvasSummaryRepo {
  id: string
  name: string
  createdAt: Date
}

export interface FetchAllBusinessCanvasByUserIdRepo {
  fetchByUserId: (userId: string) => Promise<UserBusinessCanvasSummaryRepo[]>
}
