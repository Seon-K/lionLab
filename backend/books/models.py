from django.db import models

class Book(models.Model):
    TRADE_TYPE_CHOICES = [
        ('sell', '팔아요'),
        ('exchange', '바꿔요'),
        ('free', '드려요'),
    ]

    STATUS_CHOICES = [
        ('available', '거래가능'),
        ('reserved', '예약중'),
        ('done', '거래완료'),
    ]

    # ISBN API 자동완성 필드
    title = models.CharField(max_length=200)
    authors = models.CharField(max_length=200)
    publisher = models.CharField(max_length=100)
    thumbnail = models.URLField(blank=True)
    isbn = models.CharField(max_length=50, blank=True)

    # 거래 관련 필드
    trade_type = models.CharField(max_length=10, choices=TRADE_TYPE_CHOICES)
    price = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')
    subject = models.CharField(max_length=100, blank=True)  # 과목명
    condition = models.TextField(blank=True)  # 책 상태 설명

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.trade_type}] {self.title}"


class TradeRequest(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='requests')
    message = models.TextField()
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} 거래 신청"