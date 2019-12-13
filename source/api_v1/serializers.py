from webapp.models import Quote
from rest_framework import serializers


class QuoteSerializer(serializers.ModelSerializer):
    created_at = serializers.DateField(read_only=True)

    class Meta:
        model = Quote
        fields = ('id', 'text', 'author', 'email', 'status', 'rating', 'created_at')
