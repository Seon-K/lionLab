function CourseFilter({ courses, selectedDepartment, onSelect }) {
  const departments = ['전체', ...new Set(courses.map((course) => course.department))]

  return (
    <div className="course-filter">
      {departments.map((department) => (
        <button
          key={department}
          className={selectedDepartment === department ? 'active' : ''}
          type="button"
          onClick={() => onSelect(department)}
        >
          {department}
        </button>
      ))}
    </div>
  )
}

export default CourseFilter
