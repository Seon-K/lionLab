import requests
import os
from dotenv import load_dotenv

load_dotenv()

def kakao_book_search(isbn):
    url = "https://dapi.kakao.com/v3/search/book"
    headers = {"Authorization": f"KakaoAK {os.environ.get('KAKAO_API_KEY')}"}
    params = {"query": isbn}
    resp = requests.get(url, headers=headers, params=params)
    return resp.json()
