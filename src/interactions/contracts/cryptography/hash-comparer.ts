export interface ComparerDto {
  value: string
  hash: string
}

export interface HashComparer {
  comparer: (dto: ComparerDto) => Promise<boolean>
}
