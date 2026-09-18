import React, { useState, useEffect } from 'react';
import { 
  Package, Ship, MapPin, Calendar, DollarSign, X, Check, 
  FileText, Shield, Sparkles, Truck
} from 'lucide-react';
import { Shipment, Vessel, Port, CargoType, Customer, ShipmentStatus } from '../../types';

interface ShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shipment: Shipment) => void;
  shipment: Partial<Shipment> | null;
  vessels: Vessel[];
  ports: Port[];
  cargoTypes: CargoType[];
  customers: Customer[];
}

export const ShipmentModal: React.FC<ShipmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  shipment,
  vessels,
  ports,
  cargoTypes,
  customers
}) => {
  const [formData, setFormData] = useState<Partial<Shipment>>({});

  useEffect(() => {
    if (shipment) {
      setFormData({ ...shipment });
    } else {
      const now = new Date();
      const randomNo = Math.floor(100 + Math.random() * 900);
      const randomBl = Math.floor(1000 + Math.random() * 9000);
      
      setFormData({
        id: `ship-${Date.now()}`,
        shippingOrderNo: `SO-2026-${String(now.getMonth() + 1).padStart(2, '0')}-${randomNo}`,
        blNumber: `BL/KRNI/2026/${String(now.getMonth() + 1).padStart(2, '0')}/${randomBl}`,
        manifestNo: `MNF-${randomNo}`,
        vesselId: vessels[0]?.id || 'vessel-1',
        originPortId: ports[0]?.id || 'port-1',
        destinationPortId: ports[2]?.id || 'port-3',
        customerId: customers[0]?.id || 'cust-1',
        consigneeId: customers[1]?.id || 'cust-2',
        cargoTypeId: cargoTypes[0]?.id || 'cargo-1',
        cargoDescription: 'Muatan Petikemas Standar 20ft',
        containerNumber: `KRNIU-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`,
        sealNumber: `SEAL-${Math.floor(1000 + Math.random() * 9000)}`,
        quantity: 10,
        weightTon: 180,
        volumeCbm: 330,
        ratePerTon: 6500000,
        bunkerSurcharge: 8000000,
        harborDues: 4500000,
        totalFreight: 77500000,
        paymentStatus: 'unpaid',
        status: 'booking',
        etd: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T08:00',
        eta: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0] + 'T14:00',
        progressPercent: 0,
        specialInstructions: 'Lashing muatan standar, laporkan suhu dan kondisi palka.',
        timeline: [
          {
            id: `tl-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            title: 'Booking Surat Jalan Diterbitkan',
            location: 'Kantor MV KIRANI',
            status: 'booking',
            description: 'Order pengiriman dibuat dan menunggu proses pemuatan kapal.',
            updatedBy: 'Admin Logistik'
          }
        ]
      });
    }
  }, [shipment, isOpen, vessels, ports, cargoTypes, customers]);

  // Recalculate freight total
  const calculateTotal = (
    qty: number,
    weight: number,
    rate: number,
    bunker: number,
    harbor: number
  ) => {
    const baseAmount = (qty > 0 ? qty : weight) * rate;
    return baseAmount + bunker + harbor;
  };

  const handleCargoTypeChange = (cargoId: string) => {
    const selected = cargoTypes.find(c => c.id === cargoId);
    if (selected) {
      const rate = selected.baseRatePerUnit;
      const qty = formData.quantity || 1;
      const weight = formData.weightTon || 1;
      const bunker = formData.bunkerSurcharge || 0;
      const harbor = formData.harborDues || 0;
      const total = calculateTotal(qty, weight, rate, bunker, harbor);

      setFormData({
        ...formData,
        cargoTypeId: cargoId,
        ratePerTon: rate,
        totalFreight: total,
        cargoDescription: selected.name
      });
    }
  };

  const handleNumericChange = (field: keyof Shipment, value: number) => {
    const updated = { ...formData, [field]: value };
    const qty = field === 'quantity' ? value : (updated.quantity || 1);
    const weight = field === 'weightTon' ? value : (updated.weightTon || 1);
    const rate = field === 'ratePerTon' ? value : (updated.ratePerTon || 0);
    const bunker = field === 'bunkerSurcharge' ? value : (updated.bunkerSurcharge || 0);
    const harbor = field === 'harborDues' ? value : (updated.harborDues || 0);

    const total = calculateTotal(qty, weight, rate, bunker, harbor);
    setFormData({
      ...updated,
      totalFreight: total
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.shippingOrderNo && formData.vesselId) {
      onSave(formData as Shipment);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-pink-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-600/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {shipment?.id ? 'Edit Surat Jalan & Manifest Muatan' : 'Penerbitan Surat Jalan / Shipping Order Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                PT Pelayaran MV Kirani Samudera Lines • Dokumen Resmi Pengangkutan Laut
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-xs text-slate-700">
          
          {/* Row 1: Nomor Dokumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
            <div>
              <label className="font-bold text-slate-800 block mb-1">No. Shipping Order (SO) *</label>
              <input
                type="text"
                required
                value={formData.shippingOrderNo || ''}
                onChange={e => setFormData({ ...formData, shippingOrderNo: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-white font-mono text-slate-900 font-semibold focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">No. Bill of Lading (B/L) *</label>
              <input
                type="text"
                required
                value={formData.blNumber || ''}
                onChange={e => setFormData({ ...formData, blNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-white font-mono text-pink-700 font-bold focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">No. Manifest Kapal</label>
              <input
                type="text"
                value={formData.manifestNo || ''}
                onChange={e => setFormData({ ...formData, manifestNo: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-white font-mono text-slate-800 focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Row 2: Kapal & Pelabuhan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                <Ship className="w-3.5 h-3.5 text-pink-600" /> Kapal Pengangkut *
              </label>
              <select
                value={formData.vesselId || ''}
                onChange={e => setFormData({ ...formData, vesselId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 font-semibold focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                {vessels.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Pelabuhan Asal (POL) *
              </label>
              <select
                value={formData.originPortId || ''}
                onChange={e => setFormData({ ...formData, originPortId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                {ports.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-pink-600" /> Pelabuhan Tujuan (POD) *
              </label>
              <select
                value={formData.destinationPortId || ''}
                onChange={e => setFormData({ ...formData, destinationPortId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 font-semibold focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                {ports.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Shipper & Consignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Pengirim (Shipper) *</label>
              <select
                value={formData.customerId || ''}
                onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 font-semibold focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName} - {c.city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Penerima Barang (Consignee) *</label>
              <select
                value={formData.consigneeId || ''}
                onChange={e => setFormData({ ...formData, consigneeId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 font-semibold focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName} - {c.city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Muatan & Detail Kontainer */}
          <div className="p-4 rounded-2xl bg-white border border-pink-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Jenis Kategori Kargo</label>
                <select
                  value={formData.cargoTypeId || ''}
                  onChange={e => handleCargoTypeChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 focus:ring-2 focus:ring-pink-500"
                >
                  {cargoTypes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Jumlah / Unit (TEU/Box)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity || 1}
                  onChange={e => handleNumericChange('quantity', Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Berat Total (Ton)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weightTon || 1}
                  onChange={e => handleNumericChange('weightTon', Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Deskripsi Muatan</label>
                <input
                  type="text"
                  value={formData.cargoDescription || ''}
                  onChange={e => setFormData({ ...formData, cargoDescription: e.target.value })}
                  placeholder="Contoh: 15 Kontainer Bahan Bangunan"
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Nomor Petikemas / Kontainer</label>
                <input
                  type="text"
                  value={formData.containerNumber || ''}
                  onChange={e => setFormData({ ...formData, containerNumber: e.target.value })}
                  placeholder="KRNIU-882910-4"
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Nomor Segel (Seal No)</label>
                <input
                  type="text"
                  value={formData.sealNumber || ''}
                  onChange={e => setFormData({ ...formData, sealNumber: e.target.value })}
                  placeholder="SEAL-JKT-9921"
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Kalkulasi Biaya Uang Tambang (Freight) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200">
            <h4 className="font-extrabold text-pink-900 text-xs mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-pink-600" /> Rincian Biaya Freight & Uang Tambang
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tarif Dasar / Unit (Rp)</label>
                <input
                  type="number"
                  value={formData.ratePerTon || 0}
                  onChange={e => handleNumericChange('ratePerTon', Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-pink-200 bg-white font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bunker Surcharge (Rp)</label>
                <input
                  type="number"
                  value={formData.bunkerSurcharge || 0}
                  onChange={e => handleNumericChange('bunkerSurcharge', Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-pink-200 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Harbor Dues / Labuh (Rp)</label>
                <input
                  type="number"
                  value={formData.harborDues || 0}
                  onChange={e => handleNumericChange('harborDues', Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-pink-200 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="font-extrabold text-pink-700 block mb-1">Total Biaya Tambang (Freight)</label>
                <div className="p-2 rounded-lg bg-pink-600 text-white font-extrabold text-sm text-center shadow-md shadow-pink-600/30">
                  Rp {(formData.totalFreight || 0).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          {/* Row 6: Jadwal & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-pink-600" /> ETD (Estimasi Berangkat)
              </label>
              <input
                type="datetime-local"
                value={formData.etd ? formData.etd.slice(0, 16) : ''}
                onChange={e => setFormData({ ...formData, etd: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> ETA (Estimasi Tiba)
              </label>
              <input
                type="datetime-local"
                value={formData.eta ? formData.eta.slice(0, 16) : ''}
                onChange={e => setFormData({ ...formData, eta: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Status Operasional</label>
              <select
                value={formData.status || 'booking'}
                onChange={e => setFormData({ ...formData, status: e.target.value as ShipmentStatus })}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 font-bold focus:ring-2 focus:ring-pink-500"
              >
                <option value="draft">Draft</option>
                <option value="booking">Booking Dikonfirmasi</option>
                <option value="loading">Pemuatan (Loading)</option>
                <option value="in_transit">Berlayar (In-Transit)</option>
                <option value="berthing">Sandar Dermaga</option>
                <option value="discharging">Bongkar Muat</option>
                <option value="delivered">Terkirim (Selesai)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold shadow-lg shadow-pink-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Dokumen Surat Jalan</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
