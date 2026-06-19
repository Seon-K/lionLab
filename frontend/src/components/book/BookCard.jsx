import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/format'

function BookCard({ book, listing, variant = 'grid' }) {
  const price = listing?.used_price ?? book.sale_price

  return (
    <article className={`book-card book-card-${variant}`}>
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
      {listing && (
        <Link className="card-link" to={`/listings/${listing.id}`}>
          View Details
        </Link>
      )}
    </article>
  )
}

export default BookCard
