function CourseFilter({ courses }) {
  return (
    <div className="course-filter">
      {courses.map((course) => (
        <button key={course.id} type="button">
          {course.department}
        </button>
      ))}
    </div>
  )
}

export default CourseFilter
