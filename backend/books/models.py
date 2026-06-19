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
    trade_type = models.CharField(max_length=10, choices=TRADE_TYPE_CHOICES, default='sell')  # 수정: 필드 누락으로 __str__ 오류 → 재추가
    original_price = models.PositiveIntegerField(default=0)  # 추가: 정가 (할인율 계산용)
    price = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')
    subject = models.CharField(max_length=100, blank=True)
    condition = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    @property  # 추가: DB에 저장 안 하고 호출할 때마다 자동 계산
    def discount_rate(self):  # 추가: book.discount_rate 로 호출 가능
        """할인율 자동 계산 (%)"""  # 추가
        if self.original_price and self.original_price > 0:  # 추가: 0으로 나누기 방지
            rate = (1 - (self.price / self.original_price)) * 100  # 추가: 할인율 공식
            return round(rate)  # 추가: 소수점 반올림
        return 0  # 추가: 정가 없으면 할인율 0

    def __str__(self):
        return f"[{self.trade_type}] {self.title}"


class TradeRequest(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='requests')
    message = models.TextField()
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} 거래 신청"
