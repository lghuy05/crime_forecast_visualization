from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ActualCrime, MLPPrediction, BaselinePrediction, MetricData
from .serializers import (
    ActualCrimeSerializer,
    MLPPredictionSerializer,
    BaselinePredictionSerializer,
    SimpleMetricSerializer,
)
from django.utils import timezone  # Fixed import
import os


@api_view(["GET"])
def api_health(request):
    """Health check endpoint for React frontend"""
    return Response(
        {
            "status": "healthy",
            "message": "API server is running",
            "timestamp": timezone.now().isoformat(),  # Fixed: use timezone.now()
        }
    )


@api_view(["GET"])
def get_top_predictions(request):
    # Get period from query parameter
    period = request.GET.get("period")
    limit_param = request.GET.get("limit")
    default_limit = 20
    max_limit = 50

    if not period:
        return Response(
            {
                "success": False,
                "error": "Period parameter is required (e.g., ?period=202302)",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        period_int = int(period)
    except ValueError:
        return Response(
            {"success": False, "error": "Period must be an integer (YYYYMM format)"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if limit_param is None:
        limit = default_limit
    else:
        try:
            limit = int(limit_param)
        except ValueError:
            return Response(
                {"success": False, "error": "Limit must be an integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if limit < 1:
            return Response(
                {"success": False, "error": "Limit must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if limit > max_limit:
            limit = max_limit

    try:
        # Get top ranked predictions for each model for this period
        # ACTUAL CRIME
        actual_data = (
            ActualCrime.objects.filter(target_period=period_int)
            .select_related("grid")
            .order_by("rank")[:limit]
        )

        # MLP PREDICTIONS
        mlp_data = (
            MLPPrediction.objects.filter(target_period=period_int)
            .select_related("grid")
            .order_by("rank")[:limit]
        )

        # BASELINE PREDICTIONS
        baseline_data = (
            BaselinePrediction.objects.filter(target_period=period_int)
            .select_related("grid")
            .order_by("rank")[:limit]
        )
        actual_serializer = ActualCrimeSerializer(actual_data, many=True)
        mlp_serializer = MLPPredictionSerializer(mlp_data, many=True)
        baseline_serializer = BaselinePredictionSerializer(baseline_data, many=True)

        # Return exactly what frontend needs
        return Response(
            {
                "success": True,
                "period": period_int,
                "data": {
                    "actual": actual_serializer.data,
                    "mlp": mlp_serializer.data,
                    "baseline": baseline_serializer.data,
                },
                "counts": {
                    "actual": len(actual_serializer.data),
                    "mlp": len(mlp_serializer.data),
                    "baseline": len(baseline_serializer.data),
                },
            }
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e),
                "message": "Failed to fetch prediction data",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def import_metrics_from_csv(request):
    """
    Hardcoded endpoint to import metrics from CSV file
    Always uses: 'data/baseline/summary_table.csv'
    """
    try:
        # Hardcoded CSV path
        csv_path = "data/baseline/summary_table.csv"

        # Check if file exists
        if not os.path.exists(csv_path):
            return Response(
                {"success": False, "error": f"File not found: {csv_path}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Import the metrics
        from .processing import MetricDataProcessor

        result = MetricDataProcessor.import_metrics_csv(csv_path)

        return Response(
            {
                "success": True,
                "message": f"Imported {result['total_rows']} rows from {csv_path}",
                "details": result,
            }
        )

    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_all_metrics(request):
    """
    Get all metrics with filtering options
    Query params: ?model=MLP&target_period=1
    """
    try:
        metrics = MetricData.objects.all().order_by("-id")

        # Apply filters
        model_filter = request.GET.get("model")
        if model_filter:
            metrics = metrics.filter(model__icontains=model_filter)

        period_filter = request.GET.get("target_period")
        if period_filter:
            try:
                metrics = metrics.filter(target_period=int(period_filter))
            except ValueError:
                pass

        serializer = SimpleMetricSerializer(metrics, many=True)

        return Response(
            {"success": True, "count": len(serializer.data), "data": serializer.data}
        )

    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_metrics_by_period(request):
    """
    Get PEI and accuracy metrics for both models (MLP and Baseline)
    filtered by period when user selects a period

    Query params:
    - period: The period to filter by (e.g., 1, 2, 3)
    - limit: Optional limit for results
    """
    try:
        # Get period from query parameter
        period = request.GET.get("period")

        if not period:
            return Response(
                {
                    "success": False,
                    "error": "Period parameter is required (e.g., ?period=1)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            period_clean = str(period).replace(",", "")
            period_int = int(period_clean)
        except ValueError:
            return Response(
                {
                    "success": False,
                    "error": "Period must be an integer (e.g., 1, 2, 3)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get all metrics for the specified period
        metrics = MetricData.objects.filter(target_period=period_int).order_by("model")
        try:
            # If your database actually stores integers with commas, you might need to filter differently
            # This is a workaround if the database stores formatted strings
            metrics = MetricData.objects.filter(
                target_period__icontains=str(period_int)
            ).order_by("model")
        except:
            pass
        # Separate MLP and Baseline metrics
        mlp_metrics = metrics.filter(model__icontains="mlp").first()
        baseline_metrics = metrics.filter(model__icontains="Lee Algorithm").first()

        # Prepare response data
        metrics_data = []

        if mlp_metrics:
            metrics_data.append(
                {
                    "model": "MLP",
                    "model_display": "MLP Predictions",
                    "pei_percent": mlp_metrics.pei_percent,
                    "accuracy": mlp_metrics.accuracy,
                    "target_period": mlp_metrics.target_period,
                    "color": "#4ECDC4",  # Teal color from your frontend
                    "icon": "🧠",  # Brain emoji for MLP
                }
            )

        if baseline_metrics:
            metrics_data.append(
                {
                    "model": "Baseline",
                    "model_display": "Baseline Predictions",
                    "pei_percent": baseline_metrics.pei_percent,
                    "accuracy": baseline_metrics.accuracy,
                    "target_period": baseline_metrics.target_period,
                    "color": "#FFD166",  # Yellow color from your frontend
                    "icon": "📊",  # Chart emoji for Baseline
                }
            )

        # If we have both models, calculate the winner
        comparison = None
        if len(metrics_data) == 2:
            mlp_data = (
                metrics_data[0]
                if metrics_data[0]["model"] == "MLP"
                else metrics_data[1]
            )
            baseline_data = (
                metrics_data[0]
                if metrics_data[0]["model"] == "Baseline"
                else metrics_data[1]
            )

            # Compare PEI
            pei_winner = (
                "MLP"
                if mlp_data["pei_percent"] > baseline_data["pei_percent"]
                else "Baseline"
            )
            pei_difference = abs(mlp_data["pei_percent"] - baseline_data["pei_percent"])

            # Compare Accuracy
            accuracy_winner = (
                "MLP"
                if mlp_data["accuracy"] > baseline_data["accuracy"]
                else "Baseline"
            )
            accuracy_difference = abs(mlp_data["accuracy"] - baseline_data["accuracy"])

            comparison = {
                "pei": {
                    "winner": pei_winner,
                    "difference": round(pei_difference, 2),
                    "mlp_value": mlp_data["pei_percent"],
                    "baseline_value": baseline_data["pei_percent"],
                },
                "accuracy": {
                    "winner": accuracy_winner,
                    "difference": round(accuracy_difference, 2),
                    "mlp_value": mlp_data["accuracy"],
                    "baseline_value": baseline_data["accuracy"],
                },
            }

        return Response(
            {
                "success": True,
                "period": period_int,
                "metrics": metrics_data,
                "comparison": comparison,
                "count": len(metrics_data),
            }
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e),
                "message": "Failed to fetch metrics data",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_available_periods(request):
    """
    Get all unique periods available in the metrics data
    Useful for populating the period selector in frontend
    """
    try:
        # Get all unique periods from the MetricData table
        periods = MetricData.objects.all().order_by("target_period")
        unique_periods = set()
        for metric in periods:
            period_value = metric.target_period

            # If it's a string with a comma, convert to integer
            if isinstance(period_value, str):
                try:
                    # Remove comma and convert to int
                    period_clean = int(period_value.replace(",", ""))
                    unique_periods.add(period_clean)
                except ValueError:
                    # If conversion fails, try as is
                    try:
                        unique_periods.add(int(period_value))
                    except:
                        pass
            else:
                # Already an integer
                unique_periods.add(period_value)

        # Sort periods
        sorted_periods = sorted(list(unique_periods))
        # Also get the model names for each period
        periods_with_models = []
        for period in sorted_periods:
            period_str = str(period)
            period_with_comma = (
                f"{period_str[:3]},{period_str[3:]}"
                if len(period_str) == 6
                else period_str
            )

            # Try to find metrics with this period (handling both formats)
            models_in_period = []

            # Try exact match
            exact_match = MetricData.objects.filter(target_period=period)
            if exact_match.exists():
                models_in_period = list(
                    exact_match.values_list("model", flat=True).distinct()
                )
            else:
                # Try string match for comma format
                str_match = MetricData.objects.filter(
                    target_period__contains=str(period)
                )
                if str_match.exists():
                    models_in_period = list(
                        str_match.values_list("model", flat=True).distinct()
                    )

            periods_with_models.append(
                {
                    "period": period,
                    "available_models": list(
                        set(models_in_period)
                    ),  # Remove duplicates
                    "period_label": f"Period {period_str}",
                }
            )

        return Response(
            {
                "success": True,
                "periods": sorted_periods,
                "periods_detail": periods_with_models,
                "count": len(sorted_periods),
            }
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e),
                "message": "Failed to fetch available periods",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
