import React, { useState, useMemo } from 'react';
import { 
  Ship, Anchor, Navigation, TrendingUp, Package, Clock, CheckCircle2, 
  AlertTriangle, Search, Eye, ArrowUpRight, Gauge, Droplet, Wind, 
  MapPin, ShieldAlert, Sparkles, Filter, ExternalLink, Calendar,
  CreditCard, ChevronRight, Activity, Zap
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Vessel, Port, Shipment, Customer, Invoice } from '../types';

interface DashboardProps {
  vessels: Vessel[];
  ports: Port[];
  shipments: Shipment[];
  customers: Customer[];
  invoices: Invoice[];
  onSelectShipment: (shipment: Shipment) => void;
  onNavigateTab: (tab: string) => void;
  onViewBillOfLading: (shipment: Shipment) => void;
  onOpenNewShipment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  vessels,
  ports,
  shipments,
  customers,
  invoices,
  onSelectShipment,
  onNavigateTab,
  onViewBillOfLading,
  onOpenNewShipment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVesselFilter, setSelectedVesselFilter] = useState('all');

  // Flagship Vessel (MV KIRANI)
  const flagshipVessel = vessels.find(v => v.name === 'MV KIRANI') || vessels[0];

  // Key KPI Calculations
  const stats = useMemo(() => {
    const activeVessels = vessels.filter(v => v.status === 'berlayar').length;
    const inTransitShipments = shipments.filter(s => s.status === 'in_transit').length;
    const totalWeightTon = shipments.reduce((sum, s) => sum + (s.weightTon || 0), 0);
    const totalTeu = shipments.reduce((sum, s) => sum + (s.quantity || 0), 0);
    
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const paidRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);

    const onTimeRate = 98.6;

    return {
      activeVessels,
      totalVessels: vessels.length,
      inTransitShipments,
      totalShipments: shipments.length,
      totalWeightTon,
      totalTeu,
      totalRevenue,
      paidRevenue,
      onTimeRate
    };
  }, [vessels, shipments, invoices]);

  // Chart Data: Monthly Freight Trends
  const monthlyTrends = [
    { month: 'Apr', volumeTon: 18400, teu: 520, revenue: 1.42 },
    { month: 'Mei', volumeTon: 21200, teu: 610, revenue: 1.68 },
    { month: 'Jun', volumeTon: 24800, teu: 740, revenue: 1.95 },
    { month: 'Jul', volumeTon: 22600, teu: 680, revenue: 1.80 },
    { month: 'Agu', volumeTon: 28900, teu: 830, revenue: 2.34 },
    { month: 'Sep (Est)', volumeTon: 31500, teu: 890, revenue: 2.58 }
  ];

  // Port Traffic Distribution Data
  const portTrafficData = useMemo(() => {
    const portMap: Record<string, number> = {};
    shipments.forEach(s => {
      const pDest = ports.find(p => p.id === s.destinationPortId);
      const name = pDest ? pDest.city : 'Lainnya';
      portMap[name] = (portMap[name] || 0) + s.weightTon;
    });

    const colors = ['#ec4899', '#f43f5e', '#fb7185', '#be185d', '#fda4af', '#f472b6'];
    return Object.entries(portMap).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length]
    }));
  }, [shipments, ports]);

  // Filtered Shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const matchSearch = 
        s.shippingOrderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.blNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.cargoDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchVessel = selectedVesselFilter === 'all' || s.vesselId === selectedVesselFilter;

      return matchSearch && matchVessel;
    });
  }, [shipments, searchQuery, selectedVesselFilter]);

  const formatRupiah = (val: number) => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(2)} M`;
    }
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getStatusBadge = (status: Shipment['status']) => {
    switch (status) {
      case 'in_transit':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-300 animate-pulse"><Navigation className="w-3 h-3" /> Berlayar</span>;
      case 'loading':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300"><Clock className="w-3 h-3" /> Pemuatan</span>;
      case 'berthing':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-300"><Anchor className="w-3 h-3" /> Sandar</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">Draft</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white p-6 sm:p-8 shadow-xl shadow-pink-900/10 overflow-hidden">
        {/* Abstract Radar Grid Background */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full border border-pink-400/30 flex items-center justify-center pointer-events-none">
          <div className="w-60 h-60 rounded-full border border-pink-400/20 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border border-pink-400/30"></div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-pink-100 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-pink-200" />
              Sistem Angkutan Laut Terpadu • Armada MV KIRANI
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
              Dashboard Operasional & Pemantauan Maritim
            </h1>
            <p className="text-pink-100 text-sm mt-1 max-w-2xl leading-relaxed">
              Monitoring pengiriman barang secara real-time antar pulau di Indonesia dengan status manifest, posisi AIS armada, dan analitik muatan kargo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewShipment}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-pink-50 text-pink-700 font-bold text-sm shadow-lg shadow-pink-950/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Package className="w-4 h-4 text-pink-600" />
              <span>+ Buat Surat Jalan Baru</span>
            </button>
            <button
              onClick={() => onNavigateTab('tracking')}
              className="px-5 py-3 rounded-2xl bg-pink-800/60 hover:bg-pink-800 text-white font-semibold text-sm border border-pink-400/40 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-emerald-300" />
              <span>Buka Radar AIS Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Armada Berlayar */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Armada Berlayar</span>
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <Ship className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.activeVessels}</span>
            <span className="text-xs font-semibold text-slate-500">/ {stats.totalVessels} Kapal Siap</span>
          </div>
          <div className="mt-2 text-xs text-pink-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            MV KIRANI sedang berlayar ke Makassar
          </div>
        </div>

        {/* Metric 2: Muatan In-Transit */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Muatan Dalam Perjalanan</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.inTransitShipments}</span>
            <span className="text-xs font-semibold text-slate-500">Manifest Aktif</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 font-medium">
            Total Tonase: <span className="font-bold text-pink-700">{stats.totalWeightTon.toLocaleString()} Ton</span>
          </div>
        </div>

        {/* Metric 3: Total Omzet / Freight Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendapatan Uang Tambang</span>
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{formatRupiah(stats.totalRevenue)}</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Terbayar: {formatRupiah(stats.paidRevenue)}
          </div>
        </div>

        {/* Metric 4: On-Time Performance */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ketepatan Waktu (OTP)</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.onTimeRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Sangat Baik</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Standar ISO Keselamatan Maritim
          </div>
        </div>

      </div>

      {/* Flagship Vessel Live Cockpit & Mini Interactive Radar Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Flagship MV KIRANI Telemetry Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-pink-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Live Vessel Telemetry</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-[11px] font-semibold text-pink-300">
                {flagshipVessel.imoNumber}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-600/30 border border-pink-500/50 flex items-center justify-center text-pink-400">
                <Anchor className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">{flagshipVessel.name}</h3>
                <p className="text-xs text-slate-400">Nakhoda: <span className="text-pink-300 font-semibold">{flagshipVessel.captainName}</span></p>
              </div>
            </div>

            {/* Position & Destination Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block font-medium">Pelabuhan Asal</span>
                <span className="text-sm font-bold text-white mt-0.5 block truncate">Tanjung Priok (JKT)</span>
                <span className="text-[10px] text-slate-500">Bertolak: 17 Sep, 06:15</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block font-medium">Pelabuhan Tujuan</span>
                <span className="text-sm font-bold text-pink-300 mt-0.5 block truncate">Makassar (MAK)</span>
                <span className="text-[10px] text-emerald-400 font-semibold">ETA: 19 Sep, 14:30 WIB</span>
              </div>
            </div>

            {/* Live Metrics Gauges */}
            <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-pink-500/20">
                <div className="flex items-center justify-center gap-1 text-pink-400 text-xs font-semibold mb-1">
                  <Gauge className="w-3.5 h-3.5" /> Speed
                </div>
                <span className="text-xl font-extrabold text-white">{flagshipVessel.speedKnots}</span>
                <span className="text-[10px] text-slate-400 block">Knots</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-pink-500/20">
                <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold mb-1">
                  <Droplet className="w-3.5 h-3.5" /> Bunker
                </div>
                <span className="text-xl font-extrabold text-white">{flagshipVessel.fuelPercentage}%</span>
                <span className="text-[10px] text-slate-400 block">MGO Fuel</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-pink-500/20">
                <div className="flex items-center justify-center gap-1 text-sky-400 text-xs font-semibold mb-1">
                  <Wind className="w-3.5 h-3.5" /> Gelombang
                </div>
                <span className="text-xl font-extrabold text-white">1.2m</span>
                <span className="text-[10px] text-slate-400 block">Aman / Tenang</span>
              </div>
            </div>

            {/* GPS Coordinates Bar */}
            <div className="mt-4 p-3 rounded-xl bg-pink-950/40 border border-pink-800/40 flex items-center justify-between text-xs">
              <span className="text-pink-300 flex items-center gap-1.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                Lat: {flagshipVessel.currentLat.toFixed(4)}° S | Lng: {flagshipVessel.currentLng.toFixed(4)}° E
              </span>
              <span className="text-slate-400 font-semibold text-[11px]">Laut Jawa</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('tracking')}
              className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              Lihat Detail AIS & Telemetri Lengkap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Maritime Interactive Radar Map of Indonesian Archipelago */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-pink-100 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-pink-600" />
                <span>Peta Rute Pelayaran & Posisi Real-Time</span>
              </h3>
              <p className="text-xs text-slate-500">
                Jalur ALKI Maritim Indonesia (Jakarta - Surabaya - Makassar - Batam - Balikpapan - Sorong)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tracking')}
              className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200 flex items-center gap-1 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Layar Penuh</span>
            </button>
          </div>

          {/* SVG Map of Indonesia with live animated vessels */}
          <div className="relative w-full h-[270px] bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-pink-500/20 p-2 shadow-inner">
            <svg viewBox="0 0 800 360" className="w-full h-full">
              {/* Nautical Grid Lines */}
              <defs>
                <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(236, 72, 153, 0.15)" strokeWidth="0.5"/>
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <rect width="800" height="360" fill="url(#radarGrid)" />

              {/* Major Indonesian Island Landmass Simplified Shapes */}
              {/* Sumatra */}
              <path d="M 120 70 L 190 140 L 250 200 L 220 220 L 160 160 L 100 90 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />
              {/* Java */}
              <path d="M 220 230 L 390 230 L 390 255 L 220 255 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />
              {/* Kalimantan */}
              <path d="M 300 90 L 410 80 L 440 180 L 330 190 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />
              {/* Sulawesi */}
              <path d="M 470 100 L 530 110 L 510 160 L 530 200 L 480 220 L 470 170 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />
              {/* Papua */}
              <path d="M 640 130 L 770 130 L 760 210 L 650 220 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />

              {/* Shipping Route Lines */}
              {/* Route 1: Jakarta to Makassar (MV KIRANI) */}
              <path d="M 240 235 Q 360 210 490 210" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="6 4" className="animate-pulse" />
              {/* Route 2: Surabaya to Balikpapan */}
              <path d="M 330 235 Q 370 180 400 150" fill="none" stroke="#fb7185" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Route 3: Batam to Belawan */}
              <path d="M 195 135 L 140 85" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Port Pin Markers */}
              {/* Tanjung Priok Jakarta */}
              <circle cx="240" cy="235" r="5" fill="#f43f5e" />
              <text x="240" y="252" fill="#fda4af" fontSize="10" textAnchor="middle" fontWeight="bold">Tanjung Priok</text>

              {/* Tanjung Perak Surabaya */}
              <circle cx="330" cy="235" r="4" fill="#fb7185" />
              <text x="330" y="252" fill="#94a3b8" fontSize="9" textAnchor="middle">Surabaya</text>

              {/* Makassar */}
              <circle cx="490" cy="210" r="5" fill="#ec4899" />
              <text x="490" y="228" fill="#fda4af" fontSize="10" textAnchor="middle" fontWeight="bold">Makassar</text>

              {/* Batam */}
              <circle cx="195" cy="135" r="4" fill="#fb7185" />
              <text x="195" y="125" fill="#94a3b8" fontSize="9" textAnchor="middle">Batam</text>

              {/* Balikpapan */}
              <circle cx="400" cy="150" r="4" fill="#fb7185" />
              <text x="400" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Balikpapan</text>

              {/* Sorong Papua */}
              <circle cx="670" cy="150" r="4" fill="#fb7185" />
              <text x="670" y="140" fill="#94a3b8" fontSize="9" textAnchor="middle">Sorong</text>

              {/* LIVE VESSEL PIN: MV KIRANI (Position in Java Sea) */}
              <g transform="translate(365, 218)">
                <circle cx="0" cy="0" r="14" fill="#ec4899" opacity="0.3" className="animate-ping" />
                <circle cx="0" cy="0" r="7" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
                <polygon points="0,-10 5,6 -5,6" fill="#ffffff" transform="rotate(78)" />
                <rect x="10" y="-12" width="90" height="22" rx="4" fill="#831843" stroke="#ec4899" strokeWidth="1" />
                <text x="16" y="2" fill="#ffffff" fontSize="10" fontWeight="bold">MV KIRANI</text>
                <text x="16" y="12" fill="#fbcfe8" fontSize="7">14.8 Knots • 78°</text>
              </g>

              {/* LIVE VESSEL PIN: MV KIRANI EXPRESS (Malacca Strait) */}
              <g transform="translate(170, 110)">
                <circle cx="0" cy="0" r="4" fill="#38bdf8" />
                <rect x="8" y="-8" width="80" height="16" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
                <text x="12" y="4" fill="#38bdf8" fontSize="8" fontWeight="bold">KIRANI EXPRESS</text>
              </g>
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> MV KIRANI (Flagship)
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ml-2"></span> Kapal Armada Lain
            </span>
            <span className="text-pink-600 font-semibold">Auto-refresh GPS setiap 5 detik</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts (Volume Trends & Port Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart: Volume Muatan & Omzet */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tren Volume Muatan & Pendapatan</h3>
              <p className="text-xs text-slate-500">Statistik pengiriman bulanan MV KIRANI Lines</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-semibold text-pink-600">
                <span className="w-3 h-3 rounded bg-pink-500"></span> Tonase
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-400">
                <span className="w-3 h-3 rounded bg-rose-300"></span> Pendapatan (M)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #fbcfe8', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: any, name: any) => [
                    name === 'volumeTon' ? `${value.toLocaleString()} Ton` : `Rp ${value} Milyar`,
                    name === 'volumeTon' ? 'Volume Muatan' : 'Pendapatan'
                  ]}
                />
                <Bar yAxisId="left" dataKey="volumeTon" fill="#ec4899" radius={[6, 6, 0, 0]} barSize={26} />
                <Bar yAxisId="right" dataKey="revenue" fill="#fda4af" radius={[6, 6, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Distribusi Muatan Pelabuhan */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Distribusi Tujuan Muatan</h3>
            <p className="text-xs text-slate-500">Persentase tonase kargo per pelabuhan bongkar</p>
          </div>

          <div className="h-48 w-full my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portTrafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {portTrafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val.toLocaleString()} Ton`, 'Total Muatan']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {portTrafficData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-pink-50/50">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-700 font-medium truncate">{item.name}</span>
                <span className="font-bold text-pink-700 ml-auto">{item.value.toLocaleString()} T</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transaction & Manifest Table Section */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-pink-600" />
              <span>Daftar Pengiriman Barang & Manifest Terkini</span>
            </h3>
            <p className="text-xs text-slate-500">Surat Jalan, Bill of Lading (B/L), dan status muatan real-time</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari No. Resi / BL / Kargo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs bg-pink-50/40 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 w-52 sm:w-64"
              />
            </div>

            {/* Vessel Filter Dropdown */}
            <select
              value={selectedVesselFilter}
              onChange={(e) => setSelectedVesselFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-pink-200 text-xs bg-pink-50/40 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
            >
              <option value="all">Semua Kapal</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            <button
              onClick={onOpenNewShipment}
              className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>+ Muatan Baru</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-pink-100">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-pink-50/80 text-pink-900 uppercase font-bold text-[11px] border-b border-pink-200">
              <tr>
                <th className="px-4 py-3.5">No. Surat Jalan / B/L</th>
                <th className="px-4 py-3.5">Kapal Pengangkut</th>
                <th className="px-4 py-3.5">Rute (Asal → Tujuan)</th>
                <th className="px-4 py-3.5">Deskripsi Muatan</th>
                <th className="px-4 py-3.5">Tonase / Nilai</th>
                <th className="px-4 py-3.5">Status Perjalanan</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                    Tidak ada data pengiriman yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => {
                  const vessel = vessels.find(v => v.id === shipment.vesselId);
                  const pOrigin = ports.find(p => p.id === shipment.originPortId);
                  const pDest = ports.find(p => p.id === shipment.destinationPortId);
                  const customer = customers.find(c => c.id === shipment.customerId);

                  return (
                    <tr key={shipment.id} className="hover:bg-pink-50/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{shipment.shippingOrderNo}</div>
                        <div className="text-[11px] font-mono text-pink-600">{shipment.blNumber}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Ship className="w-3.5 h-3.5 text-pink-600" />
                          {vessel ? vessel.name : 'MV KIRANI'}
                        </div>
                        <div className="text-[10px] text-slate-500">{vessel?.callSign}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800">
                          {pOrigin?.city || 'Jakarta'} → <span className="text-pink-700 font-bold">{pDest?.city || 'Makassar'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ETD: {new Date(shipment.etd).toLocaleDateString('id-ID')}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-medium text-slate-900 truncate">{shipment.cargoDescription}</div>
                        <div className="text-[10px] text-slate-500 truncate">
                          Pengirim: {customer?.companyName || 'PT Samudera'}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{shipment.weightTon.toLocaleString()} Ton</div>
                        <div className="text-[11px] text-emerald-600 font-semibold">
                          {formatRupiah(shipment.totalFreight)}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {getStatusBadge(shipment.status)}
                        {shipment.status === 'in_transit' && (
                          <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                            <div className="bg-pink-600 h-1.5 rounded-full" style={{ width: `${shipment.progressPercent}%` }}></div>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => onViewBillOfLading(shipment)}
                          className="px-2.5 py-1.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-[11px] transition-all cursor-pointer"
                          title="Cetak & Lihat Bill of Lading (B/L) Resmi"
                        >
                          Lihat B/L
                        </button>
                        <button
                          onClick={() => onSelectShipment(shipment)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-all cursor-pointer"
                          title="Detail Pelacakan"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredShipments.length} transaksi muatan</span>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
          >
            Buka Modul Transaksi Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
