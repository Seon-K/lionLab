function BookSelectBox({ books, selectedId, onChange }) {
  return (
    <select className="select-box" value={selectedId} onChange={(event) => onChange(event.target.value)}>
      {books.map((book) => (
        <option key={book.id} value={book.id}>
          {book.title}
        </option>
      ))}
    </select>
  )
}

export default BookSelectBox
