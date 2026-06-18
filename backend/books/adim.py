from django.contrib import admin
from .models import Book, TradeRequest

admin.site.register(Book)
admin.site.register(TradeRequest)