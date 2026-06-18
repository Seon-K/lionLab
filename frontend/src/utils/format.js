export function formatPrice(price) {
  return `${Number(price).toLocaleString('ko-KR')}원`
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
