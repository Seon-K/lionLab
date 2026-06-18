import Header from './Header'

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      {children}
      <footer className="footer">
        <div>
          <strong>CampusBooks</strong>
          <p>ISBN 기반 수업별 중고 교재 거래 플랫폼</p>
        </div>
        <nav>
          <a href="/">About</a>
          <a href="/">Terms</a>
          <a href="/">Support</a>
        </nav>
      </footer>
    </div>
  )
}

export default Layout
