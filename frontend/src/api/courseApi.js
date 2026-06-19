import { books, courses } from './mockData'

export async function getCourses() {
  return courses
}

export async function getCourseBooks(courseId) {
  const course = courses.find((item) => item.id === Number(courseId)) ?? courses[0]
  return {
    course,
    books: books.filter((book) => book.id === course.book.id),
  }
}
