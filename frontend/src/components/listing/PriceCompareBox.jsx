import { formatPrice } from '../../utils/format'

function PriceCompareBox({ listing }) {
  return (
    <aside className="price-panel">
      <span className="panel-label">판매 가격</span>
      <strong>{formatPrice(listing.used_price)}</strong>
      <p>
        정가 대비 {listing.discount_from_original}% 할인 · 현재 판매가 대비{' '}
        {listing.discount_from_sale}% 할인
      </p>
    </aside>
  )
}

export default PriceCompareBox

