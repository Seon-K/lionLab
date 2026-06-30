import BookCard from '../book/BookCard'
import { listings } from '../../api/mockData'

function CourseBookList({ books }) {
  const listingByBookId = new Map(listings.map((listing) => [listing.book.id, listing]))

  return (
    <div className="book-grid course-book-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} listing={listingByBookId.get(book.id)} />
      ))}
    </div>
  )
}

export default CourseBookList
