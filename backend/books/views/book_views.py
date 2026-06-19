from rest_framework import viewsets
from ..models import Book
from ..serializers.book_serializer import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # 필요시 커스텀 엔드포인트 추가
    # 예: 검색 엔드포인트를 위해 @action 사용
