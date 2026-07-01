import { get, post, patch, remove } from './client'
import { getBooks } from './bookApi'
import { normalizeCourse, normalizeListing, toCoursePayload } from './normalizers'

export async function getCourses(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  const courses = await get(`/courses/${query.toString() ? `?${query.toString()}` : ''}`)
  return courses.map(normalizeCourse)
}

export async function getCourse(id) {
  const course = await get(`/courses/${id}/`)
  return normalizeCourse(course)
}

export async function createCourse(course) {
  const created = await post('/courses/', toCoursePayload(course))
  return normalizeCourse(created)
}

export async function updateCourse(id, course) {
  const updated = await patch(`/courses/${id}/`, toCoursePayload(course))
  return normalizeCourse(updated)
}

export async function deleteCourse(id) {
  return remove(`/courses/${id}/`)
}

export async function getCourseBooks(courseId) {
  const [books, courses, rawListings] = await Promise.all([getBooks(), getCourses(), get('/listings/')])
  const listings = rawListings.map((listing) => normalizeListing(listing, books, courses))
  const courseListings = listings.filter((listing) => listing.course?.id === Number(courseId))
  const bookIds = new Set(courseListings.map((listing) => listing.book?.id))

  return {
    books: books.filter((book) => bookIds.has(book.id)),
    listings: courseListings,
  }
}
