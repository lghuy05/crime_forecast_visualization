from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ActualCrime, MLPPrediction, BaselinePrediction
from .serializers import (
    ActualCrimeSerializer,
    MLPPredictionSerializer,
    BaselinePredictionSerializer,
)


def home_view(request):
    return render(request, "storing/home.html")


@api_view(["GET"])
def get_top_predictions(request):
    # Get period from query parameter
    period = request.GET.get("period")

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

    try:
        # Get top 50 ranked predictions for each model for this period
        # ACTUAL CRIME
        actual_data = (
            ActualCrime.objects.filter(target_period=period_int)
            .select_related("grid")
            .order_by("rank")[:50]
        )

        # MLP PREDICTIONS
        mlp_data = (
            MLPPrediction.objects.filter(target_period=period_int)
            .select_related("grid")
            .order_by("rank")[:50]
        )

        # BASELINE PREDICTIONS
        baseline_data = (
            BaselinePrediction.objects.filter(target_period=period_int)
            .select_related("grid")
            .order_by("rank")[:50]
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
