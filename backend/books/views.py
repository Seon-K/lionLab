from django.http import JsonResponse
from .isbn_service import get_book_info

def search_book(request):
    isbn = request.GET.get('query', '')
    
    if not isbn:
        return JsonResponse({'error': 'query 파라미터가 필요해요'}, status=400)
    
    result = get_book_info(isbn)
    
    if result:
        return JsonResponse(result)
    return JsonResponse({'error': '책을 찾을 수 없어요'}, status=404)