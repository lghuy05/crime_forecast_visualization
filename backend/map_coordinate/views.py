from requests import exceptions
from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
from .mapping import mapping_coordinate
from pathlib import Path
import json
from django.views.decorators.csrf import csrf_exempt
from pathlib import Path
import traceback


def home_view(request):
    return render(request, "map_coordinate/home.html")


@csrf_exempt
def run_mapping_process(request):
    if request.method == "POST":
        try:
            request_body = request.body.decode("utf-8")
            data = json.loads(request_body)
            model = data.get("model")
            model_data_path = data.get("model_data_path")
            coordinate_path = data.get("coordinate_path")

            try:
                df = mapping_coordinate(model_data_path, coordinate_path, model)
                return JsonResponse({"success": True})
            except Exception as e:
                return JsonResponse({"Sucess": False, "Error": str(e)})
        except Exception as e:
            return JsonResponse({"status": "failed", "error": str(e)})
    return JsonResponse({"error": "method is not allowed"})
