import React, { useState } from 'react';
import { Incident, WardInfo, SanitationCrew, LiveActivity } from '../types';
import { ADMIN_PROFILE_IMAGE, ADMIN_MAP_BG } from '../data/initialData';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  incidents: Incident[];
  wards: WardInfo[];
  crews: SanitationCrew[];
  activities: LiveActivity[];
  onOpenAssignModal: (incident: Incident) => void;
  onOpenResolveModal: (incident: Incident) => void;
  onSelectIncident: (incident: Incident) => void;
  onSwitchToCitizen: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  incidents,
  wards,
  crews,
  activities,
  onOpenAssignModal,
  onOpenResolveModal,
  onSelectIncident,
  onSwitchToCitizen
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'incidents' | 'map' | 'wards' | 'analytics' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sidebarTheme, setSidebarTheme] = useState<'dark' | 'light'>('dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedIncidentDetail, setSelectedIncidentDetail] = useState<Incident | null>(null);

  // Critical items queue (unresolved critical/high)
  const criticalQueue = incidents.filter(
    (inc) => (inc.severity === 'critical' || inc.severity === 'high') && inc.status !== 'resolved'
  );

  // Filtered incidents for Incidents tab
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = 'Ward Number,Ward Name,Zone,Active Incidents,Density Level,7-Day Resolution Rate,Assigned Trucks,Sanitation Staff\n';
    const rows = wards
      .map(
        (w) =>
          `"${w.wardNumber}","${w.name}","${w.zone}",${w.activeIncidents},"${w.densityLevel}","${w.resolutionRate7d}%",${w.assignedTrucks},${w.sanitationStaff}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Jaipur_Ward_Intelligence_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#faf9f7] text-[#1A1A1A] font-body-md flex min-h-screen selection:bg-[#acf4a4] selection:text-[#002203]">
      {/* Navigation Drawer (Sidebar) */}
      <aside
        className={`${
          sidebarTheme === 'dark'
            ? 'bg-[#2f3130] text-[#f1f1ef] border-[#2f3130]'
            : 'bg-[#f4f3f1] text-[#1A1A1A] border-[#E5E7EB]'
        } border-r docked left-0 h-full w-72 hidden md:flex flex-col h-full py-7 px-5 fixed z-40 shadow-sm transition-colors duration-300`}
      >
        {/* Header: Profile */}
        <div className="flex items-center gap-3.5 mb-9 px-1">
          <img
            className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-sm"
            alt="Jaipur Civic Admin Officer"
            src={ADMIN_PROFILE_IMAGE}
          />
          <div className="flex flex-col">
            <span className="font-outfit text-[18px] font-bold tracking-tight">Jaipur Admin</span>
            <span
              className={`text-xs ${
                sidebarTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              } font-medium`}
            >
              Waste Management Office
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Control Center
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left ${
              activeTab === 'overview'
                ? 'bg-[#1b5e20] text-white shadow-sm scale-[1.01]'
                : sidebarTheme === 'dark'
                ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <span className="text-[14px]">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all text-left ${
              activeTab === 'incidents'
                ? 'bg-[#1b5e20] text-white shadow-sm font-bold'
                : sidebarTheme === 'dark'
                ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">report_problem</span>
              <span className="text-[14px]">Incidents Queue</span>
            </div>
            <span className="bg-[#D32F2F] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {criticalQueue.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
              activeTab === 'map'
                ? 'bg-[#1b5e20] text-white shadow-sm font-bold'
                : sidebarTheme === 'dark'
                ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span className="text-[14px]">Geo-Command Map</span>
          </button>

          <button
            onClick={() => setActiveTab('wards')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
              activeTab === 'wards'
                ? 'bg-[#1b5e20] text-white shadow-sm font-bold'
                : sidebarTheme === 'dark'
                ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">location_city</span>
            <span className="text-[14px]">Ward Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
              activeTab === 'analytics'
                ? 'bg-[#1b5e20] text-white shadow-sm font-bold'
                : sidebarTheme === 'dark'
                ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <span className="text-[14px]">Analytics & SLA</span>
          </button>
        </nav>

        {/* Switcher & Theme Control */}
        <div
          className={`mt-auto pt-4 border-t ${
            sidebarTheme === 'dark' ? 'border-white/10' : 'border-gray-300'
          } flex flex-col gap-2.5`}
        >
          <button
            onClick={onSwitchToCitizen}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">smartphone</span>
            Open Citizen View
          </button>

          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <span className="text-gray-400">Sidebar Theme</span>
            <button
              onClick={() => setSidebarTheme(sidebarTheme === 'dark' ? 'light' : 'dark')}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                sidebarTheme === 'dark'
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-gray-300 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {sidebarTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen bg-[#faf9f7] relative z-10">
        {/* TopAppBar (Admin) */}
        <header className="bg-white border-b border-[#E5E7EB] docked top-0 w-full shadow-sm flex items-center justify-between px-6 md:px-10 py-3.5 sticky z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToCitizen}
              className="md:hidden text-[#00450d] p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h1 className="font-outfit text-xl md:text-2xl text-[#00450d] font-bold tracking-tight">
                Operations Command Center
              </h1>
              <p className="text-[11px] text-gray-500 hidden md:block">
                Jaipur Municipal Corporation • Sanitation Fleet & SLA Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative w-48 md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                search
              </span>
              <input
                className="w-full bg-[#f4f3f1] border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00450d] focus:ring-1 focus:ring-[#00450d] transition-all"
                placeholder="Search ID, Ward, Type..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D32F2F] rounded-full ring-2 ring-white animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                    <span className="font-outfit text-sm font-bold text-gray-900">Live City Alerts</span>
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activities.length} New
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {activities.map((act) => (
                      <div key={act.id} className="text-xs p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex justify-between font-bold text-gray-800">
                          <span>{act.ward}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{act.timeAgo}</span>
                        </div>
                        <p className="text-gray-600 mt-0.5">{act.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Officer Badge */}
            <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-gray-200">
              <img
                src={ADMIN_PROFILE_IMAGE}
                alt="Aisha Sharma"
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-gray-900 leading-tight">Aisha Sharma</div>
                <div className="text-[10px] text-gray-500">Lead Dispatcher</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="px-5 md:px-10 py-7 max-w-[1520px] mx-auto w-full flex-1 flex flex-col gap-7">
          {/* VIEW: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-card flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Total Active Incidents
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#f4f3f1] flex items-center justify-center text-[#00450d]">
                      <span className="material-symbols-outlined text-[20px]">assignment</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-outfit text-3xl md:text-4xl font-bold text-gray-900">319</span>
                    <span className="text-xs text-red-600 font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      +4.2%
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1.5 font-medium">+12% from last week</span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-card flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Critical (SLA at Risk)
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                      <span className="material-symbols-outlined text-[20px]">warning</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-outfit text-3xl md:text-4xl font-bold text-[#D32F2F]">19</span>
                    <span className="text-xs text-red-600 font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      +2
                    </span>
                  </div>
                  <span className="text-[11px] text-[#D32F2F] mt-1.5 font-semibold">Immediate action needed</span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-card flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Pending Assignment
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#ffdcc6] flex items-center justify-center text-[#964900]">
                      <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-outfit text-3xl md:text-4xl font-bold text-[#fc820c]">71</span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">trending_down</span>
                      -12%
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1.5 font-medium">Requires vehicle dispatch</span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-card flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Resolved (Last 24h)
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#acf4a4]/40 flex items-center justify-center text-[#2E7D32]">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-outfit text-3xl md:text-4xl font-bold text-[#2E7D32]">142</span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      +18%
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1.5 font-medium">Within 3.4h avg turnaround</span>
                </div>
              </div>

              {/* Bento Grid: Live Hotspot Map (8 cols) & Critical Triage Queue (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* 8-col Map */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden flex flex-col relative h-[520px]">
                  {/* Top Map Header & Live Activity Toast */}
                  <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-3 shadow-sm max-w-xs">
                    <h3 className="font-outfit text-sm font-bold text-gray-900">Live Operations Hotspot Map</h3>
                    <p className="text-[11px] text-gray-500">Real-time incident clusters across all 15 wards</p>
                  </div>

                  {/* Toast Overlay */}
                  <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-3 shadow-md max-w-xs hidden sm:block">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-pulse"></span>
                      <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">
                        Live Activity
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-tight">
                      New <strong className="text-gray-900 font-semibold">Critical</strong> report in Ward 42:
                      Overflowing Bio-Waste.
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1 text-right">Just now</div>
                  </div>

                  {/* Map Image Base */}
                  <div
                    className="w-full h-full bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${ADMIN_MAP_BG}')` }}
                  >
                    {/* Markers */}
                    {incidents.slice(0, 6).map((incident) => {
                      const isCritical = incident.severity === 'critical';
                      return (
                        <div
                          key={incident.id}
                          style={{
                            left: `${incident.coordinates.x}%`,
                            top: `${incident.coordinates.y}%`
                          }}
                          onClick={() => onSelectIncident(incident)}
                          className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-20 group"
                        >
                          <div
                            className={`px-2 py-1 rounded-full text-white text-[11px] font-bold shadow-lg flex items-center gap-1 transition-transform group-hover:scale-110 ${
                              isCritical ? 'bg-[#D32F2F]' : 'bg-[#fc820c]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {isCritical ? 'error' : 'warning'}
                            </span>
                            <span className="font-mono text-[10px]">{incident.id}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4-col Critical Triage Queue */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-card flex flex-col h-[520px]">
                  <div className="p-4 border-b border-[#E5E7EB] bg-[#faf9f7] rounded-t-2xl flex justify-between items-center">
                    <div>
                      <h3 className="font-outfit text-base font-bold text-gray-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#D32F2F] text-[18px]">assignment_late</span>
                        Critical Triage Queue
                      </h3>
                      <p className="text-[11px] text-gray-500">Highest priority dispatch tickets</p>
                    </div>
                    <span className="bg-[#ffdad6] text-[#ba1a1a] px-2.5 py-1 rounded-full text-xs font-bold font-mono">
                      {criticalQueue.length} ACTIVE
                    </span>
                  </div>

                  {/* Scrollable List */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-[#f4f3f1]/50">
                    {criticalQueue.slice(0, 4).map((incident) => (
                      <div
                        key={incident.id}
                        className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm hover:border-[#00450d] transition-all flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-xs font-bold text-[#00450d] bg-emerald-50 px-2 py-0.5 rounded">
                            {incident.id}
                          </span>
                          <span
                            className={`text-xs font-bold flex items-center gap-1 px-2 py-0.5 rounded-sm ${
                              incident.isOverdue
                                ? 'text-[#D32F2F] bg-red-50'
                                : 'text-[#fc820c] bg-amber-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            {incident.slaRemaining}
                          </span>
                        </div>

                        <h4 className="font-outfit text-sm font-semibold text-gray-900 leading-snug">
                          {incident.title}
                        </h4>

                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          <span className="truncate">{incident.location} ({incident.ward})</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <span className="material-symbols-outlined text-[14px]">group</span>
                            <span>{incident.reportsCount} Reports</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onOpenAssignModal(incident)}
                              className="text-xs font-bold text-white bg-[#00450d] hover:bg-[#1b5e20] px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                            >
                              Quick Assign
                            </button>
                            <button
                              onClick={() => onOpenResolveModal(incident)}
                              className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Resolve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-[#E5E7EB] bg-[#faf9f7] text-center rounded-b-2xl">
                    <button
                      onClick={() => setActiveTab('incidents')}
                      className="text-xs font-bold text-[#00450d] hover:underline"
                    >
                      View All Incidents Queue ({incidents.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Ward Intelligence Table */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden flex flex-col">
                <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center bg-[#faf9f7]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00450d] text-2xl">insights</span>
                    <div>
                      <h3 className="font-outfit text-lg font-bold text-gray-900">
                        Ward Intelligence (Top 5 Active)
                      </h3>
                      <p className="text-xs text-gray-500">Live operational density & resolution scorecards</p>
                    </div>
                  </div>
                  <button
                    onClick={exportCSV}
                    className="text-xs text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Export CSV Report
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f4f3f1] text-[11px] text-gray-500 uppercase tracking-wider border-b border-[#E5E7EB]">
                        <th className="p-3.5 font-bold">Ward / Zone</th>
                        <th className="p-3.5 font-bold text-center">Active Incidents</th>
                        <th className="p-3.5 font-bold text-center">Density Level</th>
                        <th className="p-3.5 font-bold text-center">Fleet Trucks</th>
                        <th className="p-3.5 font-bold text-right">Resolution Rate (7d)</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-100">
                      {wards.slice(0, 5).map((ward) => (
                        <tr key={ward.wardNumber} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3.5 font-semibold text-gray-900 flex items-center gap-2">
                            <span className="font-mono text-gray-400">#{ward.wardNumber}</span>
                            <span>{ward.name}</span>
                            <span className="text-[10px] text-gray-400">({ward.zone})</span>
                          </td>

                          <td className="p-3.5 text-center font-bold text-gray-900">
                            <span
                              className={`px-2 py-0.5 rounded font-mono ${
                                ward.activeIncidents > 30 ? 'text-[#D32F2F] bg-red-50' : 'text-gray-800'
                              }`}
                            >
                              {ward.activeIncidents}
                            </span>
                          </td>

                          <td className="p-3.5 text-center">
                            <span
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                ward.densityLevel === 'HIGH'
                                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                  : ward.densityLevel === 'ELEVATED'
                                  ? 'bg-[#ffdcc6] text-[#964900]'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {ward.densityLevel}
                            </span>
                          </td>

                          <td className="p-3.5 text-center text-gray-600 font-medium">
                            {ward.assignedTrucks} Units ({ward.sanitationStaff} Staff)
                          </td>

                          <td className="p-3.5 text-right font-bold">
                            <span
                              className={`${
                                ward.resolutionRate7d >= 85
                                  ? 'text-emerald-700'
                                  : ward.resolutionRate7d >= 70
                                  ? 'text-amber-700'
                                  : 'text-red-600'
                              }`}
                            >
                              {ward.resolutionRate7d}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* VIEW: INCIDENTS MANAGEMENT */}
          {activeTab === 'incidents' && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden p-6 flex flex-col gap-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-outfit text-2xl font-bold text-gray-900">Incidents Dispatch Queue</h2>
                  <p className="text-xs text-gray-500">Review incoming reports, assign teams, and inspect resolutions</p>
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  {['all', 'submitted', 'under_review', 'assigned', 'in_progress', 'resolved'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all ${
                        statusFilter === st
                          ? 'bg-[#00450d] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incidents Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="p-3.5 font-bold">ID & Category</th>
                      <th className="p-3.5 font-bold">Location / Ward</th>
                      <th className="p-3.5 font-bold">Severity</th>
                      <th className="p-3.5 font-bold">Status</th>
                      <th className="p-3.5 font-bold">Assigned Unit</th>
                      <th className="p-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredIncidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-mono font-bold text-[#00450d]">{inc.id}</div>
                          <div className="font-semibold text-gray-900 mt-0.5">{inc.title}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="text-gray-800">{inc.location}</div>
                          <div className="text-[11px] text-gray-500">{inc.ward}</div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                              inc.severity === 'critical'
                                ? 'bg-red-100 text-red-700'
                                : inc.severity === 'high'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {inc.severity}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              inc.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inc.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : inc.status === 'assigned'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {inc.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3.5 text-gray-700">
                          {inc.assignedTeam ? (
                            <span className="font-medium text-emerald-900 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                              {inc.assignedTeam.split('-')[0]}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Unassigned</span>
                          )}
                        </td>

                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => onOpenAssignModal(inc)}
                            className="bg-[#00450d] hover:bg-[#1b5e20] text-white px-2.5 py-1 rounded-lg font-bold text-[11px]"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => onOpenResolveModal(inc)}
                            className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-2.5 py-1 rounded-lg font-bold text-[11px]"
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: GEO COMMAND MAP */}
          {activeTab === 'map' && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-outfit text-2xl font-bold text-gray-900">Geo-Command Fleet & Hotspots Map</h2>
                  <p className="text-xs text-gray-500">Live GPS tracking of sanitation trucks and real-time citizen reports</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">GPS Signal: Active (18 Fleet Units)</span>
                </div>
              </div>

              <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src={ADMIN_MAP_BG}
                  alt="Jaipur Operation Grid"
                  className="w-full h-full object-cover"
                />
                {/* Fleet Icons */}
                {crews.map((crew, idx) => (
                  <div
                    key={crew.id}
                    style={{
                      left: `${30 + idx * 12}%`,
                      top: `${35 + idx * 10}%`
                    }}
                    className="absolute p-2 bg-emerald-900 text-white rounded-xl shadow-xl flex items-center gap-1.5 text-xs font-bold transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    <span>{crew.name.split('(')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: WARDS INTELLIGENCE */}
          {activeTab === 'wards' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-outfit text-2xl font-bold text-gray-900">Jaipur Ward Cleanliness & Fleet Breakdown</h2>
                  <p className="text-xs text-gray-500">Municipal division resource management and performance indicators</p>
                </div>
                <button
                  onClick={exportCSV}
                  className="bg-[#00450d] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Export Complete Ward Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {wards.map((ward) => (
                  <div
                    key={ward.wardNumber}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          Ward #{ward.wardNumber}
                        </span>
                        <span className="text-xs font-bold text-gray-700">{ward.zone}</span>
                      </div>

                      <h3 className="font-outfit text-xl font-bold text-gray-900 mt-1">{ward.name}</h3>

                      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100 text-xs">
                        <div>
                          <div className="text-gray-400 text-[11px]">Active Issues</div>
                          <div className="font-outfit text-lg font-bold text-gray-900">{ward.activeIncidents}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-[11px]">Cleanliness Index</div>
                          <div className="font-outfit text-lg font-bold text-emerald-700">{ward.cleanlinessScore}/100</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-[11px]">Fleet Allocated</div>
                          <div className="font-bold text-gray-800">{ward.assignedTrucks} Vehicles</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-[11px]">7d Resolution</div>
                          <div className="font-bold text-emerald-800">{ward.resolutionRate7d}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 text-xs flex justify-between items-center text-gray-500">
                      <div>
                        <div className="font-semibold text-gray-800">{ward.supervisor}</div>
                        <div className="text-[10px] text-gray-400">{ward.supervisorPhone}</div>
                      </div>
                      <span className="material-symbols-outlined text-gray-400">call</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card col-span-2">
                <h3 className="font-outfit text-lg font-bold text-gray-900 mb-4">7-Day Resolution Velocity & SLA Compliance</h3>
                <div className="space-y-4">
                  {[
                    { day: 'Monday', total: 42, resolved: 38, rate: '90%' },
                    { day: 'Tuesday', total: 56, resolved: 51, rate: '91%' },
                    { day: 'Wednesday', total: 48, resolved: 45, rate: '93%' },
                    { day: 'Thursday', total: 64, resolved: 59, rate: '92%' },
                    { day: 'Friday', total: 72, resolved: 68, rate: '94%' },
                    { day: 'Saturday', total: 39, resolved: 37, rate: '95%' },
                    { day: 'Sunday (Today)', total: 45, resolved: 41, rate: '91%' }
                  ].map((item) => (
                    <div key={item.day} className="flex items-center gap-4 text-xs">
                      <span className="w-28 font-semibold text-gray-700">{item.day}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden flex">
                        <div
                          className="bg-[#00450d] h-full rounded-full"
                          style={{ width: item.rate }}
                        ></div>
                      </div>
                      <span className="w-16 text-right font-bold text-gray-900">{item.rate} ({item.resolved}/{item.total})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex flex-col justify-between">
                <div>
                  <h3 className="font-outfit text-lg font-bold text-gray-900 mb-2">Category Distribution</h3>
                  <p className="text-xs text-gray-500 mb-4">Breakdown of reported incident types this month</p>

                  <div className="space-y-3 text-xs">
                    {[
                      { name: 'Overflowing Bins', percent: '44%', count: '138', color: 'bg-emerald-600' },
                      { name: 'Illegal Dumping', percent: '28%', count: '89', color: 'bg-amber-600' },
                      { name: 'Blocked Drainage', percent: '16%', count: '48', color: 'bg-blue-600' },
                      { name: 'Bio & Hazardous Waste', percent: '8%', count: '24', color: 'bg-red-600' },
                      { name: 'Street Litter', percent: '4%', count: '12', color: 'bg-purple-600' }
                    ].map((cat) => (
                      <div key={cat.name} className="flex justify-between items-center p-2 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
                          <span className="font-semibold text-gray-800">{cat.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">{cat.count} ({cat.percent})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  Total Managed Tickets: <strong>311 This Month</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
