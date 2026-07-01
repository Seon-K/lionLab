from rest_framework import filters, viewsets
from ..models import Book
from ..serializers.book_serializer import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-created_at')
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'isbn', 'authors', 'publisher']
    ordering_fields = ['created_at', 'original_price', 'price']
