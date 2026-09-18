import React, { useRef } from 'react';
import { 
  Ship, Anchor, Printer, Download, ArrowLeft, CheckCircle2, 
  Shield, QrCode, FileText, Share2, Award
} from 'lucide-react';
import { Shipment, Vessel, Port, Customer, CargoType } from '../../types';

interface ManifestBillOfLadingProps {
  shipment: Shipment;
  vessels: Vessel[];
  ports: Port[];
  customers: Customer[];
  cargoTypes: CargoType[];
  onBack: () => void;
}

export const ManifestBillOfLading: React.FC<ManifestBillOfLadingProps> = ({
  shipment,
  vessels,
  ports,
  customers,
  cargoTypes,
  onBack
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const vessel = vessels.find(v => v.id === shipment.vesselId) || vessels[0];
  const originPort = ports.find(p => p.id === shipment.originPortId) || ports[0];
  const destPort = ports.find(p => p.id === shipment.destinationPortId) || ports[1];
  const shipper = customers.find(c => c.id === shipment.customerId) || customers[0];
  const consignee = customers.find(c => c.id === shipment.consigneeId) || shipper;
  const cargo = cargoTypes.find(c => c.id === shipment.cargoTypeId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-pink-100 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Dokumen Resmi Bill of Lading (Konosemen)
            </h2>
            <p className="text-xs text-slate-500">
              No: <span className="font-mono font-bold text-pink-600">{shipment.blNumber}</span> • Surat Jalan: {shipment.shippingOrderNo}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Bill of Lading / PDF</span>
          </button>
        </div>
      </div>

      {/* Official Bill of Lading Document Sheet (Standard Maritime Layout) */}
      <div 
        ref={printRef}
        className="bg-white max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-300 text-slate-900 font-sans relative print:p-0 print:border-none print:shadow-none print:m-0"
      >
        
        {/* Document Header */}
        <div className="border-b-2 border-pink-700 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-pink-700 text-white flex items-center justify-center shadow-md print:bg-pink-700">
              <Anchor className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-pink-700 tracking-tight">
                PT PELAYARAN MV KIRANI SAMUDERA LINES
              </h1>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Layanan Angkutan Laut Petikemas & Kargo Nusantara
              </p>
              <p className="text-[11px] text-slate-500">
                Gedung Samudera Kirani Lt. 8, Tanjung Priok, Jakarta • Telp: (021) 4301071 • Email: operations@kirani.maritime.id
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-slate-200">
            <div className="text-xs font-bold text-pink-700 uppercase tracking-widest">
              ORIGINAL BILL OF LADING
            </div>
            <div className="text-lg font-black font-mono text-slate-900 mt-1">
              {shipment.blNumber}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              MANIFEST: {shipment.manifestNo}
            </div>
          </div>
        </div>

        {/* 2-Column Shipper & Consignee Grid */}
        <div className="grid grid-cols-2 border-b border-slate-300 text-xs">
          
          {/* Shipper */}
          <div className="p-4 border-r border-slate-300">
            <span className="font-bold text-[10px] text-pink-700 uppercase block mb-1">
              1. Pengirim Barang (SHIPPER / EXPORTER):
            </span>
            <div className="font-extrabold text-sm text-slate-900">{shipper.companyName}</div>
            <div className="text-slate-600 mt-0.5">{shipper.address}, {shipper.city}</div>
            <div className="text-slate-500 text-[11px] mt-1">
              PIC: {shipper.name} • Telp: {shipper.phone} • NPWP: {shipper.npwp}
            </div>
          </div>

          {/* Consignee */}
          <div className="p-4">
            <span className="font-bold text-[10px] text-pink-700 uppercase block mb-1">
              2. Penerima Barang (CONSIGNEE):
            </span>
            <div className="font-extrabold text-sm text-slate-900">{consignee.companyName}</div>
            <div className="text-slate-600 mt-0.5">{consignee.address}, {consignee.city}</div>
            <div className="text-slate-500 text-[11px] mt-1">
              PIC: {consignee.name} • Telp: {consignee.phone}
            </div>
          </div>

        </div>

        {/* Vessel & Ports Grid */}
        <div className="grid grid-cols-4 border-b border-slate-300 text-xs divide-x divide-slate-300">
          <div className="p-3">
            <span className="font-bold text-[10px] text-slate-500 uppercase block">Kapal Pengangkut (Vessel)</span>
            <span className="font-bold text-slate-900 text-sm">{vessel.name}</span>
            <span className="text-[10px] text-pink-700 block font-mono">Call: {vessel.callSign}</span>
          </div>

          <div className="p-3">
            <span className="font-bold text-[10px] text-slate-500 uppercase block">Nakhoda (Master)</span>
            <span className="font-bold text-slate-900">{vessel.captainName}</span>
            <span className="text-[10px] text-slate-500 block">Bendera: {vessel.flag}</span>
          </div>

          <div className="p-3">
            <span className="font-bold text-[10px] text-slate-500 uppercase block">Pelabuhan Muat (POL)</span>
            <span className="font-bold text-slate-900">{originPort.name}</span>
            <span className="text-[10px] text-slate-500 block">{originPort.city} ({originPort.code})</span>
          </div>

          <div className="p-3">
            <span className="font-bold text-[10px] text-slate-500 uppercase block">Pelabuhan Bongkar (POD)</span>
            <span className="font-bold text-pink-700 text-sm">{destPort.name}</span>
            <span className="text-[10px] text-slate-500 block">{destPort.city} ({destPort.code})</span>
          </div>
        </div>

        {/* Cargo Specification Table */}
        <div className="my-4 border border-slate-300 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-pink-50/80 text-pink-950 font-bold border-b border-slate-300">
              <tr>
                <th className="p-3">Container / Seal No.</th>
                <th className="p-3">Jumlah & Satuan</th>
                <th className="p-3">Deskripsi Muatan (Description of Goods)</th>
                <th className="p-3 text-right">Berat Kotor (Gross Wt)</th>
                <th className="p-3 text-right">Volume (CBM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3 font-mono font-bold text-pink-700">
                  {shipment.containerNumber || 'BREAK-BULK'}
                  <div className="text-[10px] text-slate-500 font-normal">Seal: {shipment.sealNumber || '-'}</div>
                </td>
                <td className="p-3 font-bold text-slate-800">
                  {shipment.quantity} {cargo?.unit || 'TEU / Colli'}
                </td>
                <td className="p-3">
                  <div className="font-bold text-slate-900">{shipment.cargoDescription}</div>
                  <div className="text-[11px] text-slate-500 italic mt-0.5">
                    Instruksi: {shipment.specialInstructions || 'Standar perkapalan maritim.'}
                  </div>
                </td>
                <td className="p-3 text-right font-extrabold text-slate-900">
                  {shipment.weightTon.toLocaleString()} Ton
                </td>
                <td className="p-3 text-right font-semibold text-slate-700">
                  {shipment.volumeCbm.toLocaleString()} CBM
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Freight Calculation Summary Box */}
        <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Status Freight</span>
            <span className="font-extrabold text-pink-700 uppercase">
              {shipment.paymentStatus === 'paid' ? 'FREIGHT PREPAID (LUNAS)' : 'FREIGHT COLLECT'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Biaya Tambang (Freight)</span>
            <span className="text-base font-black text-slate-900">
              Rp {shipment.totalFreight.toLocaleString('id-ID')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimasi Waktu Tiba (ETA)</span>
            <span className="font-bold text-slate-800">
              {new Date(shipment.eta).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Signatures & Official Maritime Stempel */}
        <div className="mt-8 pt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
          
          {/* Shipper signature */}
          <div className="flex flex-col justify-between h-32">
            <span className="font-bold text-slate-600">Tanda Tangan Pengirim (Shipper)</span>
            <div>
              <div className="font-bold text-slate-900 underline">{shipper.name}</div>
              <div className="text-[10px] text-slate-500">{shipper.companyName}</div>
            </div>
          </div>

          {/* Digital Maritime Verification Seal */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-pink-600 flex flex-col items-center justify-center p-1 transform rotate-[-8deg] opacity-85 shadow-inner">
              <Anchor className="w-6 h-6 text-pink-700" />
              <span className="text-[8px] font-black text-pink-700 uppercase text-center leading-tight">
                PT PELAYARAN<br/>MV KIRANI<br/>OFFICIAL SEAL
              </span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1">Terverifikasi Digital Port Clearance</span>
          </div>

          {/* Master / Carrier signature */}
          <div className="flex flex-col justify-between h-32">
            <span className="font-bold text-slate-600">Untuk & Atas Nama Nakhoda / Carrier</span>
            <div>
              <div className="font-bold text-pink-700 underline">{vessel.captainName}</div>
              <div className="text-[10px] text-slate-500 font-semibold">Master of Vessel: {vessel.name}</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
