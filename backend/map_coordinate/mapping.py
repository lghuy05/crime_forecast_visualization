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
    if type_of_data == "actual":
        result_df = result_df.sort_values("Actual_Crime_Count", ascending=False)
        result_df = result_df.reset_index(drop=True)
        result_df["Rank"] = result_df.index + 1
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
    if model == "mlp":
        df_crime_predicted_data = get_extracted_data_model(
            model_path, model, limit_rows
        )
        df_predicted_coordinate = getting_coordinate(coordinate_data_path)
        predicted_combined = pd.merge(
            df_crime_predicted_data,  # Left dataframe
            df_predicted_coordinate,  # Right dataframe
            on="grid_id",  # Join key
            how="inner",  # INNER JOIN: only rows with matching grid_id in both
        )

        for col in ["Rank", "grid_id", "Target_Period", "Predicted_Crime_Count"]:
            if (
                col in predicted_combined.columns
                and predicted_combined[col].dtype == "float64"
            ):
                predicted_combined[col] = predicted_combined[col].astype("int32")

        # actual
        df_crime_actual_data = get_extracted_data_model(
            model_path, "actual", limit_rows
        )

        df_actual_coordinate = getting_coordinate(coordinate_data_path)
        actual_combined = pd.merge(
            df_crime_actual_data,  # Left dataframe
            df_actual_coordinate,  # Right dataframe
            on="grid_id",  # Join key
            how="inner",  # INNER JOIN: only rows with matching grid_id in both
        )

        for col in ["Rank", "grid_id", "Target_Period", "Actual_Crime_Count"]:
            if (
                col in actual_combined.columns
                and actual_combined[col].dtype == "float64"
            ):
                actual_combined[col] = actual_combined[col].astype("int32")
    else:
        df_crime_data = get_extracted_data_model(model_path, model, limit_rows)
        df_coordinate = getting_coordinate(coordinate_data_path)
        combined = pd.merge(
            df_crime_data,  # Left dataframe
            df_coordinate,  # Right dataframe
            on="grid_id",  # Join key
            how="inner",  # INNER JOIN: only rows with matching grid_id in both
        )
        for col in ["Rank", "grid_id", "Target_Period", "Crime_T1"]:
            if col in combined.columns and combined[col].dtype == "float64":
                combined[col] = combined[col].astype("int32")

    if model == "lee":
        period = str(combined["Target_Period"].iloc[0])
        csv_file = f"mapped_{model}.csv"
        path = output_path / period / csv_file
        path.parent.mkdir(parents=True, exist_ok=True)
        combined.to_csv(path, index=False)
    else:
        period = str(predicted_combined["Target_Period"].iloc[0])
        predicted_file = f"mapped_{model}.csv"
        path = output_path / period / predicted_file
        path.parent.mkdir(parents=True, exist_ok=True)
        predicted_combined.to_csv(path, index=False)

        actual_file = f"mapped_actual.csv"
        path = output_path / period / actual_file
        actual_combined.to_csv(path, index=False)

    if model == "lee":
        return combined
    else:
        return predicted_combined
