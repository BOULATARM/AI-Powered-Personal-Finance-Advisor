from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import HealthView, PredictView, CategoriesView, RegisterView, MeView, ChatView

urlpatterns = [
    path("health/", HealthView.as_view()),
    path("categories/", CategoriesView.as_view()),  # debug
    path("predict/", PredictView.as_view()),
    # AUTH
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", TokenObtainPairView.as_view()),  # username + password -> access/refresh
    path("auth/refresh/", TokenRefreshView.as_view()),  # refresh -> new access
    path("auth/me/", MeView.as_view()),
    path("chat/", ChatView.as_view()),
]
