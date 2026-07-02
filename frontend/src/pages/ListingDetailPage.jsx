import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteListing, getListing, getListings } from '../api/listingApi'
import BookCard from '../components/book/BookCard'
import Button from '../components/common/Button'
import Loading from '../components/common/Loading'
import PriceCompareBox from '../components/listing/PriceCompareBox'
import { formatDate, formatPrice } from '../utils/format'
import { removeListingOwner, verifyListingOwner } from '../utils/listingOwnership'
import { getListingPhotos, removeListingPhotos } from '../utils/listingPhotos'

function ListingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [related, setRelated] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  useEffect(() => {
    getListing(id).then((data) => {
      setListing(data)
      setActivePhotoIndex(0)
    })
    getListings().then(setRelated)
  }, [id])

  const relatedListings = useMemo(
    () => related.filter((item) => item.id !== Number(id)).slice(0, 4),
    [id, related],
  )

  const conditionPhotos = useMemo(() => {
    const photos = getListingPhotos(listing)
    if (photos.length > 0) return photos
    if (!listing?.book?.cover_image) return []

    return [
      {
        id: 'book-cover',
        name: '교재 표지',
        src: listing.book.cover_image,
      },
    ]
  }, [listing])

  const activePhoto = conditionPhotos[activePhotoIndex] || conditionPhotos[0]
  const hasMultiplePhotos = conditionPhotos.length > 1

  const movePhoto = (direction) => {
    setActivePhotoIndex((current) => {
      if (conditionPhotos.length === 0) return 0
      return (current + direction + conditionPhotos.length) % conditionPhotos.length
    })
  }

  const handleDelete = async () => {
    const sellerName = window.prompt('판매자 이름을 입력하세요.')
    if (!sellerName) return

    const password = window.prompt('등록할 때 입력한 삭제 비밀번호를 입력하세요.')
    if (!password) return

    if (!verifyListingOwner(id, sellerName, password)) {
      window.alert('판매자 이름 또는 삭제 비밀번호가 일치하지 않습니다.')
      return
    }

    const ok = window.confirm('이 판매글을 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.')
    if (!ok) return

    setIsDeleting(true)
    try {
      await deleteListing(id)
      removeListingOwner(id)
      removeListingPhotos(id)
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
            <div className="detail-photo-viewer">
              <div className="detail-cover">
                {activePhoto && <img src={activePhoto.src} alt={activePhoto.name} />}
                {hasMultiplePhotos && (
                  <>
                    <button
                      type="button"
                      className="photo-nav photo-nav-prev"
                      aria-label="이전 책 상태 사진"
                      onClick={() => movePhoto(-1)}
                    >
                      &lt;
                    </button>
                    <button
                      type="button"
                      className="photo-nav photo-nav-next"
                      aria-label="다음 책 상태 사진"
                      onClick={() => movePhoto(1)}
                    >
                      &gt;
                    </button>
                  </>
                )}
              </div>
              <div className="photo-counter">
                <strong>{activePhoto?.name || '책 상태 사진'}</strong>
                <span>
                  {conditionPhotos.length > 0 ? activePhotoIndex + 1 : 0} / {conditionPhotos.length}
                </span>
              </div>
              {hasMultiplePhotos && (
                <div className="photo-thumb-list" aria-label="책 상태 사진 목록">
                  {conditionPhotos.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      className={index === activePhotoIndex ? 'active' : ''}
                      onClick={() => setActivePhotoIndex(index)}
                    >
                      <img src={photo.src} alt={`${photo.name} 미리보기`} />
                    </button>
                  ))}
                </div>
              )}
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
                <p>{listing.status} · {formatDate(listing.created_at)} 등록</p>
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
              <p>등록할 때 입력한 판매자 이름과 삭제 비밀번호가 일치해야 삭제할 수 있습니다.</p>
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

