import os
from django.core.management.base import BaseCommand
from storing.processing import CrimeDataProcessor


class Command(BaseCommand):
    help = "Import actual crime data from CSV"

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str, help="Path to CSV file")
        parser.add_argument("--source", type=str, default="", help="Source name")

    def handle(self, *args, **options):
        csv_file = options["csv_file"]
        source = options["source"]

        if not os.path.exists(csv_file):
            self.stderr.write(f"File not found: {csv_file}")
            return

        self.stdout.write(f"Processing {csv_file}...")

        try:
            result = CrimeDataProcessor.import_mlp_predictions_csv(csv_file)

            self.stdout.write(f"Total rows processed: {result['total_rows']}")
            self.stdout.write(f"Grids created: {result['grids_created']}")
            self.stdout.write(f"Records created: {result['records_created']}")
            self.stdout.write(f"Records updated: {result['records_updated']}")

            if result["errors"]:
                self.stdout.write(f"Errors ({len(result['errors'])}):")
                for error in result["errors"]:
                    self.stderr.write(f"  {error}")
            else:
                self.stdout.write(self.style.SUCCESS("Import completed successfully!"))

        except Exception as e:
            self.stderr.write(f"Error: {e}")
