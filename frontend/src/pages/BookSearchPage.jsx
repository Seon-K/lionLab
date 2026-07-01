import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listings } from '../api/mockData'
import { searchBooks } from '../api/bookApi'
import BookCard from '../components/book/BookCard'
import BookSearch from '../components/book/BookSearch'
import EmptyState from '../components/common/EmptyState'

const PAGE_SIZE = 3

function BookSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    searchBooks(query).then((books) => {
      setResults(books)
      setPage(1)
    })
  }, [query])

  const listingByBookId = useMemo(
    () => new Map(listings.map((listing) => [listing.book.id, listing])),
    [],
  )

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pagedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSearchParams(query.trim() ? { q: query } : {})
  }

  const movePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="page all-books-page">
      <section className="search-result-head">
        <div className="page-heading">
          <span>전체 교재</span>
          <h1>등록된 교재를 검색하고 판매글을 확인하세요.</h1>
          <p>메인 검색창에서 넘어온 검색어도 이 페이지에서 이어서 확인할 수 있습니다.</p>
        </div>
        <BookSearch query={query} onQueryChange={setQuery} onSubmit={handleSubmit} compact />
      </section>

      {results.length === 0 ? (
        <EmptyState title="검색 결과가 없습니다." description="책 제목, ISBN, 저자명을 다시 입력해 보세요." />
      ) : (
        <section className="search-grid">
          {pagedResults.map((book) => (
            <BookCard key={book.id} book={book} listing={listingByBookId.get(book.id)} />
          ))}
        </section>
      )}

      {results.length > PAGE_SIZE && (
        <nav className="pagination" aria-label="전체 교재 페이지">
          <button type="button" onClick={() => movePage(page - 1)} disabled={page === 1}>
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={page === pageNumber ? 'active' : ''}
              type="button"
              onClick={() => movePage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button type="button" onClick={() => movePage(page + 1)} disabled={page === pageCount}>
            ›
          </button>
        </nav>
      )}
    </main>
  )
}

export default BookSearchPage
