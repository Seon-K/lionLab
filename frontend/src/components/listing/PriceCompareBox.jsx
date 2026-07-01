import { useState } from 'react'
import { formatPrice } from '../../utils/format'
import Button from '../common/Button'

function PriceCompareBox({ listing }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [message, setMessage] = useState('')

  const handleContact = () => {
    setMessage(`${listing.seller_name}님에게 문의 요청을 보낼 준비가 되었습니다.`)
  }

  return (
    <aside className="price-panel">
      <span className="panel-label">판매 가격</span>
      <strong>{formatPrice(listing.used_price)}</strong>
      <p>
        정가 대비 {listing.discount_from_original}% 할인 · 현재 판매가 대비{' '}
        {listing.discount_from_sale}% 할인
      </p>
      <Button className="wide-button" onClick={handleContact}>판매자에게 문의하기</Button>
      <button className="bookmark-button" type="button" onClick={() => setIsBookmarked((value) => !value)}>
        {isBookmarked ? '관심 등록됨' : '관심 등록'}
      </button>
      {message && <p className="action-feedback">{message}</p>}
    </aside>
  )
}

export default PriceCompareBox
