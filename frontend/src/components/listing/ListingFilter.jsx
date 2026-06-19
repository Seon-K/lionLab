function ListingFilter({ filters, onChange }) {
  return (
    <div className="filter-chips" aria-label="판매글 필터">
      {filters.map((filter) => (
        <button key={filter} type="button" onClick={() => onChange(filter)}>
          {filter}
        </button>
      ))}
    </div>
  )
}

export default ListingFilter
