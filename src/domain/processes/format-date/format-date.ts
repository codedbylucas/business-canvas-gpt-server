export type FormattedDate = `${number}/${number}/${number}`

export class FormatDate {
  static execute (date: Date): FormattedDate {
    const padTwoDigits = (num: number): string => String(num).padStart(2, '0')
    const day = padTwoDigits(date.getDate())
    const month = padTwoDigits(date.getMonth() + 1)
    const year = padTwoDigits(date.getFullYear())
    return `${day}/${month}/${year}` as FormattedDate
  }
}
