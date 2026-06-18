import BookCard from '../book/BookCard'

function CourseBookList({ books }) {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

export default CourseBookList
