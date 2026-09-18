import { 
  Vessel, Port, CargoType, Customer, CrewMember, Shipment, Invoice, DatabaseConfig, User 
} from '../types';
import { 
  INITIAL_PORTS, INITIAL_VESSELS, INITIAL_CARGO_TYPES, 
  INITIAL_CUSTOMERS, INITIAL_CREW, INITIAL_SHIPMENTS, INITIAL_INVOICES 
} from '../data/initialData';

const STORAGE_KEYS = {
  PORTS: 'mvkirani_ports_v1',
  VESSELS: 'mvkirani_vessels_v1',
  CARGO_TYPES: 'mvkirani_cargo_types_v1',
  CUSTOMERS: 'mvkirani_customers_v1',
  CREW: 'mvkirani_crew_v1',
  SHIPMENTS: 'mvkirani_shipments_v1',
  INVOICES: 'mvkirani_invoices_v1',
  DB_CONFIG: 'mvkirani_db_config_v1',
  AUTH_USER: 'mvkirani_auth_user_v1'
};

export const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@kirani.maritime.id',
    name: 'Admin Utama MV KIRANI',
    role: 'admin',
    jabatan: 'Direktur Operasional & Logistik',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+62 811 8800 123'
  },
  {
    id: 'user-nakhoda',
    email: 'nakhoda@kirani.maritime.id',
    name: 'Capt. Hendra Gunawan, M.Mar',
    role: 'nakhoda',
    jabatan: 'Nakhoda MV KIRANI (Master Mariner)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+62 811 2345 678'
  },
  {
    id: 'user-logistik',
    email: 'logistik@kirani.maritime.id',
    name: 'Fathia Rahmadani, S.T.',
    role: 'logistik',
    jabatan: 'Kepala Manifest & Billing Kargo',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+62 812 9900 443'
  }
];

