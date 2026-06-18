import Button from '../common/Button'

function BookSearch({ query, onQueryChange, onSubmit, compact = false }) {
  return (
    <form className={compact ? 'search-box search-box-compact' : 'search-box'} onSubmit={onSubmit}>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by title, ISBN, author or class"
        aria-label="도서 검색어"
      />
      <Button type="submit">Search</Button>
    </form>
  )
}

export default BookSearch
