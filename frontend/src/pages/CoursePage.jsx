import { useMemo, useState } from 'react'
import { books, courses } from '../api/mockData'
import CourseFilter from '../components/course/CourseFilter'
import CourseBookList from '../components/course/CourseBookList'

function CoursePage() {
  const [selectedDepartment, setSelectedDepartment] = useState('전체')
  const filteredCourses = useMemo(
    () => courses.filter((course) => selectedDepartment === '전체' || course.department === selectedDepartment),
    [selectedDepartment],
  )
  const filteredBooks = useMemo(
    () => selectedDepartment === '전체'
      ? books
      : filteredCourses.map((course) => course.book),
    [filteredCourses, selectedDepartment],
  )

  return (
    <main className="page">
      <div className="page-heading">
        <span>수업별 교재</span>
        <h1>학과와 수업 기준으로 교재를 확인하세요.</h1>
        <p>학과 필터를 선택하면 해당 수업에서 사용하는 교재만 모아볼 수 있습니다.</p>
      </div>
      <CourseFilter courses={courses} selectedDepartment={selectedDepartment} onSelect={setSelectedDepartment} />
      <CourseBookList books={filteredBooks} />
    </main>
  )
}

export default CoursePage
