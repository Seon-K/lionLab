# 수정: adim.py (오타) → admin.py 로 파일 재생성 (Django는 admin.py 만 자동 인식)
from django.contrib import admin
from .models import Book, TradeRequest


# 수정: admin.site.register(Book) 만으로는 original_price 가 표시 안 돼
#       ModelAdmin 에 fields 를 명시해서 강제 표시
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
