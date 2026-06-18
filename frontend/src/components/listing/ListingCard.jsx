import BookCard from '../book/BookCard'

function ListingCard({ listing }) {
  return <BookCard book={listing.book} listing={listing} />
}

export default ListingCard
