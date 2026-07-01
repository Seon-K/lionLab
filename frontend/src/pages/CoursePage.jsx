import { useEffect, useMemo, useState } from 'react'
import { getCourses } from '../api/courseApi'
import { getListings } from '../api/listingApi'
import Loading from '../components/common/Loading'
import CourseFilter from '../components/course/CourseFilter'
import CourseBookList from '../components/course/CourseBookList'

function CoursePage() {
  const [selectedDepartment, setSelectedDepartment] = useState('전체')
  const [courses, setCourses] = useState([])
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCourses(), getListings()])
      .then(([courseData, listingData]) => {
        setCourses(courseData)
        setListings(listingData)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const filteredCourses = useMemo(
    () => courses.filter((course) => selectedDepartment === '전체' || course.department === selectedDepartment),
    [courses, selectedDepartment],
  )

  const filteredListings = useMemo(() => {
    const courseIds = new Set(filteredCourses.map((course) => course.id))
    return selectedDepartment === '전체'
      ? listings
      : listings.filter((listing) => courseIds.has(listing.course?.id))
  }, [filteredCourses, listings, selectedDepartment])

  return (
    <main className="page">
      <div className="page-heading">
        <span>수업별 교재</span>
        <h1>학과와 수업 기준으로 교재를 확인하세요.</h1>
        <p>학과 필터를 선택하면 해당 수업에서 사용하는 교재만 모아볼 수 있습니다.</p>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <CourseFilter courses={courses} selectedDepartment={selectedDepartment} onSelect={setSelectedDepartment} />
          <CourseBookList listings={filteredListings} />
        </>
      )}
    </main>
  )
}

export default CoursePage
