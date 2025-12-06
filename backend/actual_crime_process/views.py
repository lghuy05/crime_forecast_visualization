# actual_data_process/views.py
from django.shortcuts import render
from django.http import JsonResponse
from pathlib import Path
import json

# Import your processor
from .processor import process_mlp_results


def home_view(request):
    """Home page with simple interface"""
    return render(request, "actual_crime_process/home.html")


def run_processor_view(request):
    """API endpoint to run the processor"""

    # Define your CSV path (adjust as needed)
    csv_path = Path(
        "data/mlp/results/sarasota_all_monthly_500_grid-id_20251205_190416_202302/grid_ranking.csv"
    )

    if not csv_path.exists():
        return JsonResponse(
            {
                "success": False,
                "error": f"CSV file not found: {csv_path}",
                "hint": "Make sure the file exists and path is correct",
            }
        )

    try:
        # Run the processor
        df = process_mlp_results(str(csv_path))

        if df is not None:
            return JsonResponse(
                {
                    "success": True,
                    "message": f"Processed {len(df)} grids",
                    "output_dir": "data/actual/",
                    "files_created": list_files_in_dir("data/actual/"),
                }
            )
        else:
            return JsonResponse(
                {"success": False, "error": "Processor returned no data"}
            )

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})


def list_files_in_dir(directory):
    """List files in a directory"""
    dir_path = Path(directory)
    if not dir_path.exists():
        return []

    files = []
    for file in dir_path.glob("*"):
        if file.is_file():
            files.append(
                {"name": file.name, "size": f"{file.stat().st_size / 1024:.1f} KB"}
            )
    return files


def view_results(request, period=None):
    """View processed results"""
    data_dir = Path("data/actual")

    if not data_dir.exists():
        return JsonResponse({"error": "No processed data found"})

    if period:
        # View specific period
        json_file = data_dir / f"actual_crime_{period}.json"
        if json_file.exists():
            with open(json_file) as f:
                data = json.load(f)
            return JsonResponse({"period": period, "data": data})
        else:
            return JsonResponse({"error": f"No data for period {period}"})
    else:
        # List all periods
        files = list(data_dir.glob("actual_crime_*.json"))
        periods = [f.stem.replace("actual_crime_", "") for f in files]

        return JsonResponse(
            {"available_periods": periods, "files": [f.name for f in files]}
        )
