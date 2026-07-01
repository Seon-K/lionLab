import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Header() {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate(keyword.trim() ? `/books?q=${encodeURIComponent(keyword)}` : '/books')
  }

  return (
    <header className="header">
      <Link className="logo" to="/">
        <span className="logo-mark">C</span>
        CampusBooks
      </Link>
      <nav className="gnb" aria-label="주요 메뉴">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/books">Textbooks</NavLink>
        <NavLink to="/courses">Classes</NavLink>
      </nav>
      <form className="header-actions" onSubmit={handleSubmit}>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          aria-label="헤더 검색"
          placeholder="책, 수업, ISBN 검색"
        />
        <Link className="header-sell-button" to="/listings/new">
          + Sell Book
        </Link>
      </form>
    </header>
  )
}

export default Header
