from webapp.models import Quote
from rest_framework import serializers


class QuoteSerializer(serializers.ModelSerializer):
    created_at = serializers.DateField()

    class Meta:
        model = Quote
        fields = ('text', 'author', 'email', 'status', 'rating', 'created_at')
