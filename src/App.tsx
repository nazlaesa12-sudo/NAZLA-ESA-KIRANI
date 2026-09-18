import React, { useState, useEffect } from 'react';
import { 
  User, TabType, Shipment, Vessel, Port, CargoType, 
  Customer, CrewMember, Invoice, DatabaseConfig 
} from './types';
import { storageService } from './services/storageService';
import { AuthScreen } from './components/AuthScreen';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MasterDataView } from './components/MasterData/MasterDataView';
import { TransactionsView } from './components/Transactions/TransactionsView';
import { ManifestBillOfLading } from './components/Transactions/ManifestBillOfLading';
import { RealtimeTracker } from './components/Monitoring/RealtimeTracker';
import { ReportsView } from './components/Reports/ReportsView';
import { DatabaseModal } from './components/DatabaseModal';

export const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBlShipment, setSelectedBlShipment] = useState<Shipment | null>(null);

  // Database Modal & Config State
  const [dbModalOpen, setDbModalOpen] = useState<boolean>(false);
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => storageService.getDbConfig());

  // Domain State from Storage
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [cargoTypes, setCargoTypes] = useState<CargoType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [crews, setCrews] = useState<CrewMember[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Real-time AIS Simulation State
  const [simulating, setSimulating] = useState<boolean>(true);

  // Load initial data & session
  useEffect(() => {
    const user = storageService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setVessels(storageService.getVessels());
    setPorts(storageService.getPorts());
    setCargoTypes(storageService.getCargoTypes());
    setCustomers(storageService.getCustomers());
    setCrews(storageService.getCrews());
    setShipments(storageService.getShipments());
    setInvoices(storageService.getInvoices());
    setDbConfig(storageService.getDbConfig());
  };

  // Real-time GPS movement tick simulation
  useEffect(() => {
    if (!simulating) return;

    const interval = setInterval(() => {
      setVessels(prevVessels => {
        return prevVessels.map(v => {
          if (v.status !== 'berlayar') return v;

          // Slightly adjust coordinates along shipping lane
          const deltaLat = (Math.random() - 0.48) * 0.008;
          const deltaLng = (Math.random() - 0.48) * 0.008;
          const newSpeed = Math.min(18, Math.max(12, +(v.speedKnots + (Math.random() - 0.5) * 0.4).toFixed(1)));
          const newRpm = Math.floor(v.engineRpm + (Math.random() - 0.5) * 6);

          return {
            ...v,
            currentLat: v.currentLat + deltaLat,
            currentLng: v.currentLng + deltaLng,
            speedKnots: newSpeed,
            engineRpm: newRpm
          };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [simulating]);

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    storageService.setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storageService.setCurrentUser(null);
  };

  // Save Database Configuration
  const handleSaveDbConfig = (cfg: DatabaseConfig) => {
    storageService.saveDbConfig(cfg);
    setDbConfig(cfg);
  };

  // CRUD Handlers for Master Data
  const handleSaveVessel = (vessel: Vessel) => {
    storageService.saveVessel(vessel);
    refreshAllData();
  };

  const handleDeleteVessel = (id: string) => {
    storageService.deleteVessel(id);
    refreshAllData();
  };

  const handleSavePort = (port: Port) => {
    storageService.savePort(port);
    refreshAllData();
  };

  const handleDeletePort = (id: string) => {
    storageService.deletePort(id);
    refreshAllData();
  };

  const handleSaveCargoType = (cargo: CargoType) => {
    storageService.saveCargoType(cargo);
    refreshAllData();
  };

  const handleDeleteCargoType = (id: string) => {
    storageService.deleteCargoType(id);
    refreshAllData();
  };

  const handleSaveCustomer = (customer: Customer) => {
    storageService.saveCustomer(customer);
    refreshAllData();
  };

  const handleDeleteCustomer = (id: string) => {
    storageService.deleteCustomer(id);
    refreshAllData();
  };

  const handleSaveCrew = (crewMember: CrewMember) => {
    storageService.saveCrew(crewMember);
    refreshAllData();
  };

  const handleDeleteCrew = (id: string) => {
    storageService.deleteCrew(id);
    refreshAllData();
  };

  // Transactions Handlers
  const handleSaveShipment = (shipment: Shipment) => {
    storageService.saveShipment(shipment);
    refreshAllData();
  };

  const handleDeleteShipment = (id: string) => {
    storageService.deleteShipment(id);
    refreshAllData();
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    storageService.saveInvoice(invoice);
    refreshAllData();
  };

  const handleViewBillOfLading = (shipment: Shipment) => {
    setSelectedBlShipment(shipment);
  };

  // If user is not authenticated, show the bright pink Login Gate
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-pink-50/40 font-sans text-slate-900 selection:bg-pink-500 selection:text-white flex flex-col">
      
      {/* Top Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab: string) => {
          setActiveTab(tab);
          setSelectedBlShipment(null);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        dbConfig={dbConfig}
        onOpenDbModal={() => setDbModalOpen(true)}
        simulating={simulating}
        onToggleSimulation={() => setSimulating(!simulating)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 w-full flex-1">
        
        {/* If Bill of Lading Detail is selected */}
        {selectedBlShipment ? (
          <ManifestBillOfLading
            shipment={selectedBlShipment}
            vessels={vessels}
            ports={ports}
            customers={customers}
            cargoTypes={cargoTypes}
            onBack={() => setSelectedBlShipment(null)}
          />
        ) : (
          <>
            {/* 1. Dashboard View */}
            {activeTab === 'dashboard' && (
              <Dashboard
                vessels={vessels}
                ports={ports}
                shipments={shipments}
                customers={customers}
                invoices={invoices}
                onSelectShipment={handleViewBillOfLading}
                onNavigateTab={(tab: string) => {
                  setActiveTab(tab);
                  setSelectedBlShipment(null);
                }}
                onViewBillOfLading={handleViewBillOfLading}
                onOpenNewShipment={() => {
                  setActiveTab('transactions');
                }}
              />
            )}

            {/* 2. Master Data CRUD View */}
            {activeTab === 'master' && (
              <MasterDataView
                vessels={vessels}
                ports={ports}
                cargoTypes={cargoTypes}
                customers={customers}
                crew={crews}
                onSaveVessel={handleSaveVessel}
                onDeleteVessel={handleDeleteVessel}
                onSavePort={handleSavePort}
                onDeletePort={handleDeletePort}
                onSaveCargoType={handleSaveCargoType}
                onDeleteCargoType={handleDeleteCargoType}
                onSaveCustomer={handleSaveCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onSaveCrew={handleSaveCrew}
                onDeleteCrew={handleDeleteCrew}
              />
            )}

            {/* 3. Transactions & Invoicing View */}
            {activeTab === 'transactions' && (
              <TransactionsView
                shipments={shipments}
                vessels={vessels}
                ports={ports}
                customers={customers}
                cargoTypes={cargoTypes}
                invoices={invoices}
                onSaveShipment={handleSaveShipment}
                onDeleteShipment={handleDeleteShipment}
                onSaveInvoice={handleSaveInvoice}
                onViewBillOfLading={handleViewBillOfLading}
                onSelectShipment={handleViewBillOfLading}
              />
            )}

            {/* 4. Real-time Monitoring & AIS Nautical Cockpit */}
            {activeTab === 'monitoring' && (
              <RealtimeTracker
                vessels={vessels}
                ports={ports}
                shipments={shipments}
                simulating={simulating}
                onToggleSimulation={() => setSimulating(!simulating)}
              />
            )}

            {/* 5. Reports & Analytics Export */}
            {activeTab === 'reports' && (
              <ReportsView
                shipments={shipments}
                vessels={vessels}
                ports={ports}
                customers={customers}
                invoices={invoices}
              />
            )}
          </>
        )}

      </main>

      {/* Database Multi-Cloud Modal */}
      <DatabaseModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
        config={dbConfig}
        onSaveConfig={handleSaveDbConfig}
      />

      {/* Footer Branding */}
      <footer className="bg-white border-t border-pink-100 py-4 px-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-pink-700">MV KIRANI</span>
            <span>— Sistem Operasional Angkutan Laut & Logistik Nusantara</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Terhubung Multi-Database: PostgreSQL Neon DB • Supabase REST • Firebase Firestore
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
