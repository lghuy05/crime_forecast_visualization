# actual_data_process/simple_processor.py
import pandas as pd
from pathlib import Path
import re
from datetime import datetime


def extract_actual_crime_data(csv_path: str, target_period: str = None) -> pd.DataFrame:
    """
    Read MLP CSV, extract grid_id + actual_crime_count + infer period
    """
    print(f"Reading CSV from: {csv_path}")

    df = pd.read_csv(csv_path)

    target_period_col = "Target_Period"

    actual_col = "Actual_Crime_Count"

    print(f"Total rows: {len(df)}")

    # Extract data - include target period if available
    columns_to_extract = ["grid_id", actual_col, target_period_col]

    result_df = df[columns_to_extract].copy()

    # If target period column exists, use it; otherwise use provided parameter
    if target_period_col:
        # Use the column from CSV
        result_df["target_period"] = result_df[target_period_col]
        # Drop the original column to avoid duplicates
        result_df = result_df.drop(columns=[target_period_col])
    elif target_period:
        # Use the provided parameter
        result_df["target_period"] = target_period
    else:
        # Try to infer from filename
        inferred_period = infer_period_from_filename(csv_path)
        result_df["target_period"] = inferred_period

    # Sort by actual crime count (highest to lowest)
    result_df = result_df.sort_values(actual_col, ascending=False)

    # Reset index to get rank
    result_df = result_df.reset_index(drop=True)
    result_df["actual_rank"] = result_df.index + 1

    # Rename actual crime column for consistency
    result_df = result_df.rename(columns={actual_col: "actual_crime_count"})

    # Reorder columns
    final_columns = ["grid_id", "actual_crime_count", "actual_rank", "target_period"]
    result_df = result_df[final_columns]

    print(f"\nTarget Period: {result_df['target_period'].iloc[0]}")
    print("\nTop 10 Actual Crime Grids:")
    print(result_df.head(10))

    return result_df


def infer_period_from_filename(filepath: str) -> str:
    """
    Try to extract period from filename
    Examples:
    - portland_monthly_250_201703.csv → 201703
    - sarasota_weekly_500_2021W40.csv → 2021W40
    - grid_ranking_201704.csv → 201704
    """
    filename = Path(filepath).stem

    # Try patterns
    patterns = [
        r"(\d{6})",  # YYYYMM (201703)
        r"(\d{4}W\d{2})",  # YYYYWww (2021W40)
        r"(\d{4}-\d{2})",  # YYYY-MM
    ]

    for pattern in patterns:
        match = re.search(pattern, filename)
        if match:
            return match.group(1)

    # Try to find period in parent folder names
    parent_folders = Path(filepath).parents
    for folder in parent_folders:
        for pattern in patterns:
            match = re.search(pattern, folder.name)
            if match:
                return match.group(1)

    return "unknown_period"


def process_with_period_analysis(csv_path: str):
    """Process CSV and analyze by period"""
    df = extract_actual_crime_data(csv_path)

    if df is None:
        return

    # Get unique periods
    periods = df["target_period"].unique()
    print(f"\n{'=' * 60}")
    print(f"PERIOD ANALYSIS")
    print(f"{'=' * 60}")
    print(f"Found {len(periods)} unique periods: {periods}")

    # Analyze each period
    for period in periods:
        period_df = df[df["target_period"] == period]
        if len(period_df) > 0:
            max_crime = period_df["actual_crime_count"].max()
            min_crime = period_df["actual_crime_count"].min()
            avg_crime = period_df["actual_crime_count"].mean()

            print(f"\nPeriod: {period}")
            print(f"  Grids: {len(period_df)}")
            print(f"  Max crimes: {max_crime}")
            print(f"  Min crimes: {min_crime}")
            print(f"  Avg crimes: {avg_crime:.2f}")

            # Save individual period file
            output_file = Path(csv_path).parent / f"ACTUAL_{period}.csv"
            period_df.to_csv(output_file, index=False)
            print(f"  Saved to: {output_file.name}")

    return df


# Test with your existing CSV
def test_with_your_csv():
    """Test with your actual grid_ranking.csv"""
    csv_path = "data/grid_ranking.csv"  # Your file

    if Path(csv_path).exists():
        print(f"Processing your file: {csv_path}")
        df = process_with_period_analysis(csv_path)

        if df is not None:
            # Save combined results
            output_path = "data/actual_crime_with_periods.csv"
            df.to_csv(output_path, index=False)
            print(f"\nSaved all data to: {output_path}")

            # Also save as JSON by period
            periods = df["target_period"].unique()
            for period in periods:
                period_data = df[df["target_period"] == period]
                json_path = f"data/actual_crime_{period}.json"
                period_data.to_json(json_path, orient="records")
                print(f"Saved {period} data to: {json_path}")
    else:
        print(f"File not found: {csv_path}")
