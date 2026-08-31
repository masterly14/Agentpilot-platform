import { addBookingMonths, toBookingDate } from "@/lib/booking/config"
import { isBookableDay, isMonthInBookingWindow } from "@/lib/booking/rules"

export type CalendarCell = {
  year: number
  month: number
  day: number
  isOutside: boolean
}

export function buildMonthWeeks(year: number, month: number): CalendarCell[][] {
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const previous = addBookingMonths(year, month, -1)
  const next = addBookingMonths(year, month, 1)
  const daysInPrevious = new Date(previous.year, previous.month, 0).getDate()

  const cells: CalendarCell[] = []

  for (let offset = firstWeekday; offset > 0; offset--) {
    cells.push({
      year: previous.year,
      month: previous.month,
      day: daysInPrevious - offset + 1,
      isOutside: true,
    })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ year, month, day, isOutside: false })
  }

  let nextDay = 1
  while (cells.length % 7 !== 0) {
    cells.push({
      year: next.year,
      month: next.month,
      day: nextDay,
      isOutside: true,
    })
    nextDay += 1
  }

  const weeks: CalendarCell[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }
  return weeks
}

export function isSameCalendarDate(
  a: Pick<CalendarCell, "year" | "month" | "day"> | null,
  b: Pick<CalendarCell, "year" | "month" | "day">,
) {
  return Boolean(a && a.year === b.year && a.month === b.month && a.day === b.day)
}

export function isCalendarCellUnavailable(
  cell: CalendarCell,
  current: { year: number; month: number },
  unavailableDays: Set<number>,
) {
  if (!isMonthInBookingWindow(cell.year, cell.month, current.year, current.month)) {
    return true
  }
  if (cell.isOutside) {
    return !isBookableDay(toBookingDate(cell.year, cell.month, cell.day))
  }
  return unavailableDays.has(cell.day)
}
