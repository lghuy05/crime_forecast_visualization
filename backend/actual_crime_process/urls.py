from django.urls import path
from . import views

urlpatterns = [
    path("", views.home_view, name="home"),
    path("run-processor/", views.run_processor_view, name="run_processor"),
    path("results/", views.view_results, name="view_results"),
    path("results/<str:period>/", views.view_results, name="view_period"),
]
