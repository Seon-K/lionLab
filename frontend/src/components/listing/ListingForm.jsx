import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook, getBooks, searchBookByIsbn, searchBooks } from '../../api/bookApi'
import { createCourse, getCourses } from '../../api/courseApi'
import { createListing, updateListing } from '../../api/listingApi'
import { calculateDiscount, formatPrice } from '../../utils/format'
import Button from '../common/Button'
import Loading from '../common/Loading'

const defaultValues = {
  bookId: '',
  courseId: '',
  courseName: '',
  seller_name: '',
  used_price: '',
  book_condition: '상',
  has_writing: 'false',
  trade_place: '',
  status: '판매중',
  description: '',
}

const coverPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22160%22 viewBox=%220 0 120 160%22><rect width=%22120%22 height=%22160%22 rx=%228%22 fill=%22%23eef2f8%22/><path d=%22M34 44h52v72H34z%22 fill=%22%23d7deeb%22/><path d=%22M43 58h34M43 72h28M43 86h30%22 stroke=%22%23818da3%22 stroke-width=%224%22 stroke-linecap=%22round%22/></svg>'

const emptyBookDraft = {
  title: '',
  author: '',
  authors: '',
  publisher: '',
  isbn: '',
  cover_image: '',
  thumbnail: '',
  original_price: '',
  sale_price: '',
}

function getBookKey(book) {
  return book?.isbn || book?.id || book?.title
}

