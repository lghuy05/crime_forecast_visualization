// GridVisualizationPage.tsx - SIMPLIFIED VERSION
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

// Grid overlay configuration
interface GridCell {
  id: string;
  bounds: LatLngBoundsExpression;
  center: [number, number];
}

export default function GridVisualizationPage() {
  // State for data and UI
  const [gridData, setGridData] = useState<ApiResponse | null>(null);
  const [metricsData, setMetricsData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModels, setActiveModels] = useState<Record<ModelType, boolean>>({
    actual: true,
    mlp: true,
    baseline: true,
  });
  const [selectedPeriod, setSelectedPeriod] = useState<number>(202302);
  const [availablePeriods, setAvailablePeriods] = useState<number[]>([202302, 202303, 202304]);
  const [apiHealth, setApiHealth] = useState<boolean>(true);

  // Grid overlay states
  const [showBaseGrid, setShowBaseGrid] = useState<boolean>(true);
  const [baseGridCells, setBaseGridCells] = useState<GridCell[]>([]);
  const [gridOpacity, setGridOpacity] = useState<number>(0.2);

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

      try {
        const metricsResponse = await crimePredictionAPI.fetchMetricsByPeriod(selectedPeriod);
        setMetricsData(metricsResponse);
      } catch (metricsErr) {
        console.log('Metrics not available for this period:', metricsErr);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching grid data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, apiHealth]);

  // Generate base grid overlay
  const generateBaseGrid = useCallback(() => {
    const cells: GridCell[] = [];
    const FEET_PER_DEGREE_LAT = 366666;
    const GRID_SIZE_FEET = 500;

    // Starting reference point (from your grid #1427)
    const refSouthwestLat = 27.35500957977851;
    const refSouthwestLng = -82.5308827385306;

    // Calculate grid size in degrees
    const gridSizeDegLat = GRID_SIZE_FEET / FEET_PER_DEGREE_LAT;

    // Center latitude for longitude calculation
    const centerLat = SARASOTA_CENTER[0];
    const feetPerDegreeLng = FEET_PER_DEGREE_LAT * Math.cos(centerLat * Math.PI / 180);
    const gridSizeDegLng = GRID_SIZE_FEET / feetPerDegreeLng;

    // Number of rows and columns (cover about 5 mile radius)
    const NUM_ROWS = 50;
    const NUM_COLS = 50;

    // Generate grid cells
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        const lat = refSouthwestLat + (row * gridSizeDegLat) - (NUM_ROWS / 2 * gridSizeDegLat);
        const lng = refSouthwestLng + (col * gridSizeDegLng) - (NUM_COLS / 2 * gridSizeDegLng);

        const southwest: [number, number] = [lat, lng];
        const northeast: [number, number] = [lat + gridSizeDegLat, lng + gridSizeDegLng];
        const center: [number, number] = [lat + gridSizeDegLat / 2, lng + gridSizeDegLng / 2];

        cells.push({
          id: `grid_${row}_${col}`,
          bounds: [southwest, northeast],
          center,
        });
      }
    }

    return cells;
  }, []);

  // Initialize base grid
  useEffect(() => {
    const cells = generateBaseGrid();
    setBaseGridCells(cells);
  }, [generateBaseGrid]);

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

  // Render base grid overlay
  const renderBaseGridOverlay = useCallback(() => {
    if (!showBaseGrid || baseGridCells.length === 0) return null;

    return (
      <LayerGroup key="base-grid-overlay">
        {baseGridCells.map((cell) => (
          <Rectangle
            key={cell.id}
            bounds={cell.bounds}
            pathOptions={{
              color: '#666666',
              weight: 0.3,
              fillColor: '#4A5568',
              fillOpacity: gridOpacity,
              className: 'base-grid-cell'
            }}
          />
        ))}
      </LayerGroup>
    );
  }, [showBaseGrid, baseGridCells, gridOpacity]);

  // Render grid rectangles for a specific model
  const renderModelGrids = useCallback((model: ModelType) => {
    if (!gridData || !activeModels[model]) return null;

    const grids = gridData.data[model];
    const config = MODEL_CONFIG[model];
    const stats = calculateModelStats(model);

    return (
      <LayerGroup key={model}>
        {grids.map((grid) => (
          <Rectangle
            key={`${model}-${grid.grid_id}`}
            bounds={getGridBounds(grid)}
            pathOptions={{
              color: getColorIntensity(grid.rank, model),
              weight: 1.5,
              fillOpacity: 0.7,
              dashArray: model === 'baseline' ? '5, 5' : undefined,
            }}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({
                  weight: 2.5,
                  fillOpacity: 0.9,
                });
              },
              mouseout: (e) => {
                e.target.setStyle({
                  weight: 1.5,
                  fillOpacity: 0.7,
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
                🗺️ Crime Grid Visualization
              </h1>
              <p className="text-gray-300">
                500ft grids with crime prediction overlay
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
                  key={period}
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
          <h2 className="text-xl font-bold mb-6">📊 Visualization Controls</h2>

          {/* Grid Overlay Controls */}
          <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
            <h3 className="font-bold mb-3">🗺️ Grid Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Base Grid</span>
                <button
                  onClick={() => setShowBaseGrid(!showBaseGrid)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${showBaseGrid ? 'bg-blue-500 justify-end' : 'bg-gray-600 justify-start'
                    }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

              <div>
                <label className="text-sm block mb-2">Grid Opacity: {gridOpacity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={gridOpacity}
                  onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
                <div>• Base grid shows 500ft × 500ft cells</div>
                <div>• Grids generated from reference point</div>
                <div>• Some crime grids may not align perfectly</div>
              </div>
            </div>
          </div>

          {/* Metrics Display */}
          {renderMetricsDisplay()}

          {/* Toggle All Buttons */}
          <div className="mb-6 space-y-2">
            <button
              onClick={() => toggleAllModels(true)}
              className="w-full py-2.5 bg-green-700 hover:bg-green-600 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>✓</span>
              <span>Show All Crime Grids</span>
            </button>
            <button
              onClick={() => toggleAllModels(false)}
              className="w-full py-2.5 bg-red-700 hover:bg-red-600 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>✕</span>
              <span>Hide All Crime Grids</span>
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
                  key={model}
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
              <div className="flex items-center">
                <div className="w-4 h-4 border border-gray-500 bg-gray-800 mr-2 rounded" />
                <span className="text-sm">Base Grid (500ft)</span>
              </div>
            </div>
          </div>
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

                {/* Grid Overlay Layer Control */}
                <LayersControl.Overlay checked={showBaseGrid} name="Base Grid">
                  {renderBaseGridOverlay()}
                </LayersControl.Overlay>

                {/* Model Layers */}
                <LayersControl.Overlay checked={activeModels.actual} name="Actual Crimes">
                  {renderModelGrids('actual')}
                </LayersControl.Overlay>

                <LayersControl.Overlay checked={activeModels.mlp} name="MLP Predictions">
                  {renderModelGrids('mlp')}
                </LayersControl.Overlay>

                <LayersControl.Overlay checked={activeModels.baseline} name="Baseline Predictions">
                  {renderModelGrids('baseline')}
                </LayersControl.Overlay>
              </LayersControl>
            </MapContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
