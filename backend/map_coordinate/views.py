from django.shortcuts import render

from django.http import JsonResponse

# Create your views here.
from .mapping import mapping_coordinate
from pathlib import Path


def home_view(request):
    return render(request, "map_coordinate/home.html")


def run_mapping_process(request):
    model = "actual"
    if model == "lee":
        model_data_path = Path("data/baseline/grid_ranking.csv")
    elif model == "mlp":
        model_data_path = Path(
            "data/mlp/results/sarasota_all_monthly_500_grid-id_20251205_190416_202302/grid_ranking.csv"
        )
    elif model == "actual":
        model_data_path = Path("data/actual/actual_crime_202302.csv")
    coordinate_path = Path("coordinate/coordinate.csv")
    try:
        df = mapping_coordinate(model_data_path, coordinate_path, model)
        return JsonResponse({"success": True})
    except Exception as e:
        return JsonResponse({"Sucess": False, "Error": str(e)})


from django.http import HttpResponse


def test_view(request):
    return HttpResponse("Test endpoint works!")
