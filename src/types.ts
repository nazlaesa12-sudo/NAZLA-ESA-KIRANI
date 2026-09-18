export type Role = 'admin' | 'nakhoda' | 'logistik' | 'operator';

export type TabType = 'dashboard' | 'master' | 'transactions' | 'monitoring' | 'reports';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  jabatan: string;
  phone?: string;
}

export type VesselStatus = 'berlayar' | 'bongkar_muat' | 'sandar' | 'perawatan' | 'siap';

export interface Vessel {
  id: string;
  name: string;
  callSign: string;
  imoNumber: string;
  flag: string;
  type: string;
  dwt: number; // Deadweight Tonnage
  grossTonnage: number;
  capacityTeu: number;
  capacityTon: number;
  captainName: string;
  status: VesselStatus;
  currentPortId: string;
  destinationPortId?: string;
  currentLat: number;
  currentLng: number;
  speedKnots: number;
  heading: number; // in degrees
  eta?: string;
  etd?: string;
  fuelPercentage: number;
  engineRpm: number;
  yearBuilt: number;
  lastMaintenance: string;
  notes?: string;
}

export interface Port {
  id: string;
  code: string;
  name: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  draftDepthMeters: number;
  berthCount: number;
  operationalHours: string;
  contactPerson: string;
  phone: string;
  status: 'aktif' | 'padat' | 'maintenance';
}

export interface CargoType {
  id: string;
  code: string;
  name: string;
  category: 'FCL_CONTAINER' | 'LCL_GENERAL' | 'CURAH_KERING' | 'CURAH_CAIR' | 'REEFER' | 'HEAVY_CARGO';
  unit: string;
  baseRatePerUnit: number;
  description: string;
  hazardClass?: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  companyName: string;
  type: 'shipper' | 'consignee' | 'both';
  npwp: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  creditLimit: number;
  totalTransactions: number;
  status: 'aktif' | 'suspended';
}

export interface CrewMember {
  id: string;
  code: string;
  name: string;
  position: 'Nakhoda (Master)' | 'Chief Officer' | 'Second Officer' | 'Chief Engineer' | 'Second Engineer' | 'Bosun' | 'AB Seaman' | 'Oiler';
  seamanBookNumber: string;
  certificate: string;
  assignedVesselId: string;
  phone: string;
  emergencyContact: string;
  contractEnd: string;
  status: 'aktif' | 'cuti' | 'standby';
}

export type ShipmentStatus = 
  | 'draft'
  | 'booking'
  | 'loading'
  | 'in_transit'
  | 'berthing'
  | 'discharging'
  | 'delivered'
  | 'cancelled';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  location: string;
  status: ShipmentStatus;
  description: string;
  updatedBy: string;
}

export interface Shipment {
  id: string;
  shippingOrderNo: string;
  blNumber: string; // Bill of Lading
  manifestNo: string;
  vesselId: string;
  originPortId: string;
  destinationPortId: string;
  customerId: string;
  consigneeId?: string;
  cargoTypeId: string;
  cargoDescription: string;
  containerNumber?: string;
  sealNumber?: string;
  quantity: number;
  weightTon: number;
  volumeCbm: number;
  ratePerTon: number;
  bunkerSurcharge: number;
  harborDues: number;
  totalFreight: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  status: ShipmentStatus;
  etd: string;
  eta: string;
  actualDeparture?: string;
  actualArrival?: string;
  currentLat?: number;
  currentLng?: number;
  progressPercent: number;
  specialInstructions?: string;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  shipmentId: string;
  shippingOrderNo: string;
  blNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  ppn: number; // 11% tax
  adminFee: number;
  totalAmount: number;
  paidAmount: number;
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: 'bank_transfer' | 'letter_of_credit' | 'cash';
  notes?: string;
}

export type DatabaseProvider = 'local' | 'neon' | 'supabase' | 'firebase';

export interface DatabaseConfig {
  activeProvider: DatabaseProvider;
  neon: {
    connectionString: string;
    status: 'connected' | 'disconnected' | 'error' | 'testing';
    lastTested?: string;
    errorMessage?: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    status: 'connected' | 'disconnected' | 'error' | 'testing';
    lastTested?: string;
    errorMessage?: string;
  };
  firebase: {
    projectId: string;
    apiKey: string;
    status: 'connected' | 'disconnected' | 'error' | 'testing';
    lastTested?: string;
    errorMessage?: string;
  };
  autoSync: boolean;
  lastSyncTime?: string;
}
