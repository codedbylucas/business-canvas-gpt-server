export interface UserBusinessCanvasSummaryRepo {
  id: string
  name: string
  createdAt: Date
}

export interface FetchAllBusinessCanvasByUserIdRepo {
  fetchAllByUserId: (userId: string) => Promise<UserBusinessCanvasSummaryRepo[]>
}
