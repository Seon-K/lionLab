function CourseCard({ course }) {
  return (
    <article className="course-card">
      <span>{course.department}</span>
      <strong>{course.course_name}</strong>
      <p>
        {course.professor_name} · {course.grade}학년 · {course.semester}
      </p>
    </article>
  )
}

export default CourseCard
