import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <Link className="logo" to="/">
        <span className="logo-mark">C</span>
        CampusBooks
      </Link>
      <nav className="gnb" aria-label="주요 메뉴">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/books/search">Search</NavLink>
        <NavLink to="/courses">Classes</NavLink>
      </nav>
      <div className="header-actions">
        <input aria-label="헤더 검색" placeholder="책, 수업, ISBN 검색" />
        <Link className="header-sell-button" to="/listings/new">
          + Sell Book
        </Link>
      </div>
    </header>
  )
}

export default Header
