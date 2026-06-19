# 수정: views/ 폴더와 views.py 가 공존할 때 Python은 폴더(패키지)를 우선 인식
# 수정: 기존 views.py 의 search_book 이 무효화되어 여기로 이동
from django.http import JsonResponse
from ..isbn_service import get_book_info


def search_book(request):
    isbn = request.GET.get('query', '')

    if not isbn:
        return JsonResponse({'error': 'query 파라미터가 필요해요'}, status=400)

    result = get_book_info(isbn)

    if result:
        return JsonResponse(result)
    return JsonResponse({'error': '책을 찾을 수 없어요'}, status=404)
