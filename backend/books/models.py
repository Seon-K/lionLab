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
    original_price = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def discount_rate(self):
        if self.original_price and self.original_price > 0 and hasattr(self, 'price'):
            try:
                rate = (1 - (self.price / self.original_price)) * 100
                return round(rate)
            except Exception:
                return 0
        return 0

    def __str__(self):
        return f"{self.title}"


class Course(models.Model):
    name = models.CharField(max_length=200)
    department = models.CharField(max_length=100, blank=True)
    professor = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.department})"


class Listing(models.Model):
    TRADE_TYPE_CHOICES = Book.TRADE_TYPE_CHOICES
    STATUS_CHOICES = Book.STATUS_CHOICES

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='listings')
    course = models.ForeignKey(Course, null=True, blank=True, on_delete=models.SET_NULL, related_name='listings')
    trade_type = models.CharField(max_length=10, choices=TRADE_TYPE_CHOICES, default='sell')
    price = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')
    condition = models.TextField(blank=True)
    note = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def discount_rate(self):
        if self.book.original_price and self.book.original_price > 0:
            rate = (1 - (self.price / self.book.original_price)) * 100
            return round(rate)
        return 0

    def __str__(self):
        return f"{self.book.title} 판매글 #{self.id}"


class TradeRequest(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='requests')
    message = models.TextField()
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} 거래 신청"
