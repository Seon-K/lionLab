from django.urls import path, include
from rest_framework.routers import DefaultRouter  # 수정: rest_framework 설치 후 사용 가능
from .views.book_views import BookViewSet  # 수정: views/ 패키지 구조로 변경됨
from . import views  # 수정: views/__init__.py 에서 search_book 가져옴

router = DefaultRouter()
router.register(r'books', BookViewSet)
# 수정: 존재하지 않는 ListingViewSet, CourseViewSet 제거 (모델 미정의)

urlpatterns = [
    path('isbn/', views.search_book, name='search_book'),
    path('', include(router.urls)),
]
