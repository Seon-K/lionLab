import requests
import os

def get_book_info(isbn):
    url = "https://dapi.kakao.com/v3/search/book"
    headers = {"Authorization": f"KakaoAK {os.environ.get('KAKAO_API_KEY')}"}
    params = {"query": isbn}

    response = requests.get(url, headers=headers, params=params)
    data = response.json()

    if data["documents"]:
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