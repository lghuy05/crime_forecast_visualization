import csv
import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand


def _safe_int(value):
    if value is None or value == "":
        return None
    return int(float(value))


def _safe_float(value):
    if value is None or value == "":
        return None
    return float(value)


def _load_prediction_csv(csv_path, csv_field, output_field, limit):
    rows = []
    with csv_path.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            rank = _safe_int(row.get("Rank"))
            if rank is None:
                continue
            rows.append(
                {
                    "grid_id": _safe_int(row.get("grid_id")),
                    "center_longitude": _safe_float(row.get("center_longitude")),
                    "center_latitude": _safe_float(row.get("center_latitude")),
                    "southwest_lat": _safe_float(row.get("southwest_lat")),
                    "southwest_lng": _safe_float(row.get("southwest_lng")),
                    "northeast_lat": _safe_float(row.get("northeast_lat")),
                    "northeast_lng": _safe_float(row.get("northeast_lng")),
                    "target_period": _safe_int(row.get("Target_Period")),
                    output_field: _safe_int(row.get(csv_field)),
                    "rank": rank,
                }
            )
    rows.sort(key=lambda item: item["rank"])
    return rows[:limit]


def _parse_summary_table(csv_path):
    rows = []
    with csv_path.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            target_period = row.get("target_periods") or row.get("Target_Period")
            if not target_period:
                continue
            rows.append(
                {
                    "model": row.get("model", "").strip(),
                    "target_period": _safe_int(target_period),
                    "pei_percent": _safe_float(row.get("pei_percent")),
                    "accuracy_percent": _safe_float(row.get("accuracy_percent")),
                }
            )
    return rows


class Command(BaseCommand):
    help = "Build static JSON responses from processed CSVs."

    def add_arguments(self, parser):
        parser.add_argument(
            "--output-dir",
            default=str(Path(settings.BASE_DIR) / "static_data"),
            help="Directory where static JSON files will be written.",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=20,
            help="Maximum number of rows per model.",
        )

    def handle(self, *args, **options):
        output_dir = Path(options["output_dir"])
        output_dir.mkdir(parents=True, exist_ok=True)
        limit = options["limit"]

        processed_root = Path(settings.BASE_DIR) / "processed_data"
        period_dirs = [
            path
            for path in processed_root.iterdir()
            if path.is_dir() and path.name.isdigit()
        ]

        for period_dir in sorted(period_dirs, key=lambda p: p.name):
            period = int(period_dir.name)
            actual_csv = period_dir / "mapped_actual.csv"
            mlp_csv = period_dir / "mapped_mlp.csv"
            baseline_csv = period_dir / "mapped_lee.csv"

            if not (actual_csv.exists() and mlp_csv.exists() and baseline_csv.exists()):
                self.stdout.write(
                    self.style.WARNING(
                        f"Skipping period {period}: missing mapped CSV files."
                    )
                )
                continue

            actual_data = _load_prediction_csv(
                actual_csv, "Actual_Crime_Count", "actual_crime_count", limit
            )
            mlp_data = _load_prediction_csv(
                mlp_csv, "Predicted_Crime_Count", "mlp_crime_count", limit
            )
            baseline_data = _load_prediction_csv(
                baseline_csv, "Crime_T1", "baseline_predicted_count", limit
            )

            payload = {
                "success": True,
                "period": period,
                "data": {
                    "actual": actual_data,
                    "mlp": mlp_data,
                    "baseline": baseline_data,
                },
                "counts": {
                    "actual": len(actual_data),
                    "mlp": len(mlp_data),
                    "baseline": len(baseline_data),
                },
            }

            output_path = output_dir / f"top_predictions_{period}.json"
            output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
            self.stdout.write(self.style.SUCCESS(f"Wrote {output_path}"))

        metrics_by_period = {}
        metrics_sources = list(
            (Path(settings.BASE_DIR) / "data").glob("**/summary_table.csv")
        )
        for csv_path in metrics_sources:
            for row in _parse_summary_table(csv_path):
                period = row["target_period"]
                if period is None:
                    continue
                metrics_by_period.setdefault(period, {"models": {}})
                metrics_by_period[period]["models"][row["model"]] = row

        for period, data in metrics_by_period.items():
            models = data["models"]
            metrics_data = []

            mlp_row = next(
                (row for name, row in models.items() if "mlp" in name.lower()),
                None,
            )
            baseline_row = next(
                (row for name, row in models.items() if "lee" in name.lower()),
                None,
            )

            if mlp_row:
                metrics_data.append(
                    {
                        "model": "MLP",
                        "model_display": "MLP Predictions",
                        "pei_percent": mlp_row["pei_percent"],
                        "accuracy": mlp_row["accuracy_percent"],
                        "target_period": period,
                        "color": "#4ECDC4",
                        "icon": "🧠",
                    }
                )

            if baseline_row:
                metrics_data.append(
                    {
                        "model": "Baseline",
                        "model_display": "Baseline Predictions",
                        "pei_percent": baseline_row["pei_percent"],
                        "accuracy": baseline_row["accuracy_percent"],
                        "target_period": period,
                        "color": "#FFD166",
                        "icon": "📊",
                    }
                )

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
                pei_winner = (
                    "MLP"
                    if mlp_data["pei_percent"] > baseline_data["pei_percent"]
                    else "Baseline"
                )
                pei_difference = abs(
                    mlp_data["pei_percent"] - baseline_data["pei_percent"]
                )
                accuracy_winner = (
                    "MLP"
                    if mlp_data["accuracy"] > baseline_data["accuracy"]
                    else "Baseline"
                )
                accuracy_difference = abs(
                    mlp_data["accuracy"] - baseline_data["accuracy"]
                )
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

            metrics_payload = {
                "success": True,
                "period": period,
                "metrics": metrics_data,
                "comparison": comparison,
                "count": len(metrics_data),
            }
            output_path = output_dir / f"metrics_{period}.json"
            output_path.write_text(json.dumps(metrics_payload, indent=2), encoding="utf-8")
            self.stdout.write(self.style.SUCCESS(f"Wrote {output_path}"))

        available_periods = sorted(metrics_by_period.keys())
        periods_detail = []
        for period in available_periods:
            model_names = sorted(metrics_by_period[period]["models"].keys())
            periods_detail.append(
                {
                    "period": period,
                    "available_models": model_names,
                    "period_label": f"Period {period}",
                }
            )
        available_payload = {
            "success": True,
            "periods": available_periods,
            "periods_detail": periods_detail,
            "count": len(available_periods),
        }
        available_path = output_dir / "available_periods.json"
        available_path.write_text(
            json.dumps(available_payload, indent=2), encoding="utf-8"
        )
        self.stdout.write(self.style.SUCCESS(f"Wrote {available_path}"))
