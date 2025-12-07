from numpy import require
import pandas as pd
from pathlib import Path
import os

from pandas._libs.hashtable import mode


def get_extracted_data_model(
    csv_path: str, type_of_data: str, limit=100
) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    if type_of_data == "mlp":
        model = "Predicted_Crime_Count"
    elif type_of_data == "lee":
        model = "Crime_T1"
    elif type_of_data == "actual":
        model = "Actual_Crime_Count"
    require_columns = ["Rank", "grid_id", model, "Target_Period"]
    result_df = df[require_columns].copy()
    result_df = result_df.sort_values("Rank").head(limit)
    return result_df


def getting_coordinate(csv_path: str) -> pd.DataFrame:
    # lat = ycentroid
    # long = xcentroid
    df = pd.read_csv(csv_path)
    require_columns = ["gridid", "xcentroid", "ycentroid"]

    result_df = df[require_columns].copy()
    result_df.rename(
        columns={
            "gridid": "grid_id",
            "xcentroid": "longitude",
            "ycentroid": "latitude",
        },
        inplace=True,
    )
    return result_df


def mapping_coordinate(
    model_path: str, coordinate_data_path: str, model: str
) -> pd.DataFrame:
    limit_rows = 100
    output_path = Path("processed_data/")
    output_path.mkdir(parents=True, exist_ok=True)

    df_crime_data = get_extracted_data_model(model_path, model, limit_rows)
    df_coordinate = getting_coordinate(coordinate_data_path)
    combined = pd.merge(
        df_crime_data,  # Left dataframe
        df_coordinate,  # Right dataframe
        on="grid_id",  # Join key
        how="inner",  # INNER JOIN: only rows with matching grid_id in both
    )
    if model == "lee":
        model_column = "Crime_T1"
    elif model == "mlp":
        model_column = "Predicted_Crime_Count"
    else:
        model_column = "Actual_Crime_Count"

    for col in ["Rank", "grid_id", "Target_Period", model_column]:
        if col in combined.columns and combined[col].dtype == "float64":
            combined[col] = combined[col].astype("int32")
    csv_file = f"mapped_{model}.csv"
    path = output_path / csv_file
    combined.to_csv(path, index=False)

    return combined
