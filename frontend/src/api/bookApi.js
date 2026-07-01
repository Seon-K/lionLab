import { get, post, patch, remove } from './client'
import { normalizeBook, toBookPayload } from './normalizers'

export async function getBooks() {
  const books = await get('/books/')
  return books.map(normalizeBook)
}

export async function getBook(id) {
  const book = await get(`/books/${id}/`)
  return normalizeBook(book)
}

export async function searchBooks(query) {
  const search = query.trim()
  const path = search ? `/books/?search=${encodeURIComponent(search)}` : '/books/'
  const books = await get(path)
  return books.map(normalizeBook)
}

export async function createBook(book) {
  const created = await post('/books/', toBookPayload(book))
  return normalizeBook(created)
}

export async function updateBook(id, book) {
  const updated = await patch(`/books/${id}/`, toBookPayload(book))
  return normalizeBook(updated)
}

export async function deleteBook(id) {
  return remove(`/books/${id}/`)
}

export async function searchBookByIsbn(query) {
  return get(`/isbn/?query=${encodeURIComponent(query)}`)
}
