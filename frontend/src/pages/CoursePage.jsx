import { books, courses } from '../api/mockData'
import CourseFilter from '../components/course/CourseFilter'
import CourseBookList from '../components/course/CourseBookList'

function CoursePage() {
  return (
    <main className="page">
      <h1>수업별 교재</h1>
      <CourseFilter courses={courses} />
      <CourseBookList books={books} />
    </main>
  )
}

export default CoursePage
