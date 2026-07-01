import ListingForm from '../components/listing/ListingForm'

function ListingCreatePage() {
  return (
    <main className="page form-page">
      <div className="page-heading">
        <span>판매글 등록</span>
        <h1>중고 교재 판매 정보를 입력하세요.</h1>
        <p>책을 선택하면 정가와 현재 판매가 기준의 할인율을 바로 확인할 수 있습니다.</p>
      </div>
      <ListingForm />
    </main>
  )
}

export default ListingCreatePage
