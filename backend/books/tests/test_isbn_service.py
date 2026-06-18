import sys
import os
from unittest.mock import patch, MagicMock

# isbn_service.py 경로 직접 추가
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from isbn_service import get_book_info

# 카카오 API 가짜 응답 데이터
MOCK_RESPONSE = {
    "documents": [
        {
            "title": "파이썬 완벽 가이드",
            "authors": ["홍길동"],
            "thumbnail": "https://example.com/thumb.jpg",
            "publisher": "한빛미디어",
            "price": 30000,
            "isbn": "9788966260959",
        }
    ]
}

EMPTY_RESPONSE = {
    "documents": []
}


class TestGetBookInfo:

    # ── 테스트 1: ISBN으로 책 정보가 정상 반환되는지 ──────────────────
    @patch("isbn_service.requests.get")
    def test_정상_isbn_책정보_반환(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = MOCK_RESPONSE
        mock_get.return_value = mock_response

        result = get_book_info("9788966260959")

        assert result is not None
        assert result["title"] == "파이썬 완벽 가이드"
        assert result["authors"] == ["홍길동"]
        assert result["publisher"] == "한빛미디어"
        print("✅ 테스트 1 통과: 정상 ISBN → 책 정보 반환")

    # ── 테스트 2: 존재하지 않는 ISBN이면 None 반환 ───────────────────
    @patch("isbn_service.requests.get")
    def test_없는_isbn_none_반환(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = EMPTY_RESPONSE
        mock_get.return_value = mock_response

        result = get_book_info("0000000000000")

        assert result is None
        print("✅ 테스트 2 통과: 없는 ISBN → None 반환")

    # ── 테스트 3: API 호출 시 올바른 헤더가 전달되는지 ──────────────
    @patch("isbn_service.requests.get")
    def test_카카오_헤더_전달_확인(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = MOCK_RESPONSE
        mock_get.return_value = mock_response

        get_book_info("9788966260959")

        call_kwargs = mock_get.call_args
        headers = call_kwargs[1]["headers"]
        assert "KakaoAK" in headers["Authorization"]
        print("✅ 테스트 3 통과: 카카오 인증 헤더 정상 전달")


# ── 실행 ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    t = TestGetBookInfo()
    t.test_정상_isbn_책정보_반환()
    t.test_없는_isbn_none_반환()
    t.test_카카오_헤더_전달_확인()
    print("\n🎉 모든 테스트 통과!")