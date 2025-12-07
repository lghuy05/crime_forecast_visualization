# actual_data_process/simple_processor.py
import pandas as pd
from pathlib import Path
import os


def extract_actual_crime_data(csv_path: str) -> pd.DataFrame:
    """
    Read MLP CSV, extract grid_id + actual_crime_count + period
    """
    print(f"Reading CSV from: {csv_path}")

    df = pd.read_csv(csv_path)

    # Check required columns
    required_cols = ["grid_id", "Actual_Crime_Count", "Target_Period"]
    missing_cols = [col for col in required_cols if col not in df.columns]

    if missing_cols:
        print(f"ERROR: Missing required columns: {missing_cols}")
        print(f"Available columns: {df.columns.tolist()}")
        return None

    print(f"Total rows: {len(df)}")
    print(f"Target Period(s): {df['Target_Period'].unique()}")

    # Sort by actual crime count (highest to lowest)
    result_df = df[required_cols].copy()
    result_df = result_df.sort_values("Actual_Crime_Count", ascending=False)
    result_df = result_df.reset_index(drop=True)
    result_df["Rank"] = result_df.index + 1

    # Reorder columns
    final_columns = ["Rank", "grid_id", "Actual_Crime_Count", "Target_Period"]
    result_df = result_df[final_columns]

    return result_df


def save_actual_data_by_period(df: pd.DataFrame, output_base_dir: str = "data/actual"):
    """Save processed data by period"""
    # Create output directory
    output_dir = Path(output_base_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    if df is None or df.empty:
        print("No data to save!")
        return

    # Get unique periods
    periods = df["Target_Period"].unique()
    print(f"\nFound {len(periods)} target period(s): {list(periods)}")

    # Save each period separately
    for period in periods:
        period_df = df[df["Target_Period"] == period].copy()

        if len(period_df) > 0:
            # Save CSV
            csv_filename = f"actual_crime_{period}.csv"
            csv_path = output_dir / csv_filename
            period_df.to_csv(csv_path, index=False)

    return output_dir


def process_mlp_results(csv_path: str):
    # 1. Extract actual crime data
    df = extract_actual_crime_data(csv_path)

    if df is None:
        print("Failed to extract data.")
        return None

    # 3. Save to files
    output_dir = save_actual_data_by_period(df)

    print(f"\n{'=' * 60}")
    print(f"PROCESSING COMPLETE!")
    print(f"Output saved to: {output_dir}")
    print(f"{'=' * 60}")

    return df
