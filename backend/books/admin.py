from django.contrib import admin
from .models import Book, TradeRequest


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    fields = (
        'title', 'authors', 'publisher', 'thumbnail', 'isbn',
        'trade_type', 'original_price', 'price',
        'status', 'subject', 'condition',
    )


@admin.register(TradeRequest)
class TradeRequestAdmin(admin.ModelAdmin):
    pass
