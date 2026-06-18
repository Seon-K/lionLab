import { formatPrice } from '../../utils/format'
import Button from '../common/Button'

function PriceCompareBox({ listing }) {
  return (
    <aside className="price-panel">
      <span className="panel-label">판매 가격</span>
      <strong>{formatPrice(listing.used_price)}</strong>
      <p>
        정가 대비 {listing.discount_from_original}% 할인 · 현재 판매가 대비{' '}
        {listing.discount_from_sale}% 할인
      </p>
      <Button className="wide-button">판매자에게 문의하기</Button>
      <button className="bookmark-button" type="button">
        관심 등록
      </button>
    </aside>
  )
}

export default PriceCompareBox
