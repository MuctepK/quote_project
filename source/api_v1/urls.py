from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from api_v1.views import LogoutView, QuoteViewSet, IncreaseRatingView, DecreaseRatingView

router = routers.DefaultRouter()
router.register(r'quotes', QuoteViewSet)
app_name = 'api_v1'
urlpatterns = [
    path('', include(router.urls)),
    path('login/', obtain_auth_token, name='obtain_auth_token'),
    path('logout/', LogoutView.as_view(), name='delete_auth_token'),
    path('increase_rating/<int:pk>/', IncreaseRatingView.as_view(), name='increase_rating'),
    path('decrease_rating/<int:pk>/', DecreaseRatingView.as_view(), name='decrease_rating')
]