import { listings } from '../api/mockData'
import ListingCard from '../components/listing/ListingCard'

function ListingListPage() {
  return (
    <main className="page">
      <h1>중고 교재 목록</h1>
      <section className="book-grid">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </section>
    </main>
  )
}

export default ListingListPage
