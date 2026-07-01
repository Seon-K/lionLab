from rest_framework import filters, viewsets
from ..models import Course
from ..serializers.course_serializer import CourseSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('-created_at')
    serializer_class = CourseSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'department', 'professor']
    ordering_fields = ['created_at']
