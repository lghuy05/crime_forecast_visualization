# processing.py
import csv
import os
from datetime import datetime
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from .models import (
    CrimeGrid,
    ActualCrime,
    MLPPrediction,
    BaselinePrediction,
    MetricData,
)


class CrimeDataProcessor:
    @staticmethod
    def parse_target_period(period_str):
        """Convert target period string to integer"""
        return int(period_str)

    @staticmethod
    def get_or_create_grid(grid_data):
        """Get or create a grid record"""
        grid_id = int(grid_data["grid_id"])

        grid, created = CrimeGrid.objects.update_or_create(
            grid_id=grid_id,
            defaults={
                "center_longitude": float(grid_data["center_longitude"]),
                "center_latitude": float(grid_data["center_latitude"]),
                "southwest_lat": float(grid_data["southwest_lat"]),
                "southwest_lng": float(grid_data["southwest_lng"]),
                "northeast_lat": float(grid_data["northeast_lat"]),
                "northeast_lng": float(grid_data["northeast_lng"]),
            },
        )
        return grid, created

    @staticmethod
    @transaction.atomic
    def import_actual_crime_csv(file_path, source_name=""):
        """
        Import actual crime CSV with structure:
        Rank,grid_id,Actual_Crime_Count,Target_Period,center_longitude,center_latitude,...
        """
        log_data = {
            "total_rows": 0,
            "grids_created": 0,
            "records_created": 0,
            "records_updated": 0,
            "errors": [],
        }

        try:
            with open(file_path, "r", encoding="utf-8") as file:
                reader = csv.DictReader(file)

                for row_num, row in enumerate(reader, 1):
                    try:
                        # Parse target period
                        target_period = CrimeDataProcessor.parse_target_period(
                            row["Target_Period"]
                        )

                        # Get or create grid
                        grid, grid_created = CrimeDataProcessor.get_or_create_grid(row)
                        if grid_created:
                            log_data["grids_created"] += 1

                        # Create or update actual crime record
                        actual_crime, created = ActualCrime.objects.update_or_create(
                            grid=grid,
                            target_period=target_period,
                            defaults={
                                "actual_crime_count": int(row["Actual_Crime_Count"]),
                                "rank": int(row["Rank"]) if row.get("Rank") else None,
                                "source_file": source_name
                                or os.path.basename(file_path),
                            },
                        )

                        if created:
                            log_data["records_created"] += 1
                        else:
                            log_data["records_updated"] += 1

                    except (ValueError, KeyError) as e:
                        log_data["errors"].append(f"Row {row_num}: {str(e)}")
                        continue

                    log_data["total_rows"] = row_num

            return log_data

        except Exception as e:
            log_data["errors"].append(f"File error: {str(e)}")
            raise

    @staticmethod
    def import_mlp_predictions_csv(file_path, source_name=""):
        """
        Import MLP predictions CSV
        Expected columns: grid_id,target_period,predicted_count,confidence_score
        """
        log_data = {
            "total_rows": 0,
            "grids_created": 0,
            "records_created": 0,
            "records_updated": 0,
            "errors": [],
        }

        try:
            with open(file_path, "r", encoding="utf-8") as file:
                reader = csv.DictReader(file)

                for row_num, row in enumerate(reader, 1):
                    try:
                        # Parse target period
                        target_period = CrimeDataProcessor.parse_target_period(
                            row["Target_Period"]
                        )

                        # Get or create grid
                        grid, grid_created = CrimeDataProcessor.get_or_create_grid(row)
                        if grid_created:
                            log_data["grids_created"] += 1

                        # Create or update actual crime record
                        mlp_crime, created = MLPPrediction.objects.update_or_create(
                            grid=grid,
                            target_period=target_period,
                            defaults={
                                "mlp_crime_count": int(row["Predicted_Crime_Count"]),
                                "rank": int(row["Rank"]) if row.get("Rank") else None,
                                "source_file": source_name
                                or os.path.basename(file_path),
                            },
                        )

                        if created:
                            log_data["records_created"] += 1
                        else:
                            log_data["records_updated"] += 1

                    except (ValueError, KeyError) as e:
                        log_data["errors"].append(f"Row {row_num}: {str(e)}")
                        continue

                    log_data["total_rows"] = row_num

            return log_data

        except Exception as e:
            log_data["errors"].append(f"File error: {str(e)}")
            raise

    @staticmethod
    def import_baseline_predictions_csv(file_path, source_name=""):
        """
        Import baseline predictions CSV
        Expected columns: grid_id,target_period,baseline_predicted_count
        """

        log_data = {
            "total_rows": 0,
            "grids_created": 0,
            "records_created": 0,
            "records_updated": 0,
            "errors": [],
        }

        try:
            with open(file_path, "r", encoding="utf-8") as file:
                reader = csv.DictReader(file)

                for row_num, row in enumerate(reader, 1):
                    try:
                        # Parse target period
                        target_period = CrimeDataProcessor.parse_target_period(
                            row["Target_Period"]
                        )

                        # Get or create grid
                        grid, grid_created = CrimeDataProcessor.get_or_create_grid(row)
                        if grid_created:
                            log_data["grids_created"] += 1

                        # Create or update actual crime record
                        baseline_crime, created = (
                            BaselinePrediction.objects.update_or_create(
                                grid=grid,
                                target_period=target_period,
                                defaults={
                                    "baseline_predicted_count": int(row["Crime_T1"]),
                                    "rank": int(row["Rank"])
                                    if row.get("Rank")
                                    else None,
                                    "source_file": source_name
                                    or os.path.basename(file_path),
                                },
                            )
                        )

                        if created:
                            log_data["records_created"] += 1
                        else:
                            log_data["records_updated"] += 1

                    except (ValueError, KeyError) as e:
                        log_data["errors"].append(f"Row {row_num}: {str(e)}")
                        continue

                    log_data["total_rows"] = row_num

            return log_data

        except Exception as e:
            log_data["errors"].append(f"File error: {str(e)}")
            raise


