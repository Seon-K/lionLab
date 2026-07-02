import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getListings } from '../api/listingApi'
import EmptyState from '../components/common/EmptyState'
import Loading from '../components/common/Loading'
import ListingCard from '../components/listing/ListingCard'

const STATUS_TO_API = {
  전체: '',
  판매중: 'available',
  예약중: 'reserved',
  판매완료: 'done',
}

function getPageSize() {
  if (typeof window === 'undefined') return 8
  if (window.matchMedia('(max-width: 640px)').matches) return 4
  if (window.matchMedia('(max-width: 1024px)').matches) return 6
  return 8
}

function ListingListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [status, setStatus] = useState('전체')
  const [condition, setCondition] = useState('전체')
  const [sort, setSort] = useState('latest')
  const [listings, setListings] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(getPageSize)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const syncPageSize = () => {
      setPageSize(getPageSize())
      setPage(1)
    }
    window.addEventListener('resize', syncPageSize)
    return () => window.removeEventListener('resize', syncPageSize)
  }, [])


  useEffect(() => {
    getListings({
      search: keyword.trim(),
      ordering: sort === 'price-low' ? 'price' : sort === 'price-high' ? '-price' : '-created_at',
    })
      .then((data) => {
        setListings(data.filter((listing) => listing.book))
        setPage(1)
      })
      .finally(() => setIsLoading(false))
  }, [keyword, sort])

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesStatus = status === '전체' || listing.status_code === STATUS_TO_API[status]
      const matchesCondition = condition === '전체' || listing.book_condition.includes(condition)
      return matchesStatus && matchesCondition
    })
  }, [condition, listings, status])


  const pageCount = Math.max(1, Math.ceil(filteredListings.length / pageSize))
  const pagedListings = filteredListings.slice((page - 1) * pageSize, page * pageSize)

  const handleKeywordChange = (event) => {
    const value = event.target.value
    setKeyword(value)
    setSearchParams(value.trim() ? { q: value } : {})
  }

  const movePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="page listing-list-page">
      <div className="page-heading list-heading">
        <div>
          <span>중고 교재 목록</span>
          <h1>필요한 교재를 조건에 맞게 찾아보세요.</h1>
          <p>책 제목, ISBN, 판매 상태, 책 상태, 가격순으로 판매글을 정리할 수 있습니다.</p>
        </div>
        <strong>{filteredListings.length}개</strong>
      </div>

      <section className="list-toolbar" aria-label="판매글 검색 및 필터">
        <label className="list-search">
          검색
          <input
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="책 제목, ISBN, 수업명, 학과 검색"
          />
        </label>
        <label>
          판매 상태
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}>
            <option value="전체">전체</option>
            <option value="판매중">판매중</option>
            <option value="예약중">예약중</option>
            <option value="판매완료">판매완료</option>
          </select>
        </label>
        <label>
          책 상태
          <select value={condition} onChange={(event) => { setCondition(event.target.value); setPage(1) }}>
            <option value="전체">전체</option>
            <option value="상">상</option>
            <option value="중">중</option>
            <option value="하">하</option>
          </select>
        </label>
        <label>
          정렬
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="latest">최신순</option>
            <option value="price-low">가격 낮은순</option>
            <option value="price-high">가격 높은순</option>
          </select>
        </label>
      </section>

      {isLoading ? (
        <Loading />
      ) : filteredListings.length > 0 ? (
        <>
          <section className="book-grid listing-grid">
            {pagedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </section>
          {filteredListings.length > pageSize && (
            <nav className="pagination" aria-label="중고 교재 페이지">
              <button type="button" onClick={() => movePage(page - 1)} disabled={page === 1}>‹</button>
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
              <button type="button" onClick={() => movePage(page + 1)} disabled={page === pageCount}>›</button>
            </nav>
          )}
        </>
      ) : (
        <EmptyState title="조건에 맞는 판매글이 없습니다." description="검색어를 줄이거나 필터를 전체로 변경해 보세요." />
      )}
    </main>
  )
}

export default ListingListPage

