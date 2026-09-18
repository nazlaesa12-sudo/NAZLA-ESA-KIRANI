import React, { useState } from 'react';
import { 
  Ship, Anchor, MapPin, Package, Users, UserCheck, Plus, 
  Edit, Trash2, Search, Check, AlertCircle, Save, X, Phone, 
  Mail, Shield, Award, Fuel, Gauge
} from 'lucide-react';
import { Vessel, Port, CargoType, Customer, CrewMember, VesselStatus } from '../../types';

interface MasterDataProps {
  vessels: Vessel[];
  ports: Port[];
  cargoTypes: CargoType[];
  customers: Customer[];
  crew: CrewMember[];
  onSaveVessel: (vessel: Vessel) => void;
  onDeleteVessel: (id: string) => void;
  onSavePort: (port: Port) => void;
  onDeletePort: (id: string) => void;
  onSaveCargoType: (cargo: CargoType) => void;
  onDeleteCargoType: (id: string) => void;
  onSaveCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onSaveCrew: (crew: CrewMember) => void;
  onDeleteCrew: (id: string) => void;
}

export const MasterDataView: React.FC<MasterDataProps> = ({
  vessels,
  ports,
  cargoTypes,
  customers,
  crew,
  onSaveVessel,
  onDeleteVessel,
  onSavePort,
  onDeletePort,
  onSaveCargoType,
  onDeleteCargoType,
  onSaveCustomer,
  onDeleteCustomer,
  onSaveCrew,
  onDeleteCrew
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vessels' | 'ports' | 'cargo' | 'customers' | 'crew'>('vessels');
  const [search, setSearch] = useState('');

  // Modals state
  const [vesselModal, setVesselModal] = useState<{ open: boolean; item: Partial<Vessel> | null }>({ open: false, item: null });
  const [portModal, setPortModal] = useState<{ open: boolean; item: Partial<Port> | null }>({ open: false, item: null });
  const [cargoModal, setCargoModal] = useState<{ open: boolean; item: Partial<CargoType> | null }>({ open: false, item: null });
  const [customerModal, setCustomerModal] = useState<{ open: boolean; item: Partial<Customer> | null }>({ open: false, item: null });
  const [crewModal, setCrewModal] = useState<{ open: boolean; item: Partial<CrewMember> | null }>({ open: false, item: null });

  // ----------------------------------------------------
  // VESSEL CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenVesselModal = (item?: Vessel) => {
    if (item) {
      setVesselModal({ open: true, item: { ...item } });
    } else {
      setVesselModal({
        open: true,
        item: {
          id: `vessel-${Date.now()}`,
          name: '',
          callSign: 'YDK',
          imoNumber: 'IMO 98',
          flag: 'INDONESIA (IDN)',
          type: 'General Cargo & Multipurpose',
          dwt: 12000,
          grossTonnage: 8000,
          capacityTeu: 600,
          capacityTon: 11000,
          captainName: '',
          status: 'siap',
          currentPortId: ports[0]?.id || 'port-1',
          currentLat: -6.1018,
          currentLng: 106.8833,
          speedKnots: 14.0,
          heading: 0,
          fuelPercentage: 100,
          engineRpm: 120,
          yearBuilt: new Date().getFullYear(),
          lastMaintenance: new Date().toISOString().split('T')[0],
          notes: ''
        }
      });
    }
  };

  const handleSaveVesselSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vesselModal.item && vesselModal.item.name) {
      onSaveVessel(vesselModal.item as Vessel);
      setVesselModal({ open: false, item: null });
    }
  };

  // ----------------------------------------------------
  // PORT CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenPortModal = (item?: Port) => {
    if (item) {
      setPortModal({ open: true, item: { ...item } });
    } else {
      setPortModal({
        open: true,
        item: {
          id: `port-${Date.now()}`,
          code: 'ID',
          name: '',
          city: '',
          province: '',
          lat: -6.0,
          lng: 106.0,
          draftDepthMeters: 12.0,
          berthCount: 10,
          operationalHours: '24 Jam',
          contactPerson: '',
          phone: '',
          status: 'aktif'
        }
      });
    }
  };

  const handleSavePortSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (portModal.item && portModal.item.name) {
      onSavePort(portModal.item as Port);
      setPortModal({ open: false, item: null });
    }
  };

  // ----------------------------------------------------
  // CARGO TYPE CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenCargoModal = (item?: CargoType) => {
    if (item) {
      setCargoModal({ open: true, item: { ...item } });
    } else {
      setCargoModal({
        open: true,
        item: {
          id: `cargo-${Date.now()}`,
          code: 'CARGO',
          name: '',
          category: 'FCL_CONTAINER',
          unit: 'TEU',
          baseRatePerUnit: 5000000,
          description: ''
        }
      });
    }
  };

  const handleSaveCargoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cargoModal.item && cargoModal.item.name) {
      onSaveCargoType(cargoModal.item as CargoType);
      setCargoModal({ open: false, item: null });
    }
  };

  // ----------------------------------------------------
  // CUSTOMER CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenCustomerModal = (item?: Customer) => {
    if (item) {
      setCustomerModal({ open: true, item: { ...item } });
    } else {
      setCustomerModal({
        open: true,
        item: {
          id: `cust-${Date.now()}`,
          code: `CUST-${Math.floor(100 + Math.random() * 900)}`,
          name: '',
          companyName: '',
          type: 'shipper',
          npwp: '00.000.000.0-000.000',
          email: '',
          phone: '',
          address: '',
          city: '',
          creditLimit: 100000000,
          totalTransactions: 0,
          status: 'aktif'
        }
      });
    }
  };

  const handleSaveCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerModal.item && customerModal.item.companyName) {
      onSaveCustomer(customerModal.item as Customer);
      setCustomerModal({ open: false, item: null });
    }
  };

  // ----------------------------------------------------
  // CREW CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenCrewModal = (item?: CrewMember) => {
    if (item) {
      setCrewModal({ open: true, item: { ...item } });
    } else {
      setCrewModal({
        open: true,
        item: {
          id: `crew-${Date.now()}`,
          code: `CREW-${Math.floor(100 + Math.random() * 900)}`,
          name: '',
          position: 'Nakhoda (Master)',
          seamanBookNumber: 'SB-ID-',
          certificate: 'ANT-I',
          assignedVesselId: vessels[0]?.id || '',
          phone: '',
          emergencyContact: '',
          contractEnd: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          status: 'aktif'
        }
      });
    }
  };

  const handleSaveCrewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (crewModal.item && crewModal.item.name) {
      onSaveCrew(crewModal.item as CrewMember);
      setCrewModal({ open: false, item: null });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Anchor className="w-3.5 h-3.5" /> Modul Master Data Maritim
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Pengelolaan Data Master MV KIRANI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data armada kapal, pelabuhan nusantara, jenis muatan, pelanggan shipper, dan awak kapal (ABK).
          </p>
        </div>

        {/* Sub-tab Pill Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-pink-50/80 p-1.5 rounded-2xl border border-pink-200">
          <button
            onClick={() => { setActiveSubTab('vessels'); setSearch(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'vessels' ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-700 hover:bg-pink-100'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Armada Kapal ({vessels.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('ports'); setSearch(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'ports' ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-700 hover:bg-pink-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Pelabuhan ({ports.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('cargo'); setSearch(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'cargo' ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-700 hover:bg-pink-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Jenis Muatan ({cargoTypes.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('customers'); setSearch(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'customers' ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-700 hover:bg-pink-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pelanggan ({customers.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('crew'); setSearch(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'crew' ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-700 hover:bg-pink-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Awak Kapal ({crew.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MASTER ARMADA KAPAL */}
      {/* ========================================================================= */}
      {activeSubTab === 'vessels' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kapal / IMO / Nakhoda..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs bg-pink-50/40 w-64 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={() => handleOpenVesselModal()}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kapal Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vessels
              .filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.imoNumber.toLowerCase().includes(search.toLowerCase()))
              .map((v) => (
                <div 
                  key={v.id} 
                  className={`p-5 rounded-2xl border transition-all ${
                    v.name === 'MV KIRANI' 
                      ? 'border-pink-400 bg-gradient-to-br from-pink-50/70 to-white shadow-md' 
                      : 'border-slate-200 bg-white hover:border-pink-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
                        <Ship className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-base">{v.name}</h4>
                          {v.name === 'MV KIRANI' && (
                            <span className="px-2 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-bold">
                              Flagship Utama
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{v.imoNumber} • Call Sign: {v.callSign}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenVesselModal(v)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
                        title="Edit Data Kapal"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {v.name !== 'MV KIRANI' && (
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus kapal ${v.name}?`)) {
                              onDeleteVessel(v.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Kapal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-pink-50/40">
                      <span className="text-slate-500 block text-[10px]">Tipe Kapal</span>
                      <span className="font-semibold text-slate-800 truncate block">{v.type}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-pink-50/40">
                      <span className="text-slate-500 block text-[10px]">Kapasitas Ton / TEU</span>
                      <span className="font-semibold text-slate-800">{v.dwt.toLocaleString()} DWT / {v.capacityTeu} TEU</span>
                    </div>
                    <div className="p-2 rounded-lg bg-pink-50/40">
                      <span className="text-slate-500 block text-[10px]">Nakhoda (Master)</span>
                      <span className="font-semibold text-slate-800 truncate block">{v.captainName}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-pink-50/40">
                      <span className="text-slate-500 block text-[10px]">Status Pelayaran</span>
                      <span className="font-bold text-pink-700 capitalize">{v.status}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Gauge className="w-3 h-3 text-pink-600" /> {v.speedKnots} Knots
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Fuel className="w-3 h-3 text-emerald-600" /> Bunker {v.fuelPercentage}%
                    </span>
                    <span>Tahun {v.yearBuilt}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MASTER PELABUHAN & DERMAGA */}
      {/* ========================================================================= */}
      {activeSubTab === 'ports' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari pelabuhan / kota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs bg-pink-50/40 w-64 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={() => handleOpenPortModal()}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pelabuhan</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-pink-100">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-pink-50/80 text-pink-900 font-bold border-b border-pink-200">
                <tr>
                  <th className="px-4 py-3">Kode / Nama Pelabuhan</th>
                  <th className="px-4 py-3">Kota & Provinsi</th>
                  <th className="px-4 py-3">Kedalaman Draft</th>
                  <th className="px-4 py-3">Jumlah Dermaga</th>
                  <th className="px-4 py-3">Kontak Operasional</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {ports
                  .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-pink-50/40">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                          <span>{p.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-pink-600 font-normal">[{p.code}]</span>
                      </td>
                      <td className="px-4 py-3">{p.city}, {p.province}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{p.draftDepthMeters} Meter</td>
                      <td className="px-4 py-3">{p.berthCount} Tambatan Berth</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800 font-medium">{p.contactPerson}</div>
                        <div className="text-[10px] text-slate-500">{p.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenPortModal(p)}
                          className="p-1.5 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus pelabuhan ${p.name}?`)) onDeletePort(p.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MASTER JENIS MUATAN & TARIF */}
      {/* ========================================================================= */}
      {activeSubTab === 'cargo' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kategori kargo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs bg-pink-50/40 w-64 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={() => handleOpenCargoModal()}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jenis Muatan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cargoTypes
              .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()))
              .map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-pink-100 bg-pink-50/30 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-pink-200/60 text-pink-700 flex items-center justify-center font-bold">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                        <span className="text-[10px] font-mono text-pink-600">{c.code}</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button onClick={() => handleOpenCargoModal(c)} className="p-1 text-slate-500 hover:text-pink-600 cursor-pointer">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (confirm(`Hapus ${c.name}?`)) onDeleteCargoType(c.id); }} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{c.description}</p>

                  <div className="mt-4 pt-3 border-t border-pink-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Tarif Dasar / {c.unit}</span>
                    <span className="text-sm font-extrabold text-pink-700">
                      Rp {c.baseRatePerUnit.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MASTER PELANGGAN / SHIPPER */}
      {/* ========================================================================= */}
      {activeSubTab === 'customers' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari perusahaan / kontak / NPWP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs bg-pink-50/40 w-64 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={() => handleOpenCustomerModal()}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pelanggan Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-pink-100">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-pink-50/80 text-pink-900 font-bold border-b border-pink-200">
                <tr>
                  <th className="px-4 py-3">Nama Perusahaan / Kode</th>
                  <th className="px-4 py-3">PIC & Kontak</th>
                  <th className="px-4 py-3">NPWP</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Limit Kredit</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {customers
                  .filter(c => c.companyName.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()))
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-pink-50/40">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{c.companyName}</div>
                        <div className="text-[10px] text-pink-600 font-mono">{c.code} • {c.city}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.phone} • {c.email}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">{c.npwp}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold uppercase">
                          {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        Rp {(c.creditLimit / 1000000).toFixed(0)} Juta
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button onClick={() => handleOpenCustomerModal(c)} className="p-1.5 text-slate-500 hover:text-pink-600 rounded cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { if (confirm(`Hapus ${c.companyName}?`)) onDeleteCustomer(c.id); }} className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MASTER AWAK KAPAL & NAKHODA */}
      {/* ========================================================================= */}
      {activeSubTab === 'crew' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama nakhoda / sertifikat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs bg-pink-50/40 w-64 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={() => handleOpenCrewModal()}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Awak Kapal (ABK)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crew
              .filter(cr => cr.name.toLowerCase().includes(search.toLowerCase()) || cr.position.toLowerCase().includes(search.toLowerCase()))
              .map((cr) => {
                const assignedVessel = vessels.find(v => v.id === cr.assignedVesselId);
                return (
                  <div key={cr.id} className="p-4 rounded-2xl border border-pink-100 bg-pink-50/30 hover:border-pink-300 transition-all flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{cr.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {cr.status}
                          </span>
                        </div>
                        <p className="text-xs text-pink-700 font-semibold mt-0.5">{cr.position}</p>
                      </div>

                      <div className="flex items-center">
                        <button onClick={() => handleOpenCrewModal(cr)} className="p-1 text-slate-500 hover:text-pink-600 cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { if (confirm(`Hapus ${cr.name}?`)) onDeleteCrew(cr.id); }} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-white border border-pink-100">
                        <span className="text-slate-400 block text-[10px]">Sertifikat Maritim</span>
                        <span className="font-semibold text-slate-800">{cr.certificate}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-pink-100">
                        <span className="text-slate-400 block text-[10px]">Kapal Penugasan</span>
                        <span className="font-semibold text-pink-700">{assignedVessel ? assignedVessel.name : 'Belum Ditugaskan'}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-pink-100">
                        <span className="text-slate-400 block text-[10px]">Buku Pelaut (Seaman Book)</span>
                        <span className="font-mono text-slate-800 text-[11px]">{cr.seamanBookNumber}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-pink-100">
                        <span className="text-slate-400 block text-[10px]">Akhir Kontrak</span>
                        <span className="font-semibold text-slate-800">{cr.contractEnd}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL EDIT / TAMBAH KAPAL */}
      {/* ========================================================================= */}
      {vesselModal.open && vesselModal.item && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-pink-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ship className="w-5 h-5 text-pink-600" />
                <span>{vesselModal.item.id?.startsWith('vessel-') && !vesselModal.item.name ? 'Tambah Kapal Baru' : 'Edit Data Kapal'}</span>
              </h3>
              <button onClick={() => setVesselModal({ open: false, item: null })} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVesselSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Kapal *</label>
                  <input
                    type="text"
                    required
                    value={vesselModal.item.name || ''}
                    onChange={e => setVesselModal({ ...vesselModal, item: { ...vesselModal.item, name: e.target.value } })}
                    placeholder="Contoh: MV KIRANI III"
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor IMO</label>
                  <input
                    type="text"
                    value={vesselModal.item.imoNumber || ''}
                    onChange={e => setVesselModal({ ...vesselModal, item: { ...vesselModal.item, imoNumber: e.target.value } })}
                    placeholder="IMO 9842103"
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Call Sign</label>
                  <input
                    type="text"
                    value={vesselModal.item.callSign || ''}
                    onChange={e => setVesselModal({ ...vesselModal, item: { ...vesselModal.item, callSign: e.target.value } })}
                    placeholder="YDKI"
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Kapal</label>
                  <input
                    type="text"
                    value={vesselModal.item.type || ''}
                    onChange={e => setVesselModal({ ...vesselModal, item: { ...vesselModal.item, type: e.target.value } })}
                    placeholder="General Cargo / Container"
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">DWT (Ton)</label>
                  <input
                    type="number"
                    value={vesselModal.item.dwt || 0}
                    onChange={e => setVesselModal({ ...vesselModal, item: { ...vesselModal.item, dwt: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kapasitas TEU</label>
                  <input
                    type="number"
                    value={vesselModal.item.capacityTeu || 0}
                    onChange={e => setVesselModal({ ...vesselModal, item: { ...vesselModal.item, capacityTeu: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={vesselModal.item.status || 'siap'}
                    onChange={e => setVesselModal({ ...vesselModal, item: { ...vesselModal.item, status: e.target.value as VesselStatus } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800"
                  >
                    <option value="berlayar">Berlayar</option>
                    <option value="bongkar_muat">Bongkar Muat</option>
                    <option value="sandar">Sandar</option>
                    <option value="siap">Siap Operasi</option>
                    <option value="perawatan">Perawatan / Docking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Nakhoda (Master Mariner)</label>
                <input
                  type="text"
                  value={vesselModal.item.captainName || ''}
                  onChange={e => setVesselModal({ ...vesselModal, item: { ...vesselModal.item, captainName: e.target.value } })}
                  placeholder="Capt. Hendra Gunawan, M.Mar"
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVesselModal({ open: false, item: null })}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-md shadow-pink-600/25"
                >
                  Simpan Data Kapal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL EDIT / TAMBAH PELABUHAN */}
      {/* ========================================================================= */}
      {portModal.open && portModal.item && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pink-600" />
                <span>{portModal.item.name ? 'Edit Data Pelabuhan' : 'Tambah Pelabuhan Baru'}</span>
              </h3>
              <button onClick={() => setPortModal({ open: false, item: null })} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Pelabuhan *</label>
                <input
                  type="text"
                  required
                  value={portModal.item.name || ''}
                  onChange={e => setPortModal({ ...portModal, item: { ...portModal.item, name: e.target.value } })}
                  placeholder="Contoh: Pelabuhan Teluk Bayur"
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode UN/LOCODE</label>
                  <input
                    type="text"
                    value={portModal.item.code || ''}
                    onChange={e => setPortModal({ ...portModal, item: { ...portModal.item, code: e.target.value } })}
                    placeholder="IDTBY"
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kota</label>
                  <input
                    type="text"
                    value={portModal.item.city || ''}
                    onChange={e => setPortModal({ ...portModal, item: { ...portModal.item, city: e.target.value } })}
                    placeholder="Padang"
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kedalaman Draft (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={portModal.item.draftDepthMeters || 12}
                    onChange={e => setPortModal({ ...portModal, item: { ...portModal.item, draftDepthMeters: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Berth</label>
                  <input
                    type="number"
                    value={portModal.item.berthCount || 6}
                    onChange={e => setPortModal({ ...portModal, item: { ...portModal.item, berthCount: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setPortModal({ open: false, item: null })} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-pink-600 text-white rounded-xl font-bold">Simpan Pelabuhan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL EDIT / TAMBAH CARGO */}
      {/* ========================================================================= */}
      {cargoModal.open && cargoModal.item && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Kelola Jenis Muatan Kargo</h3>
              <button onClick={() => setCargoModal({ open: false, item: null })} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCargoSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Muatan *</label>
                <input
                  type="text"
                  required
                  value={cargoModal.item.name || ''}
                  onChange={e => setCargoModal({ ...cargoModal, item: { ...cargoModal.item, name: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Satuan</label>
                  <input
                    type="text"
                    value={cargoModal.item.unit || 'TEU'}
                    onChange={e => setCargoModal({ ...cargoModal, item: { ...cargoModal.item, unit: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tarif Dasar (Rp)</label>
                  <input
                    type="number"
                    value={cargoModal.item.baseRatePerUnit || 0}
                    onChange={e => setCargoModal({ ...cargoModal, item: { ...cargoModal.item, baseRatePerUnit: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setCargoModal({ open: false, item: null })} className="px-4 py-2 bg-slate-100 rounded-xl font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-pink-600 text-white rounded-xl font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL EDIT / TAMBAH CUSTOMER */}
      {/* ========================================================================= */}
      {customerModal.open && customerModal.item && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Kelola Data Shipper / Pelanggan</h3>
              <button onClick={() => setCustomerModal({ open: false, item: null })} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCustomerSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Perusahaan *</label>
                <input
                  type="text"
                  required
                  value={customerModal.item.companyName || ''}
                  onChange={e => setCustomerModal({ ...customerModal, item: { ...customerModal.item, companyName: e.target.value } })}
                  placeholder="PT Samudera Logistik"
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama PIC</label>
                  <input
                    type="text"
                    value={customerModal.item.name || ''}
                    onChange={e => setCustomerModal({ ...customerModal, item: { ...customerModal.item, name: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={customerModal.item.phone || ''}
                    onChange={e => setCustomerModal({ ...customerModal, item: { ...customerModal.item, phone: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={customerModal.item.email || ''}
                  onChange={e => setCustomerModal({ ...customerModal, item: { ...customerModal.item, email: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setCustomerModal({ open: false, item: null })} className="px-4 py-2 bg-slate-100 rounded-xl font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-pink-600 text-white rounded-xl font-bold">Simpan Pelanggan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL EDIT / TAMBAH CREW */}
      {/* ========================================================================= */}
      {crewModal.open && crewModal.item && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Kelola Data Awak Kapal (ABK)</h3>
              <button onClick={() => setCrewModal({ open: false, item: null })} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCrewSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar Maritim *</label>
                <input
                  type="text"
                  required
                  value={crewModal.item.name || ''}
                  onChange={e => setCrewModal({ ...crewModal, item: { ...crewModal.item, name: e.target.value } })}
                  placeholder="Capt. Hendra Gunawan, M.Mar"
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jabatan di Kapal</label>
                  <select
                    value={crewModal.item.position || 'Nakhoda (Master)'}
                    onChange={e => setCrewModal({ ...crewModal, item: { ...crewModal.item, position: e.target.value as any } })}
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  >
                    <option value="Nakhoda (Master)">Nakhoda (Master)</option>
                    <option value="Chief Officer">Chief Officer</option>
                    <option value="Second Officer">Second Officer</option>
                    <option value="Chief Engineer">Chief Engineer</option>
                    <option value="Second Engineer">Second Engineer</option>
                    <option value="Bosun">Bosun</option>
                    <option value="AB Seaman">AB Seaman</option>
                    <option value="Oiler">Oiler</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sertifikasi Ijazah</label>
                  <input
                    type="text"
                    value={crewModal.item.certificate || ''}
                    onChange={e => setCrewModal({ ...crewModal, item: { ...crewModal.item, certificate: e.target.value } })}
                    placeholder="ANT-I / ATT-I"
                    className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kapal Penugasan</label>
                <select
                  value={crewModal.item.assignedVesselId || ''}
                  onChange={e => setCrewModal({ ...crewModal, item: { ...crewModal.item, assignedVesselId: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/30"
                >
                  {vessels.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.callSign})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setCrewModal({ open: false, item: null })} className="px-4 py-2 bg-slate-100 rounded-xl font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-pink-600 text-white rounded-xl font-bold">Simpan Awak Kapal</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
