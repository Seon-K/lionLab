import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getListing } from '../api/listingApi'
import Loading from '../components/common/Loading'
import ListingForm from '../components/listing/ListingForm'

function ListingEditPage() {
  const { id } = useParams()
  const [listing, setListing] = useState(null)

  useEffect(() => {
    getListing(id).then(setListing)
  }, [id])

  if (!listing) return <Loading />

  return (
    <main className="page form-page">
      <div className="page-heading">
        <span>판매글 수정</span>
        <h1>판매 정보와 상태를 수정하세요.</h1>
        <p>기존 판매글 정보를 불러온 상태에서 가격, 책 상태, 판매 상태를 바꿀 수 있습니다.</p>
      </div>
      <ListingForm mode="edit" initialValues={listing} />
    </main>
  )
}

export default ListingEditPage
