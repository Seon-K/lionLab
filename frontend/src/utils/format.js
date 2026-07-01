export function formatPrice(price) {
  return `${Number(price || 0).toLocaleString('ko-KR')}원`
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function calculateDiscount(basePrice, usedPrice) {
  const base = Number(basePrice)
  const used = Number(usedPrice)
  if (!base || !used || used >= base) return 0
  return Number((((base - used) / base) * 100).toFixed(1))
}
