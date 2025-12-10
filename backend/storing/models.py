from django.db import models
from django.core.validators import MinValueValidator


class CrimeGrid(models.Model):
    """
    Base model for grid information (shared by all three tables)
    Contains geographic data and grid metadata
    """

    grid_id = models.IntegerField(
        unique=True, primary_key=True, help_text="Unique grid identifier"
    )

    # Geographic coordinates
    center_longitude = models.FloatField()
    center_latitude = models.FloatField()
    southwest_lat = models.FloatField()
    southwest_lng = models.FloatField()
    northeast_lat = models.FloatField()
    northeast_lng = models.FloatField()

    # Additional metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "crime_grids"
        verbose_name = "Crime Grid"
        verbose_name_plural = "Crime Grids"
        ordering = ["grid_id"]

    def __str__(self):
        return f"Grid {self.grid_id}"


class ActualCrime(models.Model):
    """
    Stores actual crime data
    """

    grid = models.ForeignKey(
        CrimeGrid,
        on_delete=models.CASCADE,
        related_name="actual_crimes",
        help_text="Reference to the grid",
    )

    target_period = models.IntegerField(
        help_text="YearMonth format: YYYYMM",
        validators=[MinValueValidator(202001)],  # Example validation
    )

    actual_crime_count = models.IntegerField(
        verbose_name="Actual Crime Count", validators=[MinValueValidator(0)]
    )

    rank = models.IntegerField(
        null=True, blank=True, help_text="Rank of the grid for this period"
    )

    # Processing info
    recorded_date = models.DateField(auto_now_add=True)
    source_file = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "actual_predicted"
        verbose_name = "Actual Crime Record"
        verbose_name_plural = "Actual Crime Records"
        ordering = ["target_period", "-actual_crime_count"]
        unique_together = [["grid", "target_period"]]  # One record per grid per period

    def __str__(self):
        return f"Grid {self.grid.grid_id} - {self.target_period}: {self.actual_crime_count} crimes"


class MLPPrediction(models.Model):
    """
    Stores MLP predicted crime data
    """

    grid = models.ForeignKey(
        CrimeGrid,
        on_delete=models.CASCADE,
        related_name="mlp_predicted_crimes",
        help_text="Reference to the grid",
    )

    target_period = models.IntegerField(
        help_text="YearMonth format: YYYYMM",
        validators=[MinValueValidator(202001)],  # Example validation
    )

    mlp_crime_count = models.IntegerField(
        verbose_name="Actual Crime Count", validators=[MinValueValidator(0)]
    )

    rank = models.IntegerField(
        null=True, blank=True, help_text="Rank of the grid for this period"
    )

    # Processing info
    recorded_date = models.DateField(auto_now_add=True)
    source_file = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "mlp_predicted"
        verbose_name = "MLP Prediction"
        verbose_name_plural = "MLP Predictions"
        unique_together = [["grid", "target_period"]]

    def __str__(self):
        return f"Grid {self.grid.grid_id} - {self.target_period}: {self.actual_crime_count} crimes"


class BaselinePrediction(models.Model):
    """
    Stores baseline/naive predictions
    """

    grid = models.ForeignKey(
        CrimeGrid, on_delete=models.CASCADE, related_name="baseline_predictions"
    )

    target_period = models.IntegerField(help_text="YearMonth format: YYYYMM")

    # Prediction fields
    baseline_predicted_count = models.FloatField(
        help_text="Baseline predicted crime count"
    )

    rank = models.IntegerField(
        null=True, blank=True, help_text="Rank of the grid for this period"
    )

    # Processing info
    recorded_date = models.DateField(auto_now_add=True)
    source_file = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "baseline_predicted"
        verbose_name = "Baseline Prediction"
        verbose_name_plural = "Baseline Predictions"
        unique_together = [["grid", "target_period"]]  # Can have multiple methods

    def __str__(self):
        return f"Grid {self.grid.grid_id} - {self.target_period}: {self.actual_crime_count} crimes"


class MetricData(models.Model):
    model = models.CharField(max_length=255, blank=True)
    target_period = models.IntegerField(help_text="YearMonth format: YYYYMM")
    pei_percent = models.FloatField(help_text="PEI")
    accuracy = models.FloatField(help_text="Accuracy")

    class Meta:
        db_table = "metric"
        verbose_name = "Metric"
        verbose_name_plural = "Metrics"
        unique_together = [["model", "target_period"]]

    def __str__(self):
        return f"{self.model} - {self.pei_percent} - {self.accuracy} - {self.target_period}"
