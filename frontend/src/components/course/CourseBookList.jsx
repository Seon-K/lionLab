import EmptyState from '../common/EmptyState'
import BookCard from '../book/BookCard'

function CourseBookList({ listings = [] }) {
  if (listings.length === 0) {
    return <EmptyState title="연결된 교재가 없습니다." description="다른 학과 필터를 선택해 보세요." />
  }

  return (
    <div className="book-grid course-book-list">
      {listings.map((listing) => (
        <BookCard key={listing.id} book={listing.book} listing={listing} />
      ))}
    </div>
  )
}

export default CourseBookList
