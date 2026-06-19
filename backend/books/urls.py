from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.book_views import BookViewSet
from . import views

router = DefaultRouter()
router.register(r'books', BookViewSet)

urlpatterns = [
    path('isbn/', views.search_book, name='search_book'),
    path('', include(router.urls)),
]
