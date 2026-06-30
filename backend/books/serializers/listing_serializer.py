from rest_framework import serializers
from ..models import Listing

class ListingSerializer(serializers.ModelSerializer):
    discount_rate = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = '__all__'
        read_only_fields = ['discount_rate']

    def get_discount_rate(self, obj):
        return obj.discount_rate
