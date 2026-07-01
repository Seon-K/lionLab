import { useEffect, useMemo, useState } from 'react'
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

function ListingListPage() {
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('전체')
  const [condition, setCondition] = useState('전체')
  const [sort, setSort] = useState('latest')
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getListings({
      search: keyword.trim(),
      ordering: sort === 'price-low' ? 'price' : sort === 'price-high' ? '-price' : '-created_at',
    })
      .then(setListings)
      .finally(() => setIsLoading(false))
  }, [keyword, sort])

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesStatus = status === '전체' || listing.status_code === STATUS_TO_API[status]
      const matchesCondition = condition === '전체' || listing.book_condition.includes(condition)
      return matchesStatus && matchesCondition
    })
  }, [condition, listings, status])

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
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="책 제목, ISBN, 수업명, 학과 검색"
          />
        </label>
        <label>
          판매 상태
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="전체">전체</option>
            <option value="판매중">판매중</option>
            <option value="예약중">예약중</option>
            <option value="판매완료">판매완료</option>
          </select>
        </label>
        <label>
          책 상태
          <select value={condition} onChange={(event) => setCondition(event.target.value)}>
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
        <section className="book-grid">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </section>
      ) : (
        <EmptyState title="조건에 맞는 판매글이 없습니다." description="검색어를 줄이거나 필터를 전체로 변경해 보세요." />
      )}
    </main>
  )
}

export default ListingListPage


