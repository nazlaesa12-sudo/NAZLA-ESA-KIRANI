import React, { useState } from 'react';
import { 
  Ship, Anchor, Navigation, Radio, Compass, Gauge, Droplet, 
  Wind, Waves, AlertTriangle, ShieldCheck, MapPin, RefreshCw, 
  Sparkles, CheckCircle2, ChevronRight, Activity, Zap, Play, Pause
} from 'lucide-react';
import { Vessel, Port, Shipment } from '../../types';

interface RealtimeTrackerProps {
  vessels: Vessel[];
  ports: Port[];
  shipments: Shipment[];
  simulating: boolean;
  onToggleSimulation: () => void;
}

export const RealtimeTracker: React.FC<RealtimeTrackerProps> = ({
  vessels,
  ports,
  shipments,
  simulating,
  onToggleSimulation
}) => {
  const [selectedVesselId, setSelectedVesselId] = useState<string>(vessels[0]?.id || 'vessel-1');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  const selectedVessel = vessels.find(v => v.id === selectedVesselId) || vessels[0];
  const originPort = ports.find(p => p.id === selectedVessel.currentPortId);
  const destPort = ports.find(p => p.id === selectedVessel.destinationPortId);
  const activeShipments = shipments.filter(s => s.vesselId === selectedVessel.id);

  // Request AI route & bunker guidance
  const handleAskAiAssistant = async () => {
    setAiLoading(true);
    setAiRecommendation(null);

    try {
      const response = await fetch('/api/ai/maritime-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Berikan analisa rute pelayaran, perkiraan bunker fuel, dan evaluasi cuaca laut untuk kapal ${selectedVessel.name}`,
          vesselInfo: {
            name: selectedVessel.name,
            speedKnots: selectedVessel.speedKnots,
            origin: originPort?.name || 'Tanjung Priok',
            destination: destPort?.name || 'Makassar',
            dwt: selectedVessel.dwt,
            fuelPercentage: selectedVessel.fuelPercentage
          },
          cargoInfo: {
            totalShipments: activeShipments.length,
            totalTon: activeShipments.reduce((sum, s) => sum + s.weightTon, 0)
          }
        })
      });

      const data = await response.json();
      setAiRecommendation(data.reply || 'Analisis operasional maritim selesai.');
    } catch (e) {
      setAiRecommendation(
        `[Sistem Navigasi Maritim MV KIRANI] Rute pelayaran ${originPort?.city || 'Jakarta'} ke ${destPort?.city || 'Makassar'} dalam kondisi aman. Rekomendasi kecepatan dinas 14.5 Knots dengan efisiensi bahan bakar maksimal.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Pusat Komando & AIS Telemetri Armada
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Monitoring Real-Time & Posisi Satelit Kapal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelacakan GPS live, telemetri mesin, cuaca perairan maritim, dan estimasi waktu sandar (ETA).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSimulation}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              simulating
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                : 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-600/30'
            }`}
          >
            {simulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{simulating ? 'Jeda Simulasi GPS' : 'Mulai Simulasi Gerak Real-Time'}</span>
          </button>
        </div>
      </div>

      {/* Fleet Vessel Selector Chips */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {vessels.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVesselId(v.id)}
            className={`p-3.5 rounded-2xl border text-left min-w-[220px] transition-all cursor-pointer ${
              selectedVesselId === v.id
                ? 'bg-pink-600 text-white border-pink-700 shadow-lg shadow-pink-600/25'
                : 'bg-white hover:bg-pink-50 text-slate-800 border-pink-100 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-extrabold truncate ${selectedVesselId === v.id ? 'text-white' : 'text-slate-900'}`}>
                {v.name}
              </span>
              <span className={`w-2 h-2 rounded-full ${v.status === 'berlayar' ? 'bg-emerald-400 animate-ping' : 'bg-slate-300'}`}></span>
            </div>
            <div className={`text-[11px] mt-1 ${selectedVesselId === v.id ? 'text-pink-100' : 'text-slate-500'}`}>
              {v.callSign} • {v.speedKnots} Knots • {v.status}
            </div>
          </button>
        ))}
      </div>

      {/* Main Radar Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Vessel Cockpit Instruments */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Selected Vessel Profile Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-pink-500/30 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                <Anchor className="w-4 h-4 text-pink-500" />
                Instrumen Anjungan Kapal
              </span>
              <span className="px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[11px] font-mono font-bold">
                {selectedVessel.imoNumber}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-black text-white">{selectedVessel.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Nakhoda: <span className="text-pink-300 font-bold">{selectedVessel.captainName}</span>
              </p>
            </div>

            {/* Gauges Grid */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-pink-500/20">
                <Gauge className="w-4 h-4 text-pink-400 mx-auto mb-1" />
                <div className="text-lg font-extrabold text-white">{selectedVessel.speedKnots}</div>
                <div className="text-[10px] text-slate-400">Kecepatan (Knots)</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-pink-500/20">
                <Compass className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <div className="text-lg font-extrabold text-white">{selectedVessel.heading}°</div>
                <div className="text-[10px] text-slate-400">Haluan (Heading)</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-pink-500/20">
                <Droplet className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-lg font-extrabold text-white">{selectedVessel.fuelPercentage}%</div>
                <div className="text-[10px] text-slate-400">Bunker Fuel</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-pink-500/20">
                <Activity className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-lg font-extrabold text-white">{selectedVessel.engineRpm}</div>
                <div className="text-[10px] text-slate-400">Main Engine RPM</div>
              </div>
            </div>

            {/* Coordinates & Route Details */}
            <div className="mt-4 p-3.5 rounded-2xl bg-pink-950/40 border border-pink-800/40 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Posisi Koordinat GPS:</span>
                <span className="font-mono font-bold text-pink-300">
                  {selectedVessel.currentLat.toFixed(4)}° S, {selectedVessel.currentLng.toFixed(4)}° E
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Rute Pelayaran:</span>
                <span className="font-semibold text-white">
                  {originPort?.city || 'Jakarta'} → {destPort?.city || 'Makassar'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Estimasi Tiba (ETA):</span>
                <span className="font-bold text-emerald-400">
                  {selectedVessel.eta ? new Date(selectedVessel.eta).toLocaleString('id-ID') : '19 Sep 2026 14:30 WIB'}
                </span>
              </div>
            </div>

            {/* AI Assistant Button */}
            <div className="mt-5">
              <button
                onClick={handleAskAiAssistant}
                disabled={aiLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-pink-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                <span>{aiLoading ? 'Menganalisis Rute Maritim...' : 'Konsultasi AI Maritim MV KIRANI'}</span>
              </button>
            </div>
          </div>

          {/* AI Response Card */}
          {aiRecommendation && (
            <div className="bg-white rounded-3xl p-5 border border-pink-200 shadow-md animate-in fade-in slide-in-from-top-3">
              <div className="flex items-center gap-2 text-pink-700 font-bold text-xs mb-2">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>Rekomendasi Navigasi & Bunker AI:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {aiRecommendation}
              </p>
            </div>
          )}

          {/* Marine Weather & Safety Bulletin */}
          <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-sky-600" />
              Info Cuaca BMKG Maritim & Keselamatan
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100">
                <div className="text-[10px] text-slate-500 font-medium">Tinggi Gelombang</div>
                <div className="text-sm font-extrabold text-slate-800 mt-0.5">1.2 - 1.5 Meter</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Kategori Tenang (Aman)</div>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100">
                <div className="text-[10px] text-slate-500 font-medium">Kecepatan Angin</div>
                <div className="text-sm font-extrabold text-slate-800 mt-0.5">12 - 16 Knots</div>
                <div className="text-[10px] text-slate-500">Arah Barat Laut</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Status Pelayaran: <strong>GREEN LIGHT (Izin Berlayar Diberikan)</strong></span>
            </div>
          </div>

        </div>

        {/* Right: Full High-Tech AIS Radar Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-pink-100 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-pink-600" />
                <span>Peta Satelit AIS & Koridor ALKI Indonesia</span>
              </h3>
              <p className="text-xs text-slate-500">
                Menampilkan posisi real-time armada MV KIRANI dan lintasan pelabuhan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live AIS Stream
              </span>
            </div>
          </div>

          {/* Interactive Tactical Nautical Map */}
          <div className="relative w-full h-[450px] bg-slate-950 rounded-2xl overflow-hidden border border-pink-500/30 p-2 shadow-inner">
            <svg viewBox="0 0 900 450" className="w-full h-full">
              {/* Radar circular sweeping lines */}
              <defs>
                <pattern id="radarSubGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(236, 72, 153, 0.12)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="900" height="450" fill="url(#radarSubGrid)" />

              {/* Radar Rings from Center */}
              <circle cx="450" cy="225" r="180" fill="none" stroke="rgba(236, 72, 153, 0.15)" strokeWidth="1" strokeDasharray="5 5" />
              <circle cx="450" cy="225" r="100" fill="none" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="1" strokeDasharray="3 3" />

              {/* Landmass Outlines (Indonesia Islands) */}
              {/* Sumatra */}
              <path d="M 120 80 L 200 160 L 260 230 L 230 260 L 170 190 L 100 100 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              {/* Java */}
              <path d="M 230 270 L 430 270 L 430 300 L 230 300 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              {/* Kalimantan */}
              <path d="M 330 110 L 460 100 L 490 220 L 370 230 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              {/* Sulawesi */}
              <path d="M 530 120 L 600 130 L 580 190 L 600 240 L 540 260 L 530 200 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              {/* Maluku */}
              <circle cx="680" cy="220" r="16" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              {/* Papua */}
              <path d="M 720 160 L 870 160 L 860 260 L 730 270 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />

              {/* Major Shipping Lanes (ALKI) */}
              <path d="M 260 275 Q 400 245 550 245" fill="none" stroke="#ec4899" strokeWidth="3" strokeDasharray="8 6" className="animate-pulse" />
              <path d="M 370 275 Q 420 210 460 170" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5 5" />
              <path d="M 215 155 L 150 95" fill="none" stroke="#fb7185" strokeWidth="2" strokeDasharray="5 5" />
              <path d="M 550 245 Q 640 220 750 190" fill="none" stroke="#fb7185" strokeWidth="2" strokeDasharray="5 5" />

              {/* Port Hubs */}
              {ports.map((port, idx) => {
                // Map lat/lng roughly to SVG coordinate space
                // Lng range approx 95 to 140 -> mapped to 60 to 860
                // Lat range approx 6 to -10 -> mapped to 60 to 380
                const x = 60 + ((port.lng - 95) / (140 - 95)) * 780;
                const y = 60 + ((6 - port.lat) / (6 - -10)) * 320;

                return (
                  <g key={port.id} transform={`translate(${x}, ${y})`}>
                    <circle cx="0" cy="0" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="0" y="16" fill="#fda4af" fontSize="10" textAnchor="middle" fontWeight="bold">
                      {port.name.replace('Pelabuhan ', '')}
                    </text>
                  </g>
                );
              })}

              {/* ALL FLEET VESSEL PINS */}
              {vessels.map((v) => {
                const x = 60 + ((v.currentLng - 95) / (140 - 95)) * 780;
                const y = 60 + ((6 - v.currentLat) / (6 - -10)) * 320;
                const isSelected = v.id === selectedVessel.id;

                return (
                  <g 
                    key={v.id} 
                    transform={`translate(${x}, ${y})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedVesselId(v.id)}
                  >
                    {isSelected && (
                      <circle cx="0" cy="0" r="22" fill="#ec4899" opacity="0.35" className="animate-ping" />
                    )}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? 10 : 7} 
                      fill={isSelected ? '#ec4899' : '#38bdf8'} 
                      stroke="#ffffff" 
                      strokeWidth="2.5" 
                    />
                    
                    {/* Vessel Heading Vector */}
                    <line 
                      x1="0" 
                      y1="0" 
                      x2={Math.cos((v.heading - 90) * Math.PI / 180) * 20} 
                      y2={Math.sin((v.heading - 90) * Math.PI / 180) * 20} 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                    />

                    {/* Vessel Label Badge */}
                    <g transform="translate(12, -18)">
                      <rect 
                        x="0" 
                        y="0" 
                        width="110" 
                        height="28" 
                        rx="6" 
                        fill={isSelected ? '#831843' : '#0f172a'} 
                        stroke={isSelected ? '#f472b6' : '#38bdf8'} 
                        strokeWidth="1.5" 
                      />
                      <text x="8" y="13" fill="#ffffff" fontSize="10" fontWeight="bold">
                        {v.name}
                      </text>
                      <text x="8" y="23" fill={isSelected ? '#fbcfe8' : '#7dd3fc'} fontSize="8">
                        {v.speedKnots} Knots • {v.callSign}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-pink-600 border border-white"></span> Kapal Dipilih ({selectedVessel.name})
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-sky-400"></span> Armada Lain
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span> Pelabuhan Singgah
              </span>
            </div>

            <div className="font-mono text-pink-700 font-bold">
              ALKI I, II & III Koridor Maritim Nasional
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
