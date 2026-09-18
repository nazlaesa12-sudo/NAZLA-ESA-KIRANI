import React, { useState, useMemo } from 'react';
import { 
  Package, Ship, FileText, CreditCard, Search, Plus, Edit, 
  Trash2, Eye, CheckCircle2, Clock, Navigation, Anchor, 
  DollarSign, Printer, ArrowRight, Filter, AlertCircle
} from 'lucide-react';
import { Shipment, Vessel, Port, Customer, CargoType, Invoice, ShipmentStatus } from '../../types';
import { ShipmentModal } from './ShipmentModal';

interface TransactionsViewProps {
  shipments: Shipment[];
  vessels: Vessel[];
  ports: Port[];
  customers: Customer[];
  cargoTypes: CargoType[];
  invoices: Invoice[];
  onSaveShipment: (shipment: Shipment) => void;
  onDeleteShipment: (id: string) => void;
  onSaveInvoice: (invoice: Invoice) => void;
  onViewBillOfLading: (shipment: Shipment) => void;
  onSelectShipment: (shipment: Shipment) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  shipments,
  vessels,
  ports,
  customers,
  cargoTypes,
  invoices,
  onSaveShipment,
  onDeleteShipment,
  onSaveInvoice,
  onViewBillOfLading,
  onSelectShipment
}) => {
  const [subTab, setSubTab] = useState<'shipments' | 'invoices'>('shipments');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vesselFilter, setVesselFilter] = useState('all');

  // Shipment Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  // Status Change Quick Popover
  const [statusChangeItem, setStatusChangeItem] = useState<Shipment | null>(null);

  // Filtered Shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const matchSearch = 
        s.shippingOrderNo.toLowerCase().includes(search.toLowerCase()) ||
        s.blNumber.toLowerCase().includes(search.toLowerCase()) ||
        s.cargoDescription.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchVessel = vesselFilter === 'all' || s.vesselId === vesselFilter;

      return matchSearch && matchStatus && matchVessel;
    });
  }, [shipments, search, statusFilter, vesselFilter]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      return (
        inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
        inv.shippingOrderNo.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [invoices, search]);

  const handleOpenNew = () => {
    setEditingShipment(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Shipment) => {
    setEditingShipment(s);
    setModalOpen(true);
  };

  const handleUpdateStatus = (newStatus: ShipmentStatus) => {
    if (!statusChangeItem) return;

    const progress = newStatus === 'delivered' ? 100 : newStatus === 'in_transit' ? 50 : newStatus === 'loading' ? 20 : 0;
    const updated: Shipment = {
      ...statusChangeItem,
      status: newStatus,
      progressPercent: progress,
      timeline: [
        ...statusChangeItem.timeline,
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          title: `Status Diperbarui: ${newStatus.toUpperCase()}`,
          location: 'Operasional Maritim MV KIRANI',
          status: newStatus,
          description: `Status pengiriman barang diubah ke tahap ${newStatus}.`,
          updatedBy: 'Operator Dispatcher'
        }
      ]
    };

    onSaveShipment(updated);
    setStatusChangeItem(null);
  };

  const handleMarkInvoicePaid = (inv: Invoice) => {
    const updated: Invoice = {
      ...inv,
      status: 'paid',
      paidAmount: inv.totalAmount,
      paymentDate: new Date().toISOString().split('T')[0]
    };
    onSaveInvoice(updated);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" /> Modul Transaksi & Manifest
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Surat Jalan, Manifest B/L, dan Penagihan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola proses logistik laut dari pembuatan booking, pemuatan palka, perjalanan, hingga pelunasan invoice uang tambang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-pink-50/80 rounded-2xl border border-pink-200">
            <button
              onClick={() => { setSubTab('shipments'); setSearch(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                subTab === 'shipments' ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-700 hover:bg-pink-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Surat Jalan & B/L ({shipments.length})</span>
            </button>

            <button
              onClick={() => { setSubTab('invoices'); setSearch(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                subTab === 'invoices' ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-700 hover:bg-pink-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Faktur & Penagihan ({invoices.length})</span>
            </button>
          </div>

          {subTab === 'shipments' && (
            <button
              onClick={handleOpenNew}
              className="px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Surat Jalan Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SURAT JALAN & MANIFEST LIST */}
      {/* ========================================================================= */}
      {subTab === 'shipments' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari No SO / B/L / Muatan..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs bg-pink-50/40 w-56 sm:w-64 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="py-2 px-3 rounded-xl border border-pink-200 text-xs bg-pink-50/40 text-slate-800 font-semibold focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="booking">Booking</option>
                <option value="loading">Pemuatan</option>
                <option value="in_transit">Berlayar</option>
                <option value="berthing">Sandar</option>
                <option value="delivered">Selesai</option>
              </select>

              <select
                value={vesselFilter}
                onChange={e => setVesselFilter(e.target.value)}
                className="py-2 px-3 rounded-xl border border-pink-200 text-xs bg-pink-50/40 text-slate-800 font-semibold focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                <option value="all">Semua Kapal</option>
                {vessels.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500">
              Total <span className="font-bold text-pink-700">{filteredShipments.length}</span> data pengiriman
            </div>
          </div>

          {/* Shipments Table */}
          <div className="overflow-x-auto rounded-2xl border border-pink-100">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-pink-50/80 text-pink-900 font-bold border-b border-pink-200 uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">Dokumen No (SO / B/L)</th>
                  <th className="px-4 py-3.5">Kapal & Nakhoda</th>
                  <th className="px-4 py-3.5">Pelabuhan Rute</th>
                  <th className="px-4 py-3.5">Kargo & Shipper</th>
                  <th className="px-4 py-3.5">Nilai Freight</th>
                  <th className="px-4 py-3.5">Status Pengiriman</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {filteredShipments.map((shipment) => {
                  const vessel = vessels.find(v => v.id === shipment.vesselId);
                  const pOrigin = ports.find(p => p.id === shipment.originPortId);
                  const pDest = ports.find(p => p.id === shipment.destinationPortId);
                  const shipper = customers.find(c => c.id === shipment.customerId);

                  return (
                    <tr key={shipment.id} className="hover:bg-pink-50/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{shipment.shippingOrderNo}</div>
                        <div className="text-[11px] font-mono font-bold text-pink-600">{shipment.blNumber}</div>
                        <div className="text-[10px] text-slate-400">MNF: {shipment.manifestNo}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Ship className="w-3.5 h-3.5 text-pink-600" />
                          <span>{vessel ? vessel.name : 'MV KIRANI'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{vessel?.captainName}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800">
                          {pOrigin?.city} → <span className="text-pink-700 font-bold">{pDest?.city}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ETA: {new Date(shipment.eta).toLocaleDateString('id-ID')}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-medium text-slate-900 truncate">{shipment.cargoDescription}</div>
                        <div className="text-[10px] text-slate-500 font-semibold truncate">
                          {shipper?.companyName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {shipment.weightTon} Ton • {shipment.quantity} Unit
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-extrabold text-slate-900">
                          {formatRupiah(shipment.totalFreight)}
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          shipment.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {shipment.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setStatusChangeItem(shipment)}
                          className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-300 hover:bg-pink-200 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Klik untuk mengubah status perjalanan muatan"
                        >
                          <Navigation className="w-3 h-3" />
                          <span className="capitalize">{shipment.status}</span>
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => onViewBillOfLading(shipment)}
                          className="px-2.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-[11px] transition-all cursor-pointer"
                          title="Cetak Bill of Lading"
                        >
                          Cetak B/L
                        </button>
                        <button
                          onClick={() => handleOpenEdit(shipment)}
                          className="p-1.5 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg cursor-pointer"
                          title="Edit Surat Jalan"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus surat jalan ${shipment.shippingOrderNo}?`)) {
                              onDeleteShipment(shipment.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. INVOICE & PENAGIHAN LIST */}
      {/* ========================================================================= */}
      {subTab === 'invoices' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari No Invoice / Pelanggan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs bg-pink-50/40 w-64 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="text-xs text-slate-500">
              Total {filteredInvoices.length} Faktur Penagihan
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-pink-100">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-pink-50/80 text-pink-900 font-bold border-b border-pink-200 uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">Nomor Faktur</th>
                  <th className="px-4 py-3.5">No Surat Jalan / B/L</th>
                  <th className="px-4 py-3.5">Pelanggan (Shipper)</th>
                  <th className="px-4 py-3.5">Jatuh Tempo</th>
                  <th className="px-4 py-3.5">Subtotal + PPN 11%</th>
                  <th className="px-4 py-3.5">Total Tagihan</th>
                  <th className="px-4 py-3.5">Status Pembayaran</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-pink-50/40">
                    <td className="px-4 py-3.5 font-bold text-slate-900 font-mono">
                      {inv.invoiceNo}
                      <div className="text-[10px] text-slate-400 font-normal">Tgl: {inv.issueDate}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{inv.shippingOrderNo}</div>
                      <div className="text-[10px] font-mono text-pink-600">{inv.blNumber}</div>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {inv.customerName}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      {inv.dueDate}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-slate-600">{formatRupiah(inv.subtotal)}</div>
                      <div className="text-[10px] text-slate-400">+ PPN: {formatRupiah(inv.ppn)}</div>
                    </td>

                    <td className="px-4 py-3.5 font-extrabold text-pink-700 text-sm">
                      {formatRupiah(inv.totalAmount)}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {inv.status === 'paid' ? 'Lunas (Paid)' : 'Menunggu Pelunasan'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkInvoicePaid(inv)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                        >
                          Tandai Lunas
                        </button>
                      )}
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg cursor-pointer"
                        title="Cetak Faktur"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shipment Modal Component */}
      <ShipmentModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingShipment(null); }}
        onSave={onSaveShipment}
        shipment={editingShipment}
        vessels={vessels}
        ports={ports}
        cargoTypes={cargoTypes}
        customers={customers}
      />

      {/* Quick Status Updater Popover Modal */}
      {statusChangeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Perbarui Status Perjalanan Muatan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              SO: <span className="font-bold text-pink-700">{statusChangeItem.shippingOrderNo}</span> ({statusChangeItem.cargoDescription})
            </p>

            <div className="space-y-2">
              {[
                { id: 'booking', label: '1. Booking Diterima', desc: 'Order diverifikasi & terjadwal' },
                { id: 'loading', label: '2. Pemuatan (Loading)', desc: 'Kontainer sedang dimuat crane ke palka' },
                { id: 'in_transit', label: '3. Berlayar (In-Transit)', desc: 'Kapal telah bertolak menuju pelabuhan tujuan' },
                { id: 'berthing', label: '4. Sandar di Dermaga', desc: 'Kapal merapat di pelabuhan tujuan' },
                { id: 'discharging', label: '5. Pembongkaran Kargo', desc: 'Proses un-lashing dan bongkar muat' },
                { id: 'delivered', label: '6. Selesai (Delivered)', desc: 'Kargo diterima consignee dengan BAST' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => handleUpdateStatus(st.id as ShipmentStatus)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                    statusChangeItem.status === st.id
                      ? 'border-pink-600 bg-pink-50 text-pink-900 font-bold'
                      : 'border-slate-200 hover:border-pink-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{st.label}</div>
                    <div className="text-[10px] text-slate-500">{st.desc}</div>
                  </div>
                  {statusChangeItem.status === st.id && (
                    <CheckCircle2 className="w-4 h-4 text-pink-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setStatusChangeItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
