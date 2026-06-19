from rest_framework import viewsets
from ..models import Listing
from ..serializers.listing_serializer import ListingSerializer

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
