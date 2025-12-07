from django.urls import path
from . import views

urlpatterns = [
    path("", views.home_view, name="home"),
    path("run-mapping/", views.run_mapping_process, name="run_mapping"),
    path("test/", views.test_view, name="test"),
]
