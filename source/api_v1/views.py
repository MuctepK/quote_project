from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet, ModelViewSet

from api_v1.serializers import QuoteSerializer
from webapp.models import Quote, STATUS_VERIFIED_CHOICE


class LogoutView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status': 'ok'})


class QuoteViewSet(ModelViewSet):
    serializer_class = QuoteSerializer
    queryset = Quote.objects.none()

    def get_queryset(self):
        print(self.request.user.is_authenticated)
        if self.request.user.is_authenticated:
            return Quote.objects.all()
        return Quote.objects.filter(status=STATUS_VERIFIED_CHOICE)

    def get_permissions(self):
        if self.action not in ['update', 'partial_update', 'destroy']:
            return [AllowAny()]
        return [IsAuthenticated()]


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

