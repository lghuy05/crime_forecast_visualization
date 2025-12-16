from numpy import require
import pandas as pd
from pathlib import Path
import os
import math
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


def calculate_grid_bounds(
    center_lat: float, center_lng: float, grid_size_feet: float = 500
) -> dict:
    # Constants
    FEET_PER_DEGREE_LAT = 366666  # Approximately 111.111 km per degree latitude
    feet_per_degree_lng = FEET_PER_DEGREE_LAT * math.cos(math.radians(center_lat))

    half_grid_lat = grid_size_feet / 2 / FEET_PER_DEGREE_LAT
    half_grid_lng = grid_size_feet / 2 / feet_per_degree_lng

    # Calculate all four corners
    southwest = (center_lat - half_grid_lat, center_lng - half_grid_lng)
    northeast = (center_lat + half_grid_lat, center_lng + half_grid_lng)
    northwest = (center_lat + half_grid_lat, center_lng - half_grid_lng)
    southeast = (center_lat - half_grid_lat, center_lng + half_grid_lng)

    return {
        "southwest_lat": southwest[0],
        "southwest_lng": southwest[1],
        "northeast_lat": northeast[0],
        "northeast_lng": northeast[1],
        "bounds": [southwest, northeast],  # For Leaflet
    }


def getting_coordinate(csv_path: str) -> pd.DataFrame:
    # lat = ycentroid
    # long = xcentroid
    df = pd.read_csv(csv_path)
    require_columns = ["gridid", "xcentroid", "ycentroid"]

    result_df = df[require_columns].copy()
    result_df.rename(
        columns={
            "gridid": "grid_id",
            "xcentroid": "center_longitude",
            "ycentroid": "center_latitude",
        },
        inplace=True,
    )
    bounds_data = []
    for _, row in result_df.iterrows():
        bounds = calculate_grid_bounds(
            row["center_latitude"], row["center_longitude"], 500
        )
        bounds_data.append(bounds)

    # Convert to DataFrame and merge with original
    bounds_df = pd.DataFrame(bounds_data)

    # Merge bounds with coordinate data
    result_df = pd.concat([result_df, bounds_df], axis=1)
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

        for df_combined in [predicted_combined, actual_combined]:
            for col in df_combined.columns:
                if df_combined[col].dtype == "float64" and col not in [
                    "center_latitude",
                    "center_longitude",
                    "southwest_lat",
                    "southwest_lng",
                    "northeast_lat",
                    "northeast_lng",
                    "northwest_lat",
                    "northwest_lng",
                    "southeast_lat",
                    "southeast_lng",
                ]:
                    df_combined[col] = df_combined[col].astype("int32")
    else:
        df_crime_data = get_extracted_data_model(model_path, model, limit_rows)
        df_coordinate = getting_coordinate(coordinate_data_path)
        combined = pd.merge(
            df_crime_data,  # Left dataframe
            df_coordinate,  # Right dataframe
            on="grid_id",  # Join key
            how="inner",  # INNER JOIN: only rows with matching grid_id in both
        )
        for col in combined.columns:
            if combined[col].dtype == "float64" and col not in [
                "center_latitude",
                "center_longitude",
                "southwest_lat",
                "southwest_lng",
                "northeast_lat",
                "northeast_lng",
                "northwest_lat",
                "northwest_lng",
                "southeast_lat",
                "southeast_lng",
            ]:
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
