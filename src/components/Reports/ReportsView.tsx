import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Printer, Filter, Calendar, Ship, 
  MapPin, DollarSign, Package, CheckCircle2, TrendingUp, BarChart3
} from 'lucide-react';
import { Shipment, Vessel, Port, Customer, Invoice } from '../../types';

interface ReportsViewProps {
  shipments: Shipment[];
  vessels: Vessel[];
  ports: Port[];
  customers: Customer[];
  invoices: Invoice[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  shipments,
  vessels,
  ports,
  customers,
  invoices
}) => {
  const [reportType, setReportType] = useState<'shipments' | 'revenue' | 'fleet'>('shipments');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [vesselFilter, setVesselFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtered shipments by criteria
  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const matchVessel = vesselFilter === 'all' || s.vesselId === vesselFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchVessel && matchStatus;
    });
  }, [shipments, vesselFilter, statusFilter]);

  // Aggregate Metrics
  const summary = useMemo(() => {
    const totalTransactions = filteredShipments.length;
    const totalWeight = filteredShipments.reduce((sum, s) => sum + s.weightTon, 0);
    const totalTeu = filteredShipments.reduce((sum, s) => sum + s.quantity, 0);
    const totalFreight = filteredShipments.reduce((sum, s) => sum + s.totalFreight, 0);
    const totalPaid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.paidAmount, 0);

    return {
      totalTransactions,
      totalWeight,
      totalTeu,
      totalFreight,
      totalPaid
    };
  }, [filteredShipments, invoices]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = [
      'No. Surat Jalan',
      'No. Bill of Lading',
      'No. Manifest',
      'Kapal',
      'Pelabuhan Asal',
      'Pelabuhan Tujuan',
      'Shipper',
      'Deskripsi Muatan',
      'Tonase (Ton)',
      'Total Freight (Rp)',
      'Status Pembayaran',
      'Status Perjalanan'
    ];

    const rows = filteredShipments.map(s => {
      const v = vessels.find(vsl => vsl.id === s.vesselId)?.name || 'MV KIRANI';
      const pOrg = ports.find(p => p.id === s.originPortId)?.city || '';
      const pDst = ports.find(p => p.id === s.destinationPortId)?.city || '';
      const c = customers.find(cust => cust.id === s.customerId)?.companyName || '';

      return [
        `"${s.shippingOrderNo}"`,
        `"${s.blNumber}"`,
        `"${s.manifestNo}"`,
        `"${v}"`,
        `"${pOrg}"`,
        `"${pDst}"`,
        `"${c}"`,
        `"${s.cargoDescription.replace(/"/g, '""')}"`,
        s.weightTon,
        s.totalFreight,
        `"${s.paymentStatus}"`,
        `"${s.status}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Pengiriman_MV_KIRANI_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" /> Modul Laporan & Ekspor Data
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Laporan Bisnis & Rekapitulasi Operasional
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh laporan pengiriman, rekap uang tambang freight, manifest muatan, dan statistik armada kapal MV KIRANI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor ke CSV / Excel</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Filter Parameters Card */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          <Filter className="w-4 h-4 text-pink-600" />
          <span>Filter Laporan Maritim</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/40 text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/40 text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pilih Kapal Armada</label>
            <select
              value={vesselFilter}
              onChange={e => setVesselFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/40 text-slate-800 font-semibold"
            >
              <option value="all">Semua Kapal (Armada)</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Status Muatan</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/40 text-slate-800 font-semibold"
            >
              <option value="all">Semua Status</option>
              <option value="in_transit">Dalam Pelayaran (In-Transit)</option>
              <option value="loading">Pemuatan (Loading)</option>
              <option value="delivered">Terkirim (Delivered)</option>
              <option value="booking">Booking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Pengiriman</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{summary.totalTransactions} Order</div>
          <span className="text-[10px] text-pink-600 font-semibold">Surat Jalan / Manifest</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Muatan Diangkut</span>
          <div className="text-2xl font-extrabold text-pink-700 mt-1">{summary.totalWeight.toLocaleString()} Ton</div>
          <span className="text-[10px] text-slate-500 font-semibold">{summary.totalTeu} Petikemas TEU</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Uang Tambang (Freight)</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{formatRupiah(summary.totalFreight)}</div>
          <span className="text-[10px] text-slate-500">Omzet Pelayaran Terhitung</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Pembayaran Diterima</span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">{formatRupiah(summary.totalPaid)}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Faktur Lunas Terverifikasi</span>
        </div>
      </div>

      {/* Printable Report Table */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
        
        {/* Printable Header */}
        <div className="hidden print:block border-b-2 border-pink-600 pb-4 mb-4">
          <h2 className="text-xl font-black text-pink-700">PT PELAYARAN MV KIRANI SAMUDERA LINES</h2>
          <h3 className="text-sm font-bold text-slate-800">LAPORAN REKAPITULASI PENGIRIMAN BARANG & UANG TAMBANG</h3>
          <p className="text-xs text-slate-500">Periode: {startDate} s/d {endDate} • Dicetak: {new Date().toLocaleString('id-ID')}</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-pink-100">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-pink-50/80 text-pink-900 font-bold border-b border-pink-200 uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">No. Surat Jalan</th>
                <th className="px-4 py-3">No. B/L</th>
                <th className="px-4 py-3">Kapal</th>
                <th className="px-4 py-3">Rute (POL → POD)</th>
                <th className="px-4 py-3">Shipper</th>
                <th className="px-4 py-3">Muatan & Tonase</th>
                <th className="px-4 py-3 text-right">Uang Tambang</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {filteredShipments.map((s) => {
                const v = vessels.find(vsl => vsl.id === s.vesselId);
                const pOrg = ports.find(p => p.id === s.originPortId);
                const pDst = ports.find(p => p.id === s.destinationPortId);
                const cust = customers.find(c => c.id === s.customerId);

                return (
                  <tr key={s.id} className="hover:bg-pink-50/30">
                    <td className="px-4 py-3 font-bold text-slate-900">{s.shippingOrderNo}</td>
                    <td className="px-4 py-3 font-mono text-pink-700 font-bold">{s.blNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{v?.name || 'MV KIRANI'}</td>
                    <td className="px-4 py-3">{pOrg?.city} → {pDst?.city}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{cust?.companyName}</td>
                    <td className="px-4 py-3">
                      <div>{s.cargoDescription}</div>
                      <div className="text-[10px] font-bold text-pink-700">{s.weightTon.toLocaleString()} Ton</div>
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-slate-900">
                      {formatRupiah(s.totalFreight)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-bold uppercase">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
