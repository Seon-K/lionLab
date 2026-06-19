import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchBooks } from '../api/bookApi'
import BookCard from '../components/book/BookCard'
import BookSearch from '../components/book/BookSearch'
import EmptyState from '../components/common/EmptyState'
import ListingFilter from '../components/listing/ListingFilter'

function BookSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [results, setResults] = useState([])

  useEffect(() => {
    searchBooks(query).then(setResults)
  }, [query])

  const handleSubmit = (event) => {
    event.preventDefault()
    setSearchParams(query ? { q: query } : {})
  }

  return (
    <main className="page">
      <section className="search-result-head">
        <h1>검색 결과</h1>
        <BookSearch query={query} onQueryChange={setQuery} onSubmit={handleSubmit} compact />
        <ListingFilter filters={['전체', '판매중', '예약중', '상태 좋음', '가격 낮은순']} onChange={() => {}} />
      </section>

      {results.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="search-grid">
          {results.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </section>
      )}

      <nav className="pagination" aria-label="검색 결과 페이지">
        <button type="button">‹</button>
        <button className="active" type="button">1</button>
        <button type="button">2</button>
        <button type="button">3</button>
        <button type="button">›</button>
      </nav>
    </main>
  )
}

export default BookSearchPage
