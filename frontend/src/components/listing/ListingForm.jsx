import { useMemo, useState } from 'react'
import { books } from '../../api/mockData'
import { calculateDiscount, formatPrice } from '../../utils/format'
import Button from '../common/Button'

const defaultValues = {
  bookId: books[0]?.id ?? '',
  seller_name: '',
  used_price: '',
  book_condition: '상',
  has_writing: 'false',
  trade_place: '',
  status: '판매중',
  description: '',
}

function ListingForm({ mode = 'create', initialValues, onSubmit }) {
  const [form, setForm] = useState(() => ({
    ...defaultValues,
    ...initialValues,
    bookId: initialValues?.book?.id ?? initialValues?.bookId ?? defaultValues.bookId,
    has_writing: String(initialValues?.has_writing ?? defaultValues.has_writing),
  }))

  const selectedBook = useMemo(
    () => books.find((book) => book.id === Number(form.bookId)) ?? books[0],
    [form.bookId],
  )

  const originalDiscount = calculateDiscount(selectedBook.original_price, form.used_price)
  const saleDiscount = calculateDiscount(selectedBook.sale_price, form.used_price)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.({
      ...form,
      book: selectedBook,
      used_price: Number(form.used_price),
      has_writing: form.has_writing === 'true',
    })
  }

  return (
    <form className="listing-form enhanced-form" onSubmit={handleSubmit}>
      <section className="form-section">
        <h2>교재 정보</h2>
        <label>
          책 선택
          <select name="bookId" value={form.bookId} onChange={handleChange}>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </label>
        <div className="selected-book-preview">
          <img src={selectedBook.cover_image} alt={`${selectedBook.title} 표지`} />
          <div>
            <strong>{selectedBook.title}</strong>
            <p>{selectedBook.author} · {selectedBook.publisher}</p>
            <span>정가 {formatPrice(selectedBook.original_price)}</span>
            <span>현재 판매가 {formatPrice(selectedBook.sale_price)}</span>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2>판매 정보</h2>
        <div className="form-grid two-columns">
          <label>
            판매자 이름
            <input
              name="seller_name"
              value={form.seller_name}
              onChange={handleChange}
              placeholder="예: 김서연"
              required
            />
          </label>
          <label>
            중고 판매가
            <input
              name="used_price"
              value={form.used_price}
              onChange={handleChange}
              inputMode="numeric"
              placeholder="예: 28000"
              required
            />
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
            <input
              name="trade_place"
              value={form.trade_place}
              onChange={handleChange}
              placeholder="예: 순천향대 중앙도서관 앞"
              required
            />
          </label>
          <label className="wide-field">
            상세 설명
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="책 상태, 필기 정도, 거래 가능 시간 등을 입력하세요."
              required
            />
          </label>
        </div>
      </section>

      <section className="form-section price-preview">
        <h2>가격 비교 미리보기</h2>
        <div className="preview-grid">
          <div>
            <span>정가</span>
            <strong>{formatPrice(selectedBook.original_price)}</strong>
          </div>
          <div>
            <span>현재 판매가</span>
            <strong>{formatPrice(selectedBook.sale_price)}</strong>
          </div>
          <div className="preview-highlight">
            <span>중고 판매가</span>
            <strong>{formatPrice(form.used_price)}</strong>
          </div>
        </div>
        <p>
          정가 대비 {originalDiscount}% 할인 · 현재 판매가 대비 {saleDiscount}% 할인
        </p>
      </section>

      <div className="form-actions">
        <Button type="submit">{mode === 'edit' ? '수정 내용 저장' : '판매글 등록'}</Button>
        <Button type="button" variant="secondary">취소</Button>
      </div>
    </form>
  )
}

export default ListingForm