export const DEFAULT_DB_CONFIG: DatabaseConfig = {
  activeProvider: 'local',
  neon: {
    connectionString: '',
    status: 'disconnected'
  },
  supabase: {
    url: '',
    anonKey: '',
    status: 'disconnected'
  },
  firebase: {
    projectId: 'kirani-sea-transport',
    apiKey: '',
    status: 'disconnected'
  },
  autoSync: true
};

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.PORTS)) {
      this.save(STORAGE_KEYS.PORTS, INITIAL_PORTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VESSELS)) {
      this.save(STORAGE_KEYS.VESSELS, INITIAL_VESSELS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CARGO_TYPES)) {
      this.save(STORAGE_KEYS.CARGO_TYPES, INITIAL_CARGO_TYPES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      this.save(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CREW)) {
      this.save(STORAGE_KEYS.CREW, INITIAL_CREW);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SHIPMENTS)) {
      this.save(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      this.save(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DB_CONFIG)) {
      this.save(STORAGE_KEYS.DB_CONFIG, DEFAULT_DB_CONFIG);
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  // Auth User
  public getAuthUser(): User | null {
    return this.load<User | null>(STORAGE_KEYS.AUTH_USER, null);
  }

  public setAuthUser(user: User | null) {
    this.save(STORAGE_KEYS.AUTH_USER, user);
  }

  // Vessels (Armada Kapal)
  public getVessels(): Vessel[] {
    return this.load<Vessel[]>(STORAGE_KEYS.VESSELS, INITIAL_VESSELS);
  }

  public saveVessel(vessel: Vessel): void {
    const list = this.getVessels();
    const index = list.findIndex(v => v.id === vessel.id);
    if (index >= 0) {
      list[index] = vessel;
    } else {
      list.unshift(vessel);
    }
    this.save(STORAGE_KEYS.VESSELS, list);
  }

  public deleteVessel(id: string): void {
    const list = this.getVessels().filter(v => v.id !== id);
    this.save(STORAGE_KEYS.VESSELS, list);
  }

  // Ports (Pelabuhan)
  public getPorts(): Port[] {
    return this.load<Port[]>(STORAGE_KEYS.PORTS, INITIAL_PORTS);
  }

  public savePort(port: Port): void {
    const list = this.getPorts();
    const index = list.findIndex(p => p.id === port.id);
    if (index >= 0) {
      list[index] = port;
    } else {
      list.unshift(port);
    }
    this.save(STORAGE_KEYS.PORTS, list);
  }

  public deletePort(id: string): void {
    const list = this.getPorts().filter(p => p.id !== id);
    this.save(STORAGE_KEYS.PORTS, list);
  }

  // Cargo Types (Jenis Muatan)
  public getCargoTypes(): CargoType[] {
    return this.load<CargoType[]>(STORAGE_KEYS.CARGO_TYPES, INITIAL_CARGO_TYPES);
  }

  public saveCargoType(cargo: CargoType): void {
    const list = this.getCargoTypes();
    const index = list.findIndex(c => c.id === cargo.id);
    if (index >= 0) {
      list[index] = cargo;
    } else {
      list.unshift(cargo);
    }
    this.save(STORAGE_KEYS.CARGO_TYPES, list);
  }

  public deleteCargoType(id: string): void {
    const list = this.getCargoTypes().filter(c => c.id !== id);
    this.save(STORAGE_KEYS.CARGO_TYPES, list);
  }

  // Customers (Shippers & Consignees)
  public getCustomers(): Customer[] {
    return this.load<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }

  public saveCustomer(cust: Customer): void {
    const list = this.getCustomers();
    const index = list.findIndex(c => c.id === cust.id);
    if (index >= 0) {
      list[index] = cust;
    } else {
      list.unshift(cust);
    }
    this.save(STORAGE_KEYS.CUSTOMERS, list);
  }

  public deleteCustomer(id: string): void {
    const list = this.getCustomers().filter(c => c.id !== id);
    this.save(STORAGE_KEYS.CUSTOMERS, list);
  }

  // Crew (Awak Kapal)
  public getCrew(): CrewMember[] {
    return this.load<CrewMember[]>(STORAGE_KEYS.CREW, INITIAL_CREW);
  }

  public getCrews(): CrewMember[] {
    return this.getCrew();
  }

  public getCurrentUser(): User | null {
    return this.load<User | null>(STORAGE_KEYS.AUTH_USER, null);
  }

  public setCurrentUser(user: User | null): void {
    this.save(STORAGE_KEYS.AUTH_USER, user);
  }

  public saveCrew(crew: CrewMember): void {
    const list = this.getCrew();
    const index = list.findIndex(c => c.id === crew.id);
    if (index >= 0) {
      list[index] = crew;
    } else {
      list.unshift(crew);
    }
    this.save(STORAGE_KEYS.CREW, list);
  }

  public deleteCrew(id: string): void {
    const list = this.getCrew().filter(c => c.id !== id);
    this.save(STORAGE_KEYS.CREW, list);
  }

  // Shipments (Surat Jalan & Manifest Muatan)
  public getShipments(): Shipment[] {
    return this.load<Shipment[]>(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
  }

  public saveShipment(shipment: Shipment): void {
    const list = this.getShipments();
    const index = list.findIndex(s => s.id === shipment.id);
    if (index >= 0) {
      list[index] = { ...shipment, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...shipment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    this.save(STORAGE_KEYS.SHIPMENTS, list);

    // Auto-generate / update associated invoice if not yet exist
    this.syncInvoiceFromShipment(shipment);
  }

  public deleteShipment(id: string): void {
    const list = this.getShipments().filter(s => s.id !== id);
    this.save(STORAGE_KEYS.SHIPMENTS, list);
  }

  // Invoices (Faktur & Pembayaran)
  public getInvoices(): Invoice[] {
    return this.load<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  }

  public saveInvoice(invoice: Invoice): void {
    const list = this.getInvoices();
    const index = list.findIndex(i => i.id === invoice.id);
    if (index >= 0) {
      list[index] = invoice;
    } else {
      list.unshift(invoice);
    }
    this.save(STORAGE_KEYS.INVOICES, list);
  }

  public deleteInvoice(id: string): void {
    const list = this.getInvoices().filter(i => i.id !== id);
    this.save(STORAGE_KEYS.INVOICES, list);
  }

  private syncInvoiceFromShipment(shipment: Shipment) {
    const invoices = this.getInvoices();
    const existing = invoices.find(inv => inv.shipmentId === shipment.id);
    const customer = this.getCustomers().find(c => c.id === shipment.customerId);
    const subtotal = shipment.totalFreight;
    const ppn = Math.round(subtotal * 0.11);
    const adminFee = 250000;
    const totalAmount = subtotal + ppn + adminFee;

    if (!existing) {
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNo: `INV/KRNI/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`,
        shipmentId: shipment.id,
        shippingOrderNo: shipment.shippingOrderNo,
        blNumber: shipment.blNumber,
        customerId: shipment.customerId,
        customerName: customer ? customer.companyName : 'Pelanggan Maritim',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        subtotal,
        ppn,
        adminFee,
        totalAmount,
        paidAmount: shipment.paymentStatus === 'paid' ? totalAmount : 0,
        status: shipment.paymentStatus === 'paid' ? 'paid' : 'unpaid',
        paymentMethod: 'bank_transfer',
        notes: `Uang Tambang untuk Surat Jalan ${shipment.shippingOrderNo}`
      };
      this.saveInvoice(newInvoice);
    }
  }

  // DB Config
  public getDbConfig(): DatabaseConfig {
    return this.load<DatabaseConfig>(STORAGE_KEYS.DB_CONFIG, DEFAULT_DB_CONFIG);
  }

  public saveDbConfig(config: DatabaseConfig): void {
    this.save(STORAGE_KEYS.DB_CONFIG, config);
  }

  // Reset to demo data
  public resetToDefaults(): void {
    this.save(STORAGE_KEYS.PORTS, INITIAL_PORTS);
    this.save(STORAGE_KEYS.VESSELS, INITIAL_VESSELS);
    this.save(STORAGE_KEYS.CARGO_TYPES, INITIAL_CARGO_TYPES);
    this.save(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    this.save(STORAGE_KEYS.CREW, INITIAL_CREW);
    this.save(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
    this.save(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  }
}

export const storageService = new StorageService();
