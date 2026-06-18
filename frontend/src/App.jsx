import { useMemo, useState } from 'react'
import './App.css'

const books = [
  {
    id: 1,
    title: '파이썬으로 배우는 데이터 분석',
    author: '홍길동',
    publisher: 'OO출판사',
    isbn: '9791234567890',
    cover_image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=520&q=80',
    original_price: 32000,
    sale_price: 28800,
  },
  {
    id: 2,
    title: '데이터베이스 개론',
    author: '김철수',
    publisher: '한빛아카데미',
    isbn: '9799876543210',
    cover_image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=520&q=80',
    original_price: 35000,
    sale_price: 31500,
  },
  {
    id: 3,
    title: '혼자 공부하는 파이썬',
    author: '윤인성',
    publisher: '한빛미디어',
    isbn: '9791162241882',
    cover_image:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=520&q=80',
    original_price: 22000,
    sale_price: 19800,
  },
]

const listings = [
  {
    id: 1,
    book: books[0],
    seller_name: '김서연',
    used_price: 18000,
    book_condition: '상',
    has_writing: false,
    trade_place: '순천향대 도서관 앞',
    status: '판매중',
    created_at: '2026-05-28T10:30:00',
    description: '필기 거의 없고 깨끗합니다. 시험 기간 전에 빠르게 거래 가능해요.',
    discount_from_original: 43.8,
    discount_from_sale: 37.5,
  },
  {
    id: 2,
    book: books[1],
    seller_name: '박지훈',
    used_price: 15000,
    book_condition: '중',
    has_writing: true,
    trade_place: '공대 1호관 로비',
    status: '판매중',
    created_at: '2026-05-29T14:20:00',
    description: '중요 부분 밑줄이 조금 있습니다. 과제 풀이 챕터는 깨끗합니다.',
    discount_from_original: 57.1,
    discount_from_sale: 52.4,
  },
]

const courses = [
  {
    id: 1,
    course_name: '데이터베이스',
    professor_name: '이OO',
    department: 'AI빅데이터학과',
    grade: 2,
    semester: '1학기',
    book: books[1],
  },
  {
    id: 2,
    course_name: '데이터 분석 입문',
    professor_name: '최OO',
    department: '컴퓨터소프트웨어공학과',
    grade: 2,
    semester: '1학기',
    book: books[0],
  },
]

const formatPrice = (price) => `${price.toLocaleString('ko-KR')}원`

