import moment from 'moment'

export function formatDate (input) {
  const date = moment(input)
  if (date.year() !== new Date().getFullYear()) {
    return moment(input).format('M/D/YY h:mma')
  }
  return moment(input).format('M/D h:mma')
}
