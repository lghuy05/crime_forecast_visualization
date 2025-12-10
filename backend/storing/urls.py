from django.urls import path
from . import views

urlpatterns = [
    path("", views.home_view, name="home"),
    path("top_predictions/", views.get_top_predictions, name="get_top_predictions"),
]