function Header({ currentPage, onNavigate }) {
  const items = [
    { id: 'home', label: '메인' },
    { id: 'search', label: '교재 검색' },
    { id: 'detail', label: '상세' },
  ]

  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={() => onNavigate('home')}>
        Campus Book
      </button>
      <nav className="nav-tabs" aria-label="주요 화면">
        {items.map((item) => (
          <button
            className={currentPage === item.id ? 'nav-tab active' : 'nav-tab'}
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

function BookCard({ book, compact = false, onSelect }) {
  return (
    <article className={compact ? 'book-card compact' : 'book-card'}>
      <img className="book-cover" src={book.cover_image} alt={`${book.title} 표지`} />
      <div className="book-meta">
        <strong>{book.title}</strong>
        <span>{book.author} · {book.publisher}</span>
        <span>ISBN {book.isbn}</span>
        <div className="price-row">
          <span>{formatPrice(book.sale_price)}</span>
          <small>정가 {formatPrice(book.original_price)}</small>
        </div>
      </div>
      {onSelect && (
        <button className="ghost-button" type="button" onClick={() => onSelect(book)}>
          선택
        </button>
      )}
    </article>
  )
}

function ListingCard({ listing, onOpen }) {
  return (
    <article className="listing-card">
      <BookCard book={listing.book} compact />
      <div className="listing-info">
        <div>
          <span className="status-pill">{listing.status}</span>
          <strong>{formatPrice(listing.used_price)}</strong>
        </div>
        <p>{listing.trade_place}</p>
        <button className="text-button" type="button" onClick={() => onOpen(listing.id)}>
          상세 보기
        </button>
      </div>
    </article>
  )
}

function PriceCompareBox({ listing }) {
  return (
    <section className="compare-box" aria-label="가격 비교">
      <div>
        <span>정가</span>
        <strong>{formatPrice(listing.book.original_price)}</strong>
      </div>
      <div>
        <span>현재 판매가</span>
        <strong>{formatPrice(listing.book.sale_price)}</strong>
      </div>
      <div className="highlight">
        <span>중고 판매가</span>
        <strong>{formatPrice(listing.used_price)}</strong>
      </div>
      <p>
        정가 대비 {listing.discount_from_original}% · 현재 판매가 대비{' '}
        {listing.discount_from_sale}% 저렴
      </p>
    </section>
  )
}

function HomePage({ onNavigate, onOpenListing }) {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">ISBN 기반 캠퍼스 중고 교재 거래</span>
          <h1>수업에 필요한 교재를 더 빠르게 찾고, 더 가볍게 거래하세요.</h1>
          <p>
            책 제목, ISBN, 수업명, 학과, 교수명으로 교재와 판매글을 한 번에 확인하는
            대학생 전용 중고 교재 플랫폼입니다.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => onNavigate('search')}>
              교재 검색하기
            </button>
            <button className="secondary-button" type="button" onClick={() => onNavigate('detail')}>
              판매글 보기
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <BookCard book={books[0]} compact />
          <PriceCompareBox listing={listings[0]} />
        </div>
      </section>

      <section className="content-grid">
        <div className="section-heading">
          <span>최근 판매글</span>
          <h2>지금 거래 가능한 교재</h2>
        </div>
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onOpen={onOpenListing} />
          ))}
        </div>
      </section>

      <section className="course-strip">
        {courses.map((course) => (
          <article className="course-card" key={course.id}>
            <span>{course.department}</span>
            <strong>{course.course_name}</strong>
            <p>{course.professor_name} · {course.grade}학년 · {course.semester}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

function BookSearchPage({ onSelectBook }) {
  const [query, setQuery] = useState('')

  const filteredBooks = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return books
    return books.filter((book) =>
      [book.title, book.author, book.publisher, book.isbn].some((field) =>
        field.toLowerCase().includes(value),
      ),
    )
  }, [query])

  return (
    <main className="page-shell">
      <section className="search-panel">
        <span className="eyebrow">GET /api/books/search/?q=검색어</span>
        <h1>ISBN 또는 책 제목으로 교재를 검색하세요.</h1>
        <form className="search-form" onSubmit={(event) => event.preventDefault()}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예: 파이썬, 데이터베이스, 979..."
            aria-label="교재 검색어"
          />
          <button className="primary-button" type="submit">
            검색
          </button>
        </form>
      </section>

      <section className="result-layout">
        <div className="section-heading">
          <span>검색 결과 {filteredBooks.length}개</span>
          <h2>도서 정보 자동 조회 결과</h2>
        </div>
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} onSelect={onSelectBook} />
          ))}
        </div>
      </section>
    </main>
  )
}

function ListingDetailPage({ listing }) {
  return (
    <main className="detail-layout">
      <section className="detail-main">
        <BookCard book={listing.book} />
        <div className="detail-copy">
          <span className="status-pill">{listing.status}</span>
          <h1>{listing.book.title}</h1>
          <p>{listing.description}</p>
        </div>
      </section>

      <aside className="detail-side">
        <PriceCompareBox listing={listing} />
        <dl className="seller-list">
          <div>
            <dt>판매자</dt>
            <dd>{listing.seller_name}</dd>
          </div>
          <div>
            <dt>책 상태</dt>
            <dd>{listing.book_condition}</dd>
          </div>
          <div>
            <dt>필기 여부</dt>
            <dd>{listing.has_writing ? '필기 있음' : '필기 없음'}</dd>
          </div>
          <div>
            <dt>거래 장소</dt>
            <dd>{listing.trade_place}</dd>
          </div>
        </dl>
        <div className="detail-actions">
          <button className="primary-button" type="button">
            거래 문의
          </button>
          <button className="secondary-button" type="button">
            판매글 수정
          </button>
        </div>
      </aside>
    </main>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedListingId, setSelectedListingId] = useState(1)

  const selectedListing =
    listings.find((listing) => listing.id === selectedListingId) ?? listings[0]

  const openListing = (id) => {
    setSelectedListingId(id)
    setCurrentPage('detail')
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'home' && (
        <HomePage onNavigate={setCurrentPage} onOpenListing={openListing} />
      )}
      {currentPage === 'search' && <BookSearchPage onSelectBook={() => setCurrentPage('detail')} />}
      {currentPage === 'detail' && <ListingDetailPage listing={selectedListing} />}
    </div>
  )
}

export default App
