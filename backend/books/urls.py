from django.urls import path
from . import views

urlpatterns = [
    path('isbn/', views.search_book, name='search_book'),
]