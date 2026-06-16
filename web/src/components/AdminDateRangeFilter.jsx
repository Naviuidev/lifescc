import { useMemo } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, startOfMonth, subDays } from 'date-fns'
import 'react-day-picker/style.css'
import './AdminDateRangeFilter.css'

function parseYMD(s) {
  if (!s || typeof s !== 'string') return undefined
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim())
  if (!m) return undefined
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  return new Date(y, mo, d, 12, 0, 0, 0)
}

function toYMD(date) {
  if (!date || Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const mo = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${mo}-${d}`
}

/**
 * Calendar + presets for admin table date range (yyyy-mm-dd strings).
 */
export default function AdminDateRangeFilter({ title, dateFrom, dateTo, onChange }) {
  const selected = useMemo(() => {
    const from = parseYMD(dateFrom)
    const to = parseYMD(dateTo)
    if (!from && !to) return undefined
    return { from, to }
  }, [dateFrom, dateTo])

  const defaultMonth = selected?.from ?? selected?.to ?? new Date()

  const setToday = () => {
    const t = format(new Date(), 'yyyy-MM-dd')
    onChange({ dateFrom: t, dateTo: t })
  }

  const setLast7Days = () => {
    const to = format(new Date(), 'yyyy-MM-dd')
    const from = format(subDays(new Date(), 6), 'yyyy-MM-dd')
    onChange({ dateFrom: from, dateTo: to })
  }

  const setThisMonth = () => {
    const now = new Date()
    const from = format(startOfMonth(now), 'yyyy-MM-dd')
    const to = format(now, 'yyyy-MM-dd')
    onChange({ dateFrom: from, dateTo: to })
  }

  const clear = () => onChange({ dateFrom: '', dateTo: '' })

  return (
    <div className="admin-date-range-filter">
      {title ? <p className="admin-slots__filter-title">{title}</p> : null}

      <div className="admin-date-range-filter__presets" role="group" aria-label="Quick date ranges">
        <button type="button" className="admin-date-range-filter__preset" onClick={setToday}>
          Today
        </button>
        <button type="button" className="admin-date-range-filter__preset" onClick={setLast7Days}>
          7 days
        </button>
        <button type="button" className="admin-date-range-filter__preset" onClick={setThisMonth}>
          Month
        </button>
      </div>

      <DayPicker
        mode="range"
        className="admin-day-picker"
        selected={selected}
        defaultMonth={defaultMonth}
        onSelect={(range) => {
          if (!range) {
            clear()
            return
          }
          onChange({
            dateFrom: range.from ? toYMD(range.from) : '',
            dateTo: range.to ? toYMD(range.to) : '',
          })
        }}
        numberOfMonths={1}
      />

      {(dateFrom || dateTo) && (
        <p className="admin-date-range-filter__hint" aria-live="polite">
          {dateFrom === dateTo && dateFrom
            ? dateFrom
            : [dateFrom || '…', dateTo || '…'].filter(Boolean).join(' → ')}
        </p>
      )}

      <button type="button" className="btn btn-link btn-sm p-0 admin-slots__filter-clear" onClick={clear}>
        Clear dates
      </button>
    </div>
  )
}
