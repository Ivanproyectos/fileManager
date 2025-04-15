import { formatISO, parse, format } from 'date-fns'

export const convertDateToLocaleString = (isoDate: string): string => {
  const date = new Date(isoDate)

  const friendlyDateWithTime = date.toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: 'numeric',
    //  minute: 'numeric',
    //  second: 'numeric',
    hour12: false, // Usar formato de 24 horas
  })
  return friendlyDateWithTime
}

export const convertDateStringToIso = (dateString?: string | null): string => {
  if (dateString) return formatISO(parse(dateString, 'dd/MM/yyyy', new Date()))
  return ''
}

export const convertIsoDateToString = (isoDate: string): string => {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  return format(date, 'dd/MM/yyyy')
}
