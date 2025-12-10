from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.api_health, name="home"),
    path("top-predictions/", views.get_top_predictions, name="get_top_predictions"),
    path("metric-store/", views.import_metrics_from_csv, name="metric-store"),
    path("metric-get/", views.get_all_metrics, name="get_all_metrics"),
    path("metrics-by-period/", views.get_metrics_by_period, name="metrics-by-period"),
    path("get_all_metrics/", views.get_available_periods, name="get_all_metrics"),
]
