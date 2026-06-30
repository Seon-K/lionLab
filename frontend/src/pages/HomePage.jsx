import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { courses, listings } from '../api/mockData'
import BookSearch from '../components/book/BookSearch'
import CourseCard from '../components/course/CourseCard'
import ListingCard from '../components/listing/ListingCard'

function HomePage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    navigate(query.trim() ? `/books?q=${encodeURIComponent(query)}` : '/books')
  }

  return (
    <main>
      <section className="home-hero">
        <span className="hero-tag">Textbook Marketplace for Campus</span>
        <h1>
          Save Money, Trade Smart
          <br />
          on Campus
        </h1>
        <p>ISBN과 책 제목으로 교재를 찾고, 수업별로 필요한 중고 교재를 빠르게 거래하세요.</p>
        <BookSearch query={query} onQueryChange={setQuery} onSubmit={handleSearch} />
        <div className="hero-keywords">
          <span>Marketing</span>
          <span>Database</span>
          <span>Python</span>
          <span>Economics</span>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>왜 CampusBooks인가요?</h2>
          <p>수업과 교재 정보를 중심으로 중고 거래 과정을 단순하게 만듭니다.</p>
        </div>
        <div className="feature-grid">
          <article>
            <span className="feature-icon blue">1</span>
            <h3>Smart ISBN Lookup</h3>
            <p>ISBN 또는 책 제목으로 도서 정보를 자동 조회합니다.</p>
          </article>
          <article>
            <span className="feature-icon green">2</span>
            <h3>Course-specific Trading</h3>
            <p>수업명, 학과, 교수명 기준으로 필요한 교재를 찾습니다.</p>
          </article>
          <article>
            <span className="feature-icon yellow">3</span>
            <h3>Verified Student Sellers</h3>
            <p>캠퍼스 근처 거래 장소와 판매 상태를 한눈에 확인합니다.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-title row-title">
          <div>
            <h2>최근 올라온 교재</h2>
            <p>지금 바로 거래 가능한 인기 교재입니다.</p>
          </div>
          <Link to="/books">교재 더 보기 +</Link>
        </div>
        <div className="book-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="blue-banner">
        <div>
          <h2>지금 읽고 있는 전공 서적을 돈으로 바꿔보세요.</h2>
          <p>책 정보는 자동으로 채우고, 가격과 상태만 입력하면 판매글을 만들 수 있습니다.</p>
          <Link className="banner-button" to="/listings/new">판매글 등록하기</Link>
        </div>
        <span className="banner-icon">◇</span>
      </section>

      <section className="section compact-section">
        <div className="course-row">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage
