from django.urls import path
from . import views

urlpatterns = [
    path("", views.home_view, name="home"),
    path("call_endpoint_map/", views.call_endpoint_map, name="call_endpoint_map"),
]
