import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function ResearchGridMap() {
  const sarasotaCenter = [27.3364, -82.5307] as [number, number];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Sarasota Crime Prediction Research
        </h2>

        {/* Map Container - Centered and Responsive */}
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500">

          <MapContainer center={[27.34, -82.35]} zoom={12} scrollWheelZoom={false} className='h-full w-full'>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
