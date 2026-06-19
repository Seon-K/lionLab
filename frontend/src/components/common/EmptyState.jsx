function EmptyState({ title = '결과가 없습니다.', description = '다른 검색어를 입력해 보세요.' }) {
  return (
    <div className="state-box">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}

export default EmptyState
