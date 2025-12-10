from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.api_health, name="home"),
    path("top-predictions/", views.get_top_predictions, name="get_top_predictions"),
]
