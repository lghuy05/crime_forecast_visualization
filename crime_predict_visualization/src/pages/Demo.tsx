// Demo.tsx - WITH METRICS ADDED
import React, { useState, useEffect, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Rectangle, LayersControl, LayerGroup, Tooltip, Popup } from 'react-leaflet';
import { LatLngBoundsExpression } from 'leaflet';
import { crimePredictionAPI } from '../api';
import type { ModelType, ApiResponse, MetricsResponse } from '../api';

// Model configuration
const MODEL_CONFIG = {
  actual: {
    name: 'Actual Crime',
    color: '#FF6B6B', // Red
    field: 'actual_crime_count' as const,
  },
  mlp: {
    name: 'MLP Predictions',
    color: '#4ECDC4', // Teal
    field: 'mlp_crime_count' as const,
  },
  baseline: {
    name: 'Baseline Predictions',
    color: '#FFD166', // Yellow
    field: 'baseline_predicted_count' as const,
  },
} as const;

// Default center (Sarasota)
const SARASOTA_CENTER: [number, number] = [27.3364, -82.5307];

export default function CrimePredictionMap() {
  // State for data and UI
  const [gridData, setGridData] = useState<ApiResponse | null>(null);
  const [metricsData, setMetricsData] = useState<MetricsResponse | null>(null); // Added metrics state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModels, setActiveModels] = useState<Record<ModelType, boolean>>({
    actual: true,
    mlp: true,
    baseline: true,
  });
  const [selectedPeriod, setSelectedPeriod] = useState<number>(202302);
  const [availablePeriods, setAvailablePeriods] = useState<number[]>([202302, 202303, 202304]); // Hardcoded for now
  const [apiHealth, setApiHealth] = useState<boolean>(true);

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await crimePredictionAPI.checkApiHealth();
      setApiHealth(isHealthy);
      if (!isHealthy) {
        setError('API server is not responding. Please ensure Django backend is running.');
      }
    };
    checkHealth();
  }, []);

  // Fetch data from Django backend
  const fetchGridData = useCallback(async () => {
    if (!apiHealth) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch grid data
      const gridDataResponse = await crimePredictionAPI.fetchTopPredictions(selectedPeriod);
      setGridData(gridDataResponse);

      // Fetch metrics for this period - convert YYYYMM to period number
      // Assuming: 202302 -> 1, 202303 -> 2, 202304 -> 3
      let metricPeriod = 1; // default
      if (selectedPeriod === 202302) metricPeriod = 1;
      else if (selectedPeriod === 202303) metricPeriod = 2;
      else if (selectedPeriod === 202304) metricPeriod = 3;

      try {
        const metricsResponse = await crimePredictionAPI.fetchMetricsByPeriod(metricPeriod);
        setMetricsData(metricsResponse);
      } catch (metricsErr) {
        console.log('Metrics not available for this period:', metricsErr);
        // Don't set error, just leave metrics as null
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching grid data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, apiHealth]);

  // Fetch data when period changes
  useEffect(() => {
    fetchGridData();
  }, [fetchGridData]);

  // Toggle individual model visibility
  const toggleModel = (model: ModelType) => {
    setActiveModels(prev => ({
      ...prev,
      [model]: !prev[model]
    }));
  };

  // Toggle all models on/off
  const toggleAllModels = (enable: boolean) => {
    setActiveModels({
      actual: enable,
      mlp: enable,
      baseline: enable,
    });
  };

  // Calculate grid bounds for Leaflet
  const getGridBounds = useCallback((grid: any): LatLngBoundsExpression => {
    return [
      [grid.southwest_lat, grid.southwest_lng],
      [grid.northeast_lat, grid.northeast_lng]
    ];
  }, []);

  // Get crime count for a grid based on model type
  const getCrimeCount = useCallback((grid: any, model: ModelType): number => {
    if (model === 'actual') {
      return grid.actual_crime_count;
    } else if (model === 'mlp') {
      return grid.mlp_crime_count;
    } else {
      return grid.baseline_predicted_count;
    }
  }, []);

  // Calculate color intensity based on rank
  const getColorIntensity = useCallback((rank: number | null, model: ModelType): string => {
    const baseColor = MODEL_CONFIG[model].color;

    if (rank === null) {
      return baseColor;
    }

    const intensity = Math.max(0.3, 1 - (rank / 100));
    const opacityHex = Math.round(intensity * 255).toString(16).padStart(2, '0');
    return baseColor + opacityHex;
  }, []);

  // Calculate statistics for a model
  const calculateModelStats = useCallback((model: ModelType) => {
    if (!gridData || !gridData.data[model] || gridData.data[model].length === 0) {
      return { max: 0, avg: 0, total: 0 };
    }

    const grids = gridData.data[model];
    const counts = grids.map(grid => getCrimeCount(grid, model));
    const total = counts.reduce((sum, count) => sum + count, 0);
    const max = Math.max(...counts);
    const avg = total / counts.length;

    return { max, avg, total };
  }, [gridData, getCrimeCount]);

  // Get metric for a specific model
  const getModelMetric = useCallback((modelName: string) => {
    if (!metricsData || !metricsData.metrics) return null;
    return metricsData.metrics.find(metric =>
      metric.model.toLowerCase() === modelName.toLowerCase()
    );
  }, [metricsData]);

  // Render grid rectangles for a specific model
  const renderModelGrids = useCallback((model: ModelType) => {
    if (!gridData || !activeModels[model]) return null;

    const grids = gridData.data[model];
    const config = MODEL_CONFIG[model];
    const stats = calculateModelStats(model);

    return (
      <LayerGroup key={model}> {/* Added key here */}
        {grids.map((grid) => (
          <Rectangle
            key={`${model}-${grid.grid_id}`}
            bounds={getGridBounds(grid)}
            pathOptions={{
              color: getColorIntensity(grid.rank, model),
              weight: 1,
              fillOpacity: 0.6,
              dashArray: model === 'baseline' ? '5, 5' : undefined,
            }}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({
                  weight: 3,
                  fillOpacity: 0.8,
                });
              },
              mouseout: (e) => {
                e.target.setStyle({
                  weight: 1,
                  fillOpacity: 0.6,
                });
              },
            }}
          >
            <Tooltip permanent={false} direction="top" offset={[0, -10]} opacity={0.9}>
              <div className="text-sm font-sans min-w-[180px]">
                <div className="font-bold mb-1">Grid #{grid.grid_id}</div>
                <div className="flex justify-between mb-1">
                  <span>Model:</span>
                  <span className="font-semibold" style={{ color: config.color }}>
                    {config.name}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Crime Count:</span>
                  <span className="font-bold">{getCrimeCount(grid, model).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rank:</span>
                  <span>{grid.rank || 'N/A'}</span>
                </div>
              </div>
            </Tooltip>

            <Popup>
              <div className="p-2 max-w-xs">
                <h3 className="font-bold text-lg mb-2">Grid #{grid.grid_id}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Model:</span>
                    <span style={{ color: config.color }}>{config.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Crime Count:</span>
                    <span className="font-bold">{getCrimeCount(grid, model).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Rank:</span>
                    <span>{grid.rank || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Period:</span>
                    <span>{grid.target_period}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="font-semibold mb-1">Coordinates:</div>
                    <div className="text-xs space-y-1">
                      <div>SW: {grid.southwest_lat.toFixed(6)}, {grid.southwest_lng.toFixed(6)}</div>
                      <div>NE: {grid.northeast_lat.toFixed(6)}, {grid.northeast_lng.toFixed(6)}</div>
                      <div>Center: {grid.center_latitude.toFixed(6)}, {grid.center_longitude.toFixed(6)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Rectangle>
        ))}
      </LayerGroup>
    );
  }, [gridData, activeModels, getGridBounds, getColorIntensity, getCrimeCount, calculateModelStats]);

  // Render metrics display section
  const renderMetricsDisplay = () => {
    if (!metricsData || !metricsData.metrics || metricsData.metrics.length === 0) {
      return null;
    }

    const mlpMetric = getModelMetric('MLP');
    const baselineMetric = getModelMetric('Baseline');
    const comparison = metricsData.comparison;

    return (
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4">📈 Model Performance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {mlpMetric && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${mlpMetric.color}20`, borderLeft: `4px solid ${mlpMetric.color}` }}>
              <h3 className="font-bold mb-2" style={{ color: mlpMetric.color }}>{mlpMetric.model_display}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>PEI:</span>
                  <span className="font-bold text-lg">{mlpMetric.pei_percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-bold text-lg">{mlpMetric.accuracy.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {baselineMetric && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${baselineMetric.color}20`, borderLeft: `4px solid ${baselineMetric.color}` }}>
              <h3 className="font-bold mb-2" style={{ color: baselineMetric.color }}>{baselineMetric.model_display}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>PEI:</span>
                  <span className="font-bold text-lg">{baselineMetric.pei_percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-bold text-lg">{baselineMetric.accuracy.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {comparison && mlpMetric && baselineMetric && (
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <h4 className="font-bold mb-3 text-center">🎯 Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-gray-800/50">
                <div className="text-sm text-gray-400 mb-1">PEI</div>
                <div className="text-lg font-bold" style={{ color: comparison.pei.winner === 'MLP' ? mlpMetric.color : baselineMetric.color }}>
                  {comparison.pei.winner} +{comparison.pei.difference}%
                </div>
              </div>

              <div className="text-center p-3 rounded-lg bg-gray-800/50">
                <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                <div className="text-lg font-bold" style={{ color: comparison.accuracy.winner === 'MLP' ? mlpMetric.color : baselineMetric.color }}>
                  {comparison.accuracy.winner} +{comparison.accuracy.difference}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-xl mb-4">Loading crime prediction data...</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse"></div>
        </div>
        {!apiHealth && (
          <div className="mt-4 text-yellow-400 text-sm">
            ⚠️ Waiting for API connection...
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-lg">
          <div className="text-red-400 text-2xl mb-3">❌ Error</div>
          <div className="text-white mb-4">{error}</div>
          <div className="space-y-3">
            <button
              onClick={fetchGridData}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <div>API Status: {apiHealth ? '✅ Connected' : '❌ Disconnected'}</div>
            <div>Current Period: {selectedPeriod}</div>
          </div>
        </div>
      </div>
    );
  }

  // Convert MODEL_CONFIG entries to array with proper typing
  const modelEntries = Object.entries(MODEL_CONFIG) as [ModelType, typeof MODEL_CONFIG[ModelType]][];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="p-6 border-b border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                🗺️ Sarasota Crime Prediction Hotspots
              </h1>
              <p className="text-gray-300">
                Interactive map showing top 50 predicted crime grids across three models
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">
                API Status: {apiHealth ? '✅ Connected' : '⚠️ Checking...'}
              </div>
              <div className="text-sm text-gray-400">
                Data Period: {gridData?.period || selectedPeriod}
              </div>
            </div>
          </div>

          {/* Period selector */}
          <div className="mt-6 flex items-center space-x-4">
            <label className="text-sm font-medium">Select Period:</label>
            <div className="flex flex-wrap gap-2">
              {availablePeriods.map((period) => (
                <button
                  key={period} // ADDED KEY
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded text-sm transition-all ${selectedPeriod === period
                    ? 'bg-blue-600 ring-2 ring-blue-400'
                    : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-400">Total Grids:</span>{' '}
                <span className="font-bold">
                  {gridData ? Object.values(gridData.counts).reduce((a, b) => a + b, 0) : 0}
                </span>
              </div>
              <button
                onClick={fetchGridData}
                className="px-4 py-1.5 bg-green-700 hover:bg-green-600 rounded text-sm transition-colors"
              >
                ↻ Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-80 p-6 border-r border-gray-700 bg-gray-800/50 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6">📊 Model Controls</h2>

          {/* Metrics Display - NEW SECTION */}
          {renderMetricsDisplay()}

          {/* Toggle All Buttons */}
          <div className="mb-6 space-y-2">
            <button
              onClick={() => toggleAllModels(true)}
              className="w-full py-2.5 bg-green-700 hover:bg-green-600 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>✓</span>
              <span>Show All Models</span>
            </button>
            <button
              onClick={() => toggleAllModels(false)}
              className="w-full py-2.5 bg-red-700 hover:bg-red-600 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>✕</span>
              <span>Hide All Models</span>
            </button>
          </div>

          {/* Individual Model Toggles */}
          <div className="space-y-4">
            {modelEntries.map(([model, config]) => {
              const isActive = activeModels[model];
              const count = gridData?.counts[model] || 0;
              const stats = calculateModelStats(model);
              const modelMetric = getModelMetric(config.name.replace(' Predictions', ''));

              return (
                <div
                  key={model} // ADDED KEY
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-700/30 ${isActive ? 'border-opacity-100' : 'border-opacity-30'
                    }`}
                  style={{ borderColor: config.color }}
                  onClick={() => toggleModel(model)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-5 h-5 rounded"
                        style={{ backgroundColor: config.color }}
                      />
                      <div>
                        <h3 className="font-semibold">{config.name}</h3>
                        <p className="text-sm text-gray-400">
                          {count} grid{count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${isActive ? 'bg-green-500 justify-end' : 'bg-gray-600 justify-start'
                        }`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                      </div>
                    </div>
                  </div>

                  {modelMetric && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="text-center p-2 rounded bg-gray-900/50">
                          <div className="text-xs text-gray-400">PEI</div>
                          <div className="font-bold text-green-400">{modelMetric.pei_percent.toFixed(1)}%</div>
                        </div>
                        <div className="text-center p-2 rounded bg-gray-900/50">
                          <div className="text-xs text-gray-400">Accuracy</div>
                          <div className="font-bold text-blue-400">{modelMetric.accuracy.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {count > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-600 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Max Crimes:</span>
                        <span className="font-semibold">{stats.max.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Average:</span>
                        <span className="font-semibold">{stats.avg.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Total:</span>
                        <span className="font-semibold">{stats.total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 p-4 bg-gray-900/50 rounded-lg">
            <h3 className="font-bold mb-3">Map Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#FF6B6B] mr-2 rounded" />
                <span className="text-sm">Actual Crimes</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#4ECDC4] mr-2 rounded" />
                <span className="text-sm">MLP Predictions</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#FFD166] mr-2 rounded" />
                <span className="text-sm">Baseline Predictions</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400 space-y-1">
                <div>• <span className="font-semibold">Darker colors</span> = Higher rank (more crime)</div>
                <div>• <span className="font-semibold">Dashed borders</span> = Baseline predictions</div>
                <div>• <span className="font-semibold">Hover</span> over grids for quick info</div>
                <div>• <span className="font-semibold">Click</span> grids for detailed popup</div>
                <div>• <span className="font-semibold">PEI</span> = Predictive Efficiency Index</div>
              </div>
            </div>
          </div>

          {/* Data Summary */}
          {gridData && (
            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
              <h3 className="font-bold mb-2 text-blue-300">Data Summary</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Period:</span>
                  <span className="font-semibold">{gridData.period}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Status:</span>
                  <span className="font-semibold text-green-400">Success</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Models:</span>
                  <span className="font-semibold">{metricsData?.count || 2}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-semibold">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Map Area */}
        <main className="flex-1 flex flex-col">
          {/* Map Container */}
          <div className="flex-1 relative">
            <MapContainer
              center={SARASOTA_CENTER}
              zoom={13}
              scrollWheelZoom={true}
              className="h-full w-full"
              style={{ minHeight: '600px' }}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Dark Mode">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              {/* Render all active model grids */}
              {(Object.keys(MODEL_CONFIG) as ModelType[]).map(model =>
                activeModels[model] ? renderModelGrids(model) : null
              )}
            </MapContainer>
          </div>

          {/* Footer Stats */}
          <footer className="p-4 border-t border-gray-700 bg-gray-900/50">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {modelEntries.map(([model, config]) => {
                  const count = gridData?.counts[model] || 0;
                  const stats = calculateModelStats(model);
                  const modelMetric = getModelMetric(config.name.replace(' Predictions', ''));

                  return (
                    <div
                      key={model} // ADDED KEY
                      className="p-3 rounded-lg bg-gray-800/50 border-l-4"
                      style={{ borderLeftColor: config.color }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold">{config.name}</span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-700">
                          {count} grids
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        {modelMetric && (
                          <>
                            <div className="flex justify-between">
                              <span>PEI:</span>
                              <span className="font-semibold text-green-400">{modelMetric.pei_percent.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Accuracy:</span>
                              <span className="font-semibold text-blue-400">{modelMetric.accuracy.toFixed(1)}%</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span>Max:</span>
                          <span className="font-semibold">{stats.max.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg:</span>
                          <span className="font-semibold">{stats.avg.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Performance Winner */}
                {metricsData?.comparison && (
                  <div className="p-3 rounded-lg bg-gray-800/50 border-l-4 border-purple-500">
                    <div className="text-sm font-semibold mb-2 text-purple-300">🏆 Best Performer</div>
                    <div className="text-xs text-gray-400 space-y-2">
                      <div>
                        <div className="text-gray-300 mb-1">PEI:</div>
                        <div className="font-bold" style={{
                          color: metricsData.comparison.pei.winner === 'MLP' ? '#4ECDC4' : '#FFD166'
                        }}>
                          {metricsData.comparison.pei.winner} (+{metricsData.comparison.pei.difference}%)
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-300 mb-1">Accuracy:</div>
                        <div className="font-bold" style={{
                          color: metricsData.comparison.accuracy.winner === 'MLP' ? '#4ECDC4' : '#FFD166'
                        }}>
                          {metricsData.comparison.accuracy.winner} (+{metricsData.comparison.accuracy.difference}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-gray-800/50">
                  <div className="text-sm font-semibold mb-1">Map Controls</div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>• Scroll to zoom in/out</div>
                    <div>• Drag to pan map</div>
                    <div>• Use layer control (top-right)</div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
