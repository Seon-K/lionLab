import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/format'

function BookCard({ book, listing, variant = 'grid' }) {
  const price = listing?.used_price ?? book.sale_price
  const cardContent = (
    <>
      <div className="book-thumb">
        <img src={book.cover_image} alt={`${book.title} 표지`} />
        {listing?.status && <span>{listing.status}</span>}
      </div>
      <div className="book-card-body">
        <strong>{book.title}</strong>
        <p>{book.author}</p>
        <small>{book.publisher}</small>
        <div className="card-price">
          <b>{formatPrice(price)}</b>
          <em>{formatPrice(book.original_price)}</em>
        </div>
      </div>
      {listing && <span className="card-link-text">상세 보기</span>}
    </>
  )

  if (listing) {
    return (
      <Link className={`book-card book-card-${variant} clickable-card`} to={`/listings/${listing.id}`}>
        {cardContent}
      </Link>
    )
  }

  return <article className={`book-card book-card-${variant}`}>{cardContent}</article>
}

export default BookCard