function mergeBookResults(...groups) {
  const seen = new Set()
  return groups.flat().filter((book) => {
    const key = getBookKey(book)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function ListingForm({ mode = 'create', initialValues, onSubmit }) {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [courses, setCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchMessage, setSearchMessage] = useState('')
  const [selectedBook, setSelectedBook] = useState(() => initialValues?.book ?? null)
  const [bookDraft, setBookDraft] = useState(() => ({ ...emptyBookDraft, ...(initialValues?.book ?? {}) }))
  const [coverPreview, setCoverPreview] = useState(initialValues?.book?.cover_image ?? '')
  const [initialBookId] = useState(() => initialValues?.book?.id ?? initialValues?.bookId ?? '')
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [form, setForm] = useState(() => ({
    ...defaultValues,
    ...initialValues,
    bookId: initialValues?.book?.id ?? initialValues?.bookId ?? '',
    courseId: initialValues?.course?.id ?? initialValues?.courseId ?? '',
    courseName: initialValues?.course?.course_name ?? initialValues?.course?.name ?? initialValues?.courseName ?? '',
    used_price: initialValues?.used_price ?? initialValues?.price ?? '',
    has_writing: String(initialValues?.has_writing ?? defaultValues.has_writing),
  }))

  useEffect(() => {
    Promise.all([getBooks(), getCourses()])
      .then(([bookData, courseData]) => {
        setBooks(bookData)
        setCourses(courseData)

        const currentBook = initialValues?.book ?? bookData.find((book) => book.id === Number(initialBookId)) ?? null
        if (currentBook) {
          setSelectedBook(currentBook)
          setBookDraft({ ...emptyBookDraft, ...currentBook })
          setCoverPreview(currentBook.cover_image)
        }
      })
      .finally(() => setIsLoading(false))
  }, [initialBookId, initialValues?.book])

  const previewBook = useMemo(() => {
    if (selectedBook) return { ...selectedBook, ...bookDraft, cover_image: coverPreview || bookDraft.cover_image }
    return { ...bookDraft, cover_image: coverPreview || bookDraft.cover_image }
  }, [bookDraft, coverPreview, selectedBook])

  const visibleSearchResults = searchResults
  const originalDiscount = calculateDiscount(previewBook?.original_price, form.used_price)
  const saleDiscount = calculateDiscount(previewBook?.sale_price, form.used_price)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleBookDraftChange = (event) => {
    const { name, value } = event.target
    setBookDraft((current) => ({
      ...current,
      [name]: value,
      ...(name === 'author' ? { authors: value } : {}),
      ...(name === 'cover_image' ? { thumbnail: value } : {}),
    }))
    if (name === 'cover_image') setCoverPreview(value)
    setSelectedBook(null)
    setForm((current) => ({ ...current, bookId: '' }))
  }

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setCoverPreview(previewUrl)
    setBookDraft((current) => ({ ...current, coverFile: file, cover_image: current.cover_image, thumbnail: current.thumbnail }))
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return

    setIsSearching(true)
    setSearchMessage('')
    try {
      let isbnResults = []
      let savedResults = []

      try {
        const isbnBook = await searchBookByIsbn(query)
        if (isbnBook?.title) isbnResults = [isbnBook]
      } catch {
        isbnResults = []
      }

      try {
        savedResults = await searchBooks(query)
      } catch {
        savedResults = []
      }

      const results = mergeBookResults(isbnResults, savedResults)
      setSearchResults(results)
      setSearchMessage(results.length ? `${results.length}개의 비슷한 교재를 찾았습니다.` : '검색 결과가 없습니다. 직접 입력해 주세요.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectBook = (book) => {
    setSelectedBook(book)
    setBookDraft({ ...emptyBookDraft, ...book })
    setCoverPreview(book.cover_image)
    setForm((current) => ({ ...current, bookId: book.id ?? '' }))
  }

  const ensureBook = async () => {
    if (selectedBook?.id) return selectedBook

    const title = bookDraft.title.trim()
    if (!title) throw new Error('책 제목을 입력해 주세요.')

    const existingBook = books.find((book) => (
      (bookDraft.isbn && book.isbn === bookDraft.isbn) || book.title === title
    ))
    if (existingBook) return existingBook

    return createBook({
      ...bookDraft,
      cover_image: bookDraft.cover_image || selectedBook?.cover_image || '',
      thumbnail: bookDraft.thumbnail || bookDraft.cover_image || selectedBook?.thumbnail || '',
      author: bookDraft.author || bookDraft.authors,
      authors: bookDraft.authors || bookDraft.author,
      original_price: Number(bookDraft.original_price || bookDraft.sale_price || 0),
      sale_price: Number(bookDraft.sale_price || bookDraft.original_price || 0),
    })
  }

  const ensureCourse = async () => {
    const courseName = form.courseName.trim()
    if (!courseName) return null

    const existingCourse = courses.find((course) => (
      course.course_name.trim().toLowerCase() === courseName.toLowerCase()
      || course.name.trim().toLowerCase() === courseName.toLowerCase()
    ))
    if (existingCourse) return existingCourse

    return createCourse({ course_name: courseName, name: courseName })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const savedBook = await ensureBook()
    const savedCourse = await ensureCourse()
    const payload = {
      ...form,
      bookId: savedBook.id,
      courseId: savedCourse?.id ?? '',
      book: savedBook,
      used_price: Number(form.used_price),
      has_writing: form.has_writing === 'true',
    }
    const saved = onSubmit
      ? await onSubmit(payload)
      : mode === 'edit' && initialValues?.id
        ? await updateListing(initialValues.id, payload)
        : await createListing(payload)
    navigate(mode === 'edit' && saved?.id ? `/listings/${saved.id}` : '/listings')
  }

  if (isLoading) return <Loading />

  return (
    <form className="listing-form enhanced-form" onSubmit={handleSubmit}>
      <section className="form-section book-register-section">
        <h2>교재 정보</h2>
        <div className="book-search-field">
          <p className="search-guide-text">ISBN 또는 책 제목으로 검색한 뒤 교재를 선택하면 아래 교재 정보가 자동으로 채워집니다.</p>
          <div className="inline-search">
            <input
              value={searchQuery}
              onChange={handleSearchQueryChange}
              onKeyDown={(event) => { if (event.key === 'Enter') handleSearch(event) }}
              placeholder="ISBN 또는 책 제목으로 검색"
              aria-label="ISBN 또는 책 제목 검색"
            />
            <Button type="button" disabled={isSearching} onClick={handleSearch}>검색</Button>
          </div>
          {searchMessage && <p className="form-help-text">{searchMessage}</p>}
          {isSearching && (
            <div className="book-search-loading" role="status">
              <span className="loading-dot" />
              <strong>교재를 검색하는 중입니다.</strong>
              <small>검색 결과가 아래에 표시됩니다.</small>
            </div>
          )}
          {!isSearching && visibleSearchResults.length > 0 && (
            <div className="book-recommend-box">
              <div className="recommend-head">
                <strong>검색된 교재</strong>
                <span>교재를 선택하면 아래 정보가 채워집니다.</span>
              </div>
              <div className="book-result-list" aria-label="교재 검색 결과 목록">
                {visibleSearchResults.map((book) => (
                  <button key={`${book.isbn || book.id}-${book.title}`} type="button" className="book-result-item" onClick={() => handleSelectBook(book)}>
                    <img src={book.cover_image || coverPlaceholder} alt={`${book.title} 표지`} />
                    <span>
                      <strong>{book.title}</strong>
                      <small>{book.author || book.authors || '저자 정보 없음'}</small>
                      <small>{book.publisher || '출판사 정보 없음'}</small>
                      <em>{book.isbn || 'ISBN 정보 없음'}</em>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="form-grid two-columns">
          <label>
            책 제목
            <input name="title" value={bookDraft.title} onChange={handleBookDraftChange} placeholder="예: 파이썬 알고리즘 인터뷰" required />
          </label>
          <label>
            ISBN
            <input name="isbn" value={bookDraft.isbn} onChange={handleBookDraftChange} placeholder="예: 9791189909178" />
          </label>
          <label>
            저자
            <input name="author" value={bookDraft.author || bookDraft.authors} onChange={handleBookDraftChange} placeholder="예: 박상길" />
          </label>
          <label>
            출판사
            <input name="publisher" value={bookDraft.publisher} onChange={handleBookDraftChange} placeholder="예: 책만" />
          </label>
          <label>
            정가
            <input name="original_price" value={bookDraft.original_price} onChange={handleBookDraftChange} inputMode="numeric" placeholder="예: 38000" />
          </label>
          <label>
            현재 판매가
            <input name="sale_price" value={bookDraft.sale_price} onChange={handleBookDraftChange} inputMode="numeric" placeholder="예: 34200" />
          </label>
          <label className="wide-field">
            표지 이미지 URL
            <input name="cover_image" value={bookDraft.cover_image || ''} onChange={handleBookDraftChange} placeholder="검색 이미지가 없으면 이미지 URL을 입력하세요." />
          </label>
          <label className="wide-field file-upload-field">
            책 사진 업로드
            <input type="file" accept="image/*" onChange={handleCoverUpload} />
            <span>선택한 이미지는 미리보기에 반영됩니다.</span>
          </label>
        </div>

        <div className="selected-book-preview">
          <img src={previewBook.cover_image || coverPlaceholder} alt={`${previewBook.title || '교재'} 표지`} />
          <div>
            <strong>{previewBook.title || '교재를 검색하거나 직접 입력하세요.'}</strong>
            <p>{previewBook.author || previewBook.authors || '저자 정보'} · {previewBook.publisher || '출판사 정보'}</p>
            <span>정가 {formatPrice(previewBook.original_price)}</span>
            <span>현재 판매가 {formatPrice(previewBook.sale_price)}</span>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2>판매 정보</h2>
        <div className="form-grid two-columns">
          <label>
            연결 수업
            <input
              name="courseName"
              value={form.courseName}
              onChange={handleChange}
              placeholder="예: 데이터베이스"
              list="course-suggestions"
            />
            <datalist id="course-suggestions">
              {courses.map((course) => (
                <option key={course.id} value={course.course_name} />
              ))}
            </datalist>
          </label>
          <label>
            판매자 이름
            <input name="seller_name" value={form.seller_name} onChange={handleChange} placeholder="예: 김서연" />
          </label>
          <label>
            중고 판매가
            <input name="used_price" value={form.used_price} onChange={handleChange} inputMode="numeric" placeholder="예: 28000" required />
          </label>
          <label>
            책 상태
            <select name="book_condition" value={form.book_condition} onChange={handleChange}>
              <option value="상">상</option>
              <option value="중">중</option>
              <option value="하">하</option>
            </select>
          </label>
          <label>
            필기 여부
            <select name="has_writing" value={form.has_writing} onChange={handleChange}>
              <option value="false">필기 없음</option>
              <option value="true">필기 있음</option>
            </select>
          </label>
          {mode === 'edit' && (
            <label>
              판매 상태
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="판매중">판매중</option>
                <option value="예약중">예약중</option>
                <option value="판매완료">판매완료</option>
              </select>
            </label>
          )}
          <label className="wide-field">
            거래 장소
            <input name="trade_place" value={form.trade_place} onChange={handleChange} placeholder="예: 순천향대 중앙도서관 앞" />
          </label>
          <label className="wide-field">
            상세 설명
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="책 상태, 필기 정도, 거래 가능 시간 등을 입력하세요." />
          </label>
        </div>
      </section>

      <section className="form-section price-preview">
        <h2>가격 비교 미리보기</h2>
        <div className="preview-grid">
          <div>
            <span>정가</span>
            <strong>{formatPrice(previewBook.original_price)}</strong>
          </div>
          <div>
            <span>현재 판매가</span>
            <strong>{formatPrice(previewBook.sale_price)}</strong>
          </div>
          <div className="preview-highlight">
            <span>중고 판매가</span>
            <strong>{formatPrice(form.used_price)}</strong>
          </div>
        </div>
        <p>정가 대비 {originalDiscount}% 할인 · 현재 판매가 대비 {saleDiscount}% 할인</p>
      </section>

      <div className="form-actions">
        <Button type="submit">{mode === 'edit' ? '수정 내용 저장' : '판매글 등록'}</Button>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>취소</Button>
      </div>
    </form>
  )
}

export default ListingForm

