import requests
import os
from dotenv import load_dotenv

load_dotenv()  # .env 파일 로드

def get_book_info(isbn):
    url = "https://dapi.kakao.com/v3/search/book"
    headers = {"Authorization": f"KakaoAK {os.environ.get('KAKAO_API_KEY')}"}
    params = {"query": isbn}

    response = requests.get(url, headers=headers, params=params)
    data = response.json()

    print("카카오 응답:", data)  # 디버그용

    if data.get("documents"):
        book = data["documents"][0]
        return {
            "title": book["title"],
            "authors": book["authors"],
            "thumbnail": book["thumbnail"],
            "publisher": book["publisher"],
            "price": book["price"],
            "isbn": book["isbn"],
        }
    return None