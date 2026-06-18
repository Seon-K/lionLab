import Button from '../common/Button'

function ListingForm() {
  return (
    <form className="listing-form">
      <input placeholder="판매 가격" aria-label="판매 가격" />
      <input placeholder="거래 장소" aria-label="거래 장소" />
      <textarea placeholder="상세 설명" aria-label="상세 설명" />
      <Button type="submit">판매글 저장</Button>
    </form>
  )
}

export default ListingForm