class MetricDataProcessor:
    @staticmethod
    @transaction.atomic
    def import_metrics_csv(file_path):
        """
        Import metrics from summary_table.csv

        Expected CSV format (from your reporter):
        dataset,model,temporal,grid_size,tie_breaking,target_periods,period,pei_percent,accuracy_percent

        We extract only: model, target_period, pei_percent, accuracy_percent
        """
        log_data = {
            "total_rows": 0,
            "records_created": 0,
            "records_updated": 0,
            "errors": [],
        }

        try:
            with open(file_path, "r", encoding="utf-8") as file:
                reader = csv.DictReader(file)

                for row_num, row in enumerate(reader, 1):
                    try:
                        # Extract the 4 required fields
                        model_name = row.get("model", "").strip()
                        pei_percent = float(row.get("pei_percent", 0))
                        accuracy_percent = float(row.get("accuracy_percent", 0))

                        # Get target period - use the period column (e.g., "1 Month")
                        period_str = row.get("period", "").strip()

                        # Extract just the number from period (e.g., "1 Month" -> 1)
                        target_period = 0
                        if period_str:
                            # Split by space and take first part
                            parts = period_str.split()
                            if parts:
                                try:
                                    target_period = int(parts[0])
                                except ValueError:
                                    # If not a number, use row number
                                    target_period = row_num

                        # Create or update metric record
                        metric, created = MetricData.objects.update_or_create(
                            model=model_name,
                            target_period=target_period,
                            defaults={
                                "pei_percent": pei_percent,
                                "accuracy": accuracy_percent,
                            },
                        )

                        if created:
                            log_data["records_created"] += 1
                        else:
                            log_data["records_updated"] += 1

                    except Exception as e:
                        log_data["errors"].append(f"Row {row_num}: {str(e)}")
                        continue

                    log_data["total_rows"] = row_num

            return log_data

        except Exception as e:
            log_data["errors"].append(f"File error: {str(e)}")
            raise
