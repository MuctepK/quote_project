from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet, ModelViewSet

from api_v1.serializers import QuoteSerializer
from webapp.models import Quote, STATUS_DEFAULT_CHOICE


class LogoutView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status': 'ok'})


class QuoteViewSet(ModelViewSet):
    serializer_class = QuoteSerializer
    queryset = Quote.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Quote.objects.filter(status=STATUS_DEFAULT_CHOICE)
        return Quote.objects.all()

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return []
        else:
            return super().get_permissions()


class IncreaseRatingView(APIView):
    permission_classes = [AllowAny]
    def patch(self, request, pk):
        try:
            self.object = Quote.objects.get(pk=pk)
            self.object.rating +=1
            self.object.save()
            return Response(data={"rating": self.object.rating})
        except:
            return Response(data={"detail": "Quote not found"})


class DecreaseRatingView(APIView):
    permission_classes = [AllowAny]
    def patch(self, request, pk):
        try:
            self.object = Quote.objects.get(pk=pk)
            self.object.rating -=1
            self.object.save()
            return Response(data={"rating": self.object.rating})
        except:
            return Response(data={"detail": "Quote not found"})

