# your_app/management/commands/import_metrics.py
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from storing.processing import MetricDataProcessor


class Command(BaseCommand):
    help = "Import metrics from summary_table.csv"

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=str,
            default="data/baseline/summary_table.csv",
            help="Path to CSV file (default: data/baseline/summary_table.csv)",
        )

    def handle(self, *args, **options):
        csv_path = options["path"]

        # Make path relative to project root
        if not os.path.isabs(csv_path):
            csv_path = os.path.join(settings.BASE_DIR, csv_path)

        self.stdout.write(f"Importing metrics from: {csv_path}")

        if not os.path.exists(csv_path):
            self.stderr.write(f"Error: File not found: {csv_path}")
            return

        try:
            result = MetricDataProcessor.import_metrics_csv(csv_path)

            self.stdout.write(
                self.style.SUCCESS(f"Successfully imported {result['total_rows']} rows")
            )
            self.stdout.write(f"Records created: {result['records_created']}")
            self.stdout.write(f"Records updated: {result['records_updated']}")

            if result["errors"]:
                self.stdout.write(
                    self.style.WARNING(f"Encountered {len(result['errors'])} errors:")
                )
                for error in result["errors"][:10]:
                    self.stdout.write(f"  {error}")

        except Exception as e:
            self.stderr.write(f"Import failed: {str(e)}")
