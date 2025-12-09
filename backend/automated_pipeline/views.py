from django.shortcuts import render
import requests
import json
from pathlib import Path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# config
ENDPOINT_map_URL = "http://localhost:8000/mapping/run-mapping/"


# Create your views here.
def home_view(request):
    return render(request, "automated_pipeline/home.html")


def call_endpoint_map(request):
    if request.method == "POST" or request.method == "GET":
        data = {
            "model": "lee",
            "model_data_path": "data/baseline/grid_ranking.csv",
            # "model_data_path": "data/baseline/grid_ranking.csv",
            "coordinate_path": "coordinate/coordinate.csv",
        }
        try:
            response = requests.post(
                ENDPOINT_map_URL,
                json=data,
                headers={"Content-Type": "application/json"},
                timeout=30,
            )

            if response.status_code == 200:
                map_response = response.json()

                return JsonResponse(
                    {
                        "message": "Success",
                        "response_from_map": map_response,
                        "request_data": data,
                    }
                )
            else:
                try:
                    error_data = response.json()
                except:
                    error_data = response.text[:500]
                return JsonResponse(
                    {
                        "message": "Failed",
                        "status_code": response.status_code,
                        "request_data": data,
                        "error": error_data,
                    }
                )

        except Exception as e:
            return JsonResponse({"error": str(e), "request_data": data})
    return JsonResponse({"error": "Method not allowed"}, status=405)
