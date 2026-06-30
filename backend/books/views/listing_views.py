from rest_framework import filters, viewsets
from ..models import Listing
from ..serializers.listing_serializer import ListingSerializer

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.select_related('book', 'course').all().order_by('-created_at')
    serializer_class = ListingSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['book__title', 'book__isbn', 'course__name', 'course__department']
    ordering_fields = ['created_at', 'price']

    def get_queryset(self):
        queryset = super().get_queryset()
        course_name = self.request.query_params.get('course')
        department = self.request.query_params.get('department')

        if course_name:
            queryset = queryset.filter(course__name__icontains=course_name)
        if department:
            queryset = queryset.filter(course__department__icontains=department)

        return queryset
