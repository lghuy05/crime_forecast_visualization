import csv
import os
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from map_coordinate.mapping import mapping_coordinate
from storing.processing import CrimeDataProcessor, MetricDataProcessor


def _read_target_period(csv_path):
    try:
        with open(csv_path, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            first_row = next(reader, None)
            if not first_row:
                return None
            return first_row.get("Target_Period")
    except Exception:
        return None


def _mapped_outputs_exist(processed_dir, period, filenames):
    if not period:
        return False
    period_dir = processed_dir / str(period)
    return all((period_dir / filename).exists() for filename in filenames)


def _relative_source_name(path, base_dir):
    try:
        return os.path.relpath(path, base_dir)
    except ValueError:
        return os.path.basename(path)


class Command(BaseCommand):
    help = "Run end-to-end data pipeline: map raw data, generate processed files, and import into DB."

    def add_arguments(self, parser):
        parser.add_argument(
            "--data-dir",
            default="data",
            help="Base directory containing raw data (default: data)",
        )
        parser.add_argument(
            "--processed-dir",
            default="processed_data",
            help="Directory to store processed data (default: processed_data)",
        )
        parser.add_argument(
            "--coordinate-path",
            default="coordinate/coordinate.csv",
            help="Path to coordinate CSV (default: coordinate/coordinate.csv)",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Re-run mapping even if processed outputs already exist",
        )
        parser.add_argument(
            "--skip-mapping",
            action="store_true",
            help="Skip mapping step and only import processed data",
        )

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        data_dir = (base_dir / options["data_dir"]).resolve()
        processed_dir = (base_dir / options["processed_dir"]).resolve()
        coordinate_path = (base_dir / options["coordinate_path"]).resolve()
        force = options["force"]
        skip_mapping = options["skip_mapping"]

        if not data_dir.exists():
            self.stderr.write(f"Data directory not found: {data_dir}")
            return

        if not coordinate_path.exists():
            self.stderr.write(f"Coordinate file not found: {coordinate_path}")
            return

        processed_dir.mkdir(parents=True, exist_ok=True)

        mapping_summary = {
            "mlp_mapped": 0,
            "baseline_mapped": 0,
            "mlp_skipped": 0,
            "baseline_skipped": 0,
            "mapping_errors": [],
        }

        if not skip_mapping:
            mlp_results_dir = data_dir / "mlp" / "results"
            baseline_results_dir = data_dir / "baseline"

            mlp_files = list(mlp_results_dir.rglob("grid_ranking.csv"))
            baseline_files = list(baseline_results_dir.rglob("grid_ranking.csv"))

            for csv_path in sorted(mlp_files):
                period = _read_target_period(csv_path)
                outputs_exist = _mapped_outputs_exist(
                    processed_dir, period, ["mapped_mlp.csv", "mapped_actual.csv"]
                )
                if outputs_exist and not force:
                    mapping_summary["mlp_skipped"] += 1
                    continue
                try:
                    mapping_coordinate(
                        str(csv_path), str(coordinate_path), model="mlp"
                    )
                    mapping_summary["mlp_mapped"] += 1
                except Exception as exc:
                    mapping_summary["mapping_errors"].append(
                        f"MLP {csv_path}: {exc}"
                    )

            for csv_path in sorted(baseline_files):
                period = _read_target_period(csv_path)
                outputs_exist = _mapped_outputs_exist(
                    processed_dir, period, ["mapped_lee.csv"]
                )
                if outputs_exist and not force:
                    mapping_summary["baseline_skipped"] += 1
                    continue
                try:
                    mapping_coordinate(
                        str(csv_path), str(coordinate_path), model="lee"
                    )
                    mapping_summary["baseline_mapped"] += 1
                except Exception as exc:
                    mapping_summary["mapping_errors"].append(
                        f"Baseline {csv_path}: {exc}"
                    )

        import_summary = {
            "actual": [],
            "mlp": [],
            "baseline": [],
            "metrics": [],
            "import_errors": [],
        }

        for actual_path in sorted(processed_dir.rglob("mapped_actual.csv")):
            try:
                result = CrimeDataProcessor.import_actual_crime_csv(
                    str(actual_path),
                    source_name=_relative_source_name(actual_path, base_dir),
                )
                import_summary["actual"].append(
                    {"file": str(actual_path), "result": result}
                )
            except Exception as exc:
                import_summary["import_errors"].append(
                    f"Actual {actual_path}: {exc}"
                )

        for mlp_path in sorted(processed_dir.rglob("mapped_mlp.csv")):
            try:
                result = CrimeDataProcessor.import_mlp_predictions_csv(
                    str(mlp_path),
                    source_name=_relative_source_name(mlp_path, base_dir),
                )
                import_summary["mlp"].append(
                    {"file": str(mlp_path), "result": result}
                )
            except Exception as exc:
                import_summary["import_errors"].append(
                    f"MLP {mlp_path}: {exc}"
                )

        for baseline_path in sorted(processed_dir.rglob("mapped_lee.csv")):
            try:
                result = CrimeDataProcessor.import_baseline_predictions_csv(
                    str(baseline_path),
                    source_name=_relative_source_name(baseline_path, base_dir),
                )
                import_summary["baseline"].append(
                    {"file": str(baseline_path), "result": result}
                )
            except Exception as exc:
                import_summary["import_errors"].append(
                    f"Baseline {baseline_path}: {exc}"
                )

        metrics_files = []
        metrics_files.extend(
            (data_dir / "mlp" / "results").rglob("summary_table.csv")
        )
        metrics_files.extend((data_dir / "baseline").rglob("summary_table.csv"))

        for metric_path in sorted(metrics_files):
            try:
                result = MetricDataProcessor.import_metrics_csv(str(metric_path))
                import_summary["metrics"].append(
                    {"file": str(metric_path), "result": result}
                )
            except Exception as exc:
                import_summary["import_errors"].append(
                    f"Metric {metric_path}: {exc}"
                )

        self.stdout.write("Mapping summary:")
        self.stdout.write(f"  MLP mapped: {mapping_summary['mlp_mapped']}")
        self.stdout.write(f"  Baseline mapped: {mapping_summary['baseline_mapped']}")
        self.stdout.write(f"  MLP skipped: {mapping_summary['mlp_skipped']}")
        self.stdout.write(
            f"  Baseline skipped: {mapping_summary['baseline_skipped']}"
        )

        if mapping_summary["mapping_errors"]:
            self.stdout.write("Mapping errors:")
            for error in mapping_summary["mapping_errors"]:
                self.stderr.write(f"  {error}")

        self.stdout.write("Import summary:")
        self.stdout.write(f"  Actual files: {len(import_summary['actual'])}")
        self.stdout.write(f"  MLP files: {len(import_summary['mlp'])}")
        self.stdout.write(f"  Baseline files: {len(import_summary['baseline'])}")
        self.stdout.write(f"  Metric files: {len(import_summary['metrics'])}")

        if import_summary["import_errors"]:
            self.stdout.write("Import errors:")
            for error in import_summary["import_errors"]:
                self.stderr.write(f"  {error}")

        if mapping_summary["mapping_errors"] or import_summary["import_errors"]:
            self.stderr.write("Pipeline completed with errors.")
        else:
            self.stdout.write(self.style.SUCCESS("Pipeline completed successfully."))
