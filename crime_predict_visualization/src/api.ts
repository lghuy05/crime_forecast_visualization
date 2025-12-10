// src/api.ts - UPDATED WITH METRICS SUPPORT
export interface CrimeGrid {
  grid_id: number;
  center_longitude: number;
  center_latitude: number;
  southwest_lat: number;
  southwest_lng: number;
  northeast_lat: number;
  northeast_lng: number;
  target_period: number;
  rank: number | null;
}

export interface ActualCrimeGrid extends CrimeGrid {
  actual_crime_count: number;
}

export interface MLPCrimeGrid extends CrimeGrid {
  mlp_crime_count: number;
}

export interface BaselineCrimeGrid extends CrimeGrid {
  baseline_predicted_count: number;
}

export type ModelType = 'actual' | 'mlp' | 'baseline';

export interface ApiResponse {
  success: boolean;
  period: number;
  data: {
    actual: ActualCrimeGrid[];
    mlp: MLPCrimeGrid[];
    baseline: BaselineCrimeGrid[];
  };
  counts: {
    actual: number;
    mlp: number;
    baseline: number;
  };
  error?: string;
  message?: string;
}

// Metric data interfaces - ADDED
export interface MetricData {
  id: number;
  model: string;
  model_display: string;
  pei_percent: number;
  accuracy: number;
  target_period: number;
  color: string;
  icon: string;
}

export interface MetricComparison {
  pei: {
    winner: string;
    difference: number;
    mlp_value: number;
    baseline_value: number;
  };
  accuracy: {
    winner: string;
    difference: number;
    mlp_value: number;
    baseline_value: number;
  };
}

export interface MetricsResponse {
  success: boolean;
  period: number;
  metrics: MetricData[];
  comparison: MetricComparison | null;
  count: number;
  error?: string;
  message?: string;
}

export interface PeriodInfo {
  period: number;
  available_models: string[];
  period_label: string;
}

export interface PeriodsResponse {
  success: boolean;
  periods: number[];
  periods_detail: PeriodInfo[];
  count: number;
  error?: string;
  message?: string;
}

// Fetch all predictions data
export const fetchTopPredictions = async (period: number): Promise<ApiResponse> => {
  try {
    const API_URL = 'http://localhost:8000/api/top-predictions/';
    const response = await fetch(`${API_URL}?period=${period}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};

// Fetch metrics for a specific period - ADDED
export const fetchMetricsByPeriod = async (period: number): Promise<MetricsResponse> => {
  try {
    const API_URL = 'http://localhost:8000/api/metrics-by-period/';
    const response = await fetch(`${API_URL}?period=${period}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
};

// Fetch all available periods - ADDED
export const fetchAvailablePeriods = async (): Promise<PeriodsResponse> => {
  try {
    const API_URL = 'http://localhost:8000/api/available-periods/';
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available periods:', error);
    throw error;
  }
};

// Health check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:8000/api/health/');
    return response.ok;
  } catch {
    return false;
  }
};

// Export all functions in one object - UPDATED
export const crimePredictionAPI = {
  fetchTopPredictions,
  fetchMetricsByPeriod,  // ADDED
  fetchAvailablePeriods, // ADDED
  checkApiHealth,
};

// Also export individual functions for direct import
export default crimePredictionAPI;
