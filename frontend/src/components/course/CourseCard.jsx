function CourseCard({ course }) {
  return (
    <article className="course-card">
      <span>{course.department || '학과 미지정'}</span>
      <strong>{course.course_name}</strong>
      <p>{course.professor_name || '교수 미정'}</p>
    </article>
  )
}

export default CourseCard
