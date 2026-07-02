import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteListing, getListing, getListings } from '../api/listingApi'
import BookCard from '../components/book/BookCard'
import Button from '../components/common/Button'
import Loading from '../components/common/Loading'
import PriceCompareBox from '../components/listing/PriceCompareBox'
import { formatDate, formatPrice } from '../utils/format'

function ListingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [related, setRelated] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    getListing(id).then(setListing)
    getListings().then(setRelated)
  }, [id])

  const relatedListings = useMemo(
    () => related.filter((item) => item.id !== Number(id)).slice(0, 4),
    [id, related],
  )

  const handleDelete = async () => {
    const ok = window.confirm('이 판매글을 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.')
    if (!ok) return

    setIsDeleting(true)
    try {
      await deleteListing(id)
      navigate('/listings')
    } finally {
      setIsDeleting(false)
    }
  }
  if (!listing) return <Loading />

  return (
    <main className="page detail-page">
      <section className="detail-grid">
        <div className="detail-content">
          <span className="detail-status">{listing.status}</span>
          <h1>{listing.book.title}</h1>
          <p className="detail-sub">
            {listing.book.author} · {listing.book.publisher} · ISBN {listing.book.isbn}
          </p>

          <div className="detail-book-area">
            <div className="detail-cover">
              <img src={listing.book.cover_image} alt={`${listing.book.title} 표지`} />
            </div>
            <section className="description-card">
              <h2>상세 설명</h2>
              <p>{listing.description}</p>
              <dl>
                <div>
                  <dt>책 상태</dt>
                  <dd>{listing.book_condition}</dd>
                </div>
                <div>
                  <dt>필기 여부</dt>
                  <dd>{listing.has_writing ? '필기 있음' : '필기 없음'}</dd>
                </div>
                <div>
                  <dt>등록일</dt>
                  <dd>{formatDate(listing.created_at)}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>

        <div className="detail-sidebar">
          <PriceCompareBox listing={listing} />
          <section className="seller-card">
            <h2>판매자 정보</h2>
            <div className="seller-profile">
              <span>{listing.seller_name.slice(0, 1)}</span>
              <div>
                <strong>{listing.seller_name}</strong>
                <p>응답 빠름 · 캠퍼스 인증</p>
              </div>
            </div>
            <dl>
              <div>
                <dt>거래 장소</dt>
                <dd>{listing.trade_place}</dd>
              </div>
              <div>
                <dt>정가</dt>
                <dd>{formatPrice(listing.book.original_price)}</dd>
              </div>
            </dl>
            <div className="seller-actions">
              <p>내가 등록한 판매글이라면 이곳에서 삭제할 수 있습니다.</p>
              <Button type="button" variant="danger" className="wide-button" disabled={isDeleting} onClick={handleDelete}>
                {isDeleting ? '삭제 중' : '판매글 삭제'}
              </Button>
            </div>
          </section>
          <section className="map-card" aria-label="거래 위치">
            <span>거래 위치 지도</span>
          </section>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>이 강의의 다른 참고 교재</h2>
        </div>
        <div className="book-grid related-grid">
          {relatedListings.map((item) => (
            <BookCard key={item.id} book={item.book} listing={item} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default ListingDetailPage

