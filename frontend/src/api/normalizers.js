const STATUS_LABELS = {
  available: '판매중',
  reserved: '예약중',
  done: '판매완료',
  판매중: '판매중',
  예약중: '예약중',
  판매완료: '판매완료',
}

const STATUS_VALUES = {
  판매중: 'available',
  예약중: 'reserved',
  판매완료: 'done',
  available: 'available',
  reserved: 'reserved',
  done: 'done',
}

function normalizeAuthors(authors) {
  if (Array.isArray(authors)) return authors.join(', ')
  return authors ?? ''
}
function parseConditionText(conditionText = '') {
  const parts = String(conditionText)
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
  const condition = ['상', '중', '하'].find((value) => parts[0] === value || conditionText === value)
  const writingPart = parts.find((part) => part.includes('필기'))
  const description = parts.filter((part) => part !== condition && part !== writingPart).join(' / ')

  return {
    bookCondition: condition || '',
    hasWriting: writingPart ? writingPart.includes('있음') : undefined,
    description,
  }
}


export function toStatusLabel(status) {
  return STATUS_LABELS[status] ?? status ?? '판매중'
}

export function toStatusValue(status) {
  return STATUS_VALUES[status] ?? 'available'
}

export function normalizeBook(book) {
  if (!book) return null

  const authors = normalizeAuthors(book.authors ?? book.author)
  const originalPrice = book.original_price ?? book.price ?? book.sale_price ?? 0

  return {
    ...book,
    author: book.author ?? authors,
    authors,
    cover_image: book.cover_image ?? book.thumbnail ?? '',
    thumbnail: book.thumbnail ?? book.cover_image ?? '',
    original_price: originalPrice,
    sale_price: book.sale_price ?? originalPrice,
  }
}

export function normalizeCourse(course) {
  if (!course) return null

  return {
    ...course,
    course_name: course.course_name ?? course.name ?? '',
    name: course.name ?? course.course_name ?? '',
    professor_name: course.professor_name ?? course.professor ?? '',
    professor: course.professor ?? course.professor_name ?? '',
    grade: course.grade ?? '-',
    semester: course.semester ?? '-',
  }
}

export function normalizeListing(listing, books = [], courses = []) {
  if (!listing) return null

  const normalizedBooks = books.map(normalizeBook)
  const normalizedCourses = courses.map(normalizeCourse)
  const book = typeof listing.book === 'object'
    ? normalizeBook(listing.book)
    : normalizedBooks.find((item) => item.id === listing.book)
  const course = typeof listing.course === 'object'
    ? normalizeCourse(listing.course)
    : normalizedCourses.find((item) => item.id === listing.course)
  const conditionText = listing.book_condition ?? listing.condition ?? ''
  const parsedCondition = parseConditionText(conditionText)
  const noteText = listing.trade_place ?? listing.note ?? ''
  const descriptionText = listing.description ?? parsedCondition.description

  return {
    ...listing,
    book,
    course,
    status_code: toStatusValue(listing.status),
    status: toStatusLabel(listing.status),
    used_price: listing.used_price ?? listing.price ?? 0,
    price: listing.price ?? listing.used_price ?? 0,
    book_condition: parsedCondition.bookCondition || '상태 정보 없음',
    condition: conditionText,
    has_writing: listing.has_writing ?? parsedCondition.hasWriting ?? false,
    trade_place: noteText || '거래 장소 협의',
    note: listing.note ?? noteText,
    seller_name: listing.seller_name ?? listing.sellerName ?? '판매자 미입력',
    description: descriptionText || noteText || '상세 설명이 없습니다.',
    discount_from_original: listing.discount_from_original ?? listing.discount_rate ?? 0,
    discount_from_sale: listing.discount_from_sale ?? listing.discount_rate ?? 0,
  }
}

export function toBookPayload(book) {
  return {
    title: book.title,
    authors: normalizeAuthors(book.authors ?? book.author),
    publisher: book.publisher ?? '',
    thumbnail: book.thumbnail ?? book.cover_image ?? '',
    isbn: book.isbn ?? '',
    original_price: Number(book.original_price ?? book.price ?? book.sale_price ?? 0),
  }
}

export function toListingPayload(form) {
  const conditionParts = [form.book_condition, form.has_writing === 'true' ? '필기 있음' : '필기 없음', form.description]
    .filter(Boolean)

  return {
    book: Number(form.bookId ?? form.book?.id ?? form.book),
    course: form.courseId ? Number(form.courseId) : null,
    trade_type: form.trade_type ?? 'sell',
    price: Number(form.used_price ?? form.price ?? 0),
    status: toStatusValue(form.status),
    condition: conditionParts.join(' / '),
    note: form.trade_place ?? form.note ?? '',
  }
}

export function toCoursePayload(course) {
  return {
    name: course.name ?? course.course_name ?? '',
    department: course.department ?? '',
    professor: course.professor ?? course.professor_name ?? '',
  }
}

