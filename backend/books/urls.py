from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.book_views import BookViewSet
from .views.course_views import CourseViewSet
from .views.listing_views import ListingViewSet
from . import views

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'listings', ListingViewSet)
router.register(r'courses', CourseViewSet)

urlpatterns = [
    path('isbn/', views.search_book, name='search_book'),
    path('', include(router.urls)),
]
