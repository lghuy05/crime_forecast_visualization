from rest_framework import fields, serializers
from .models import CrimeGrid, ActualCrime, MLPPrediction, BaselinePrediction


class GridCrimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrimeGrid
        fields = [
            "grid_id",
            "center_longitude",
            "center_latitude",
            "southwest_lng",
            "southwest_lat",
            "northeast_lat",
            "northeast_lng",
        ]


class ActualCrimeSerializer(serializers.ModelSerializer):
    grid_id = serializers.IntegerField(source="grid.grid_id", read_only=True)
    center_longitude = serializers.FloatField(
        source="grid.center_longitude", read_only=True
    )
    center_latitude = serializers.FloatField(
        source="grid.center_latitude", read_only=True
    )
    southwest_lat = serializers.FloatField(source="grid.southwest_lat", read_only=True)
    southwest_lng = serializers.FloatField(source="grid.southwest_lng", read_only=True)
    northeast_lat = serializers.FloatField(source="grid.northeast_lat", read_only=True)
    northeast_lng = serializers.FloatField(source="grid.northeast_lng", read_only=True)

    class Meta:
        model = ActualCrime
        fields = [
            "grid_id",
            "center_longitude",
            "center_latitude",
            "southwest_lat",
            "southwest_lng",
            "northeast_lat",
            "northeast_lng",
            "target_period",
            "actual_crime_count",
            "rank",
        ]


class MLPPredictionSerializer(serializers.ModelSerializer):
    grid_id = serializers.IntegerField(source="grid.grid_id", read_only=True)
    center_longitude = serializers.FloatField(
        source="grid.center_longitude", read_only=True
    )
    center_latitude = serializers.FloatField(
        source="grid.center_latitude", read_only=True
    )
    southwest_lat = serializers.FloatField(source="grid.southwest_lat", read_only=True)
    southwest_lng = serializers.FloatField(source="grid.southwest_lng", read_only=True)
    northeast_lat = serializers.FloatField(source="grid.northeast_lat", read_only=True)
    northeast_lng = serializers.FloatField(source="grid.northeast_lng", read_only=True)

    class Meta:
        model = MLPPrediction
        fields = [
            "grid_id",
            "center_longitude",
            "center_latitude",
            "southwest_lat",
            "southwest_lng",
            "northeast_lat",
            "northeast_lng",
            "target_period",
            "mlp_crime_count",  # Note: matches your model field name
            "rank",
        ]


class BaselinePredictionSerializer(serializers.ModelSerializer):
    grid_id = serializers.IntegerField(source="grid.grid_id", read_only=True)
    center_longitude = serializers.FloatField(
        source="grid.center_longitude", read_only=True
    )
    center_latitude = serializers.FloatField(
        source="grid.center_latitude", read_only=True
    )
    southwest_lat = serializers.FloatField(source="grid.southwest_lat", read_only=True)
    southwest_lng = serializers.FloatField(source="grid.southwest_lng", read_only=True)
    northeast_lat = serializers.FloatField(source="grid.northeast_lat", read_only=True)
    northeast_lng = serializers.FloatField(source="grid.northeast_lng", read_only=True)

    class Meta:
        model = BaselinePrediction
        fields = [
            "grid_id",
            "center_longitude",
            "center_latitude",
            "southwest_lat",
            "southwest_lng",
            "northeast_lat",
            "northeast_lng",
            "target_period",
            "baseline_predicted_count",  # Note: matches your model field name
            "rank",
        ]
