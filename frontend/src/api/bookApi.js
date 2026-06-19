import { books } from './mockData'

export async function getBooks() {
  return books
}

export async function searchBooks(query) {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return books

  return books.filter((book) =>
    [book.title, book.author, book.publisher, book.isbn].some((value) =>
      value.toLowerCase().includes(keyword),
    ),
  )
}

export async function createBook(book) {
  return { id: Date.now(), ...book }
}
