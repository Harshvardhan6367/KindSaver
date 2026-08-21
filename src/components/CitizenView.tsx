import React, { useState } from 'react';
import { Incident, Hotspot } from '../types';
import { CITIZEN_MAP_BG, CITIZEN_OFFICER_AVATAR } from '../data/initialData';
import { motion } from 'motion/react';

interface CitizenViewProps {
  incidents: Incident[];
  hotspots: Hotspot[];
  onOpenReportModal: () => void;
  onOpenTrackModal: (incidentId?: string) => void;
  onSelectIncident: (incident: Incident) => void;
  onUpvoteIncident: (id: string) => void;
}

export const CitizenView: React.FC<CitizenViewProps> = ({
  incidents,
  hotspots,
  onOpenReportModal,
  onOpenTrackModal,
  onSelectIncident,
  onUpvoteIncident
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'report' | 'track' | 'hotspots'>('map');
  const [selectedPin, setSelectedPin] = useState<Incident | null>(null);
  const [selectedWardFilter, setSelectedWardFilter] = useState<string | null>(null);

  // Metrics calculation
  const totalReports = incidents.reduce((acc, curr) => acc + curr.reportsCount, 240);
  const activeReports = incidents.filter((i) => i.status !== 'resolved').length + 65;
  const resolvedCount = incidents.filter((i) => i.status === 'resolved').length + 32;
  const criticalCount = incidents.filter((i) => i.severity === 'critical' && i.status !== 'resolved').length + 14;

  const filteredIncidents = selectedWardFilter
    ? incidents.filter((inc) => inc.ward.toLowerCase().includes(selectedWardFilter.toLowerCase()))
    : incidents;

  return (
    <div className="bg-[#faf9f7] text-[#1a1c1b] font-body-md antialiased pb-28 md:pb-8 md:pl-72 flex flex-col min-h-screen selection:bg-[#00450d]/20 relative">
      {/* Mobile Top App Bar */}
      <header className="fixed top-0 w-full z-40 flex items-center justify-between px-5 h-16 bg-[#faf9f7]/90 backdrop-blur-md border-b border-gray-200/50 md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#00450d]/10 p-1.5 rounded-lg flex items-center justify-center text-[#00450d]">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              park
            </span>
          </div>
          <h1 className="font-outfit text-[22px] font-bold text-[#1a1c1b] tracking-tight">
            Jaipur's Live Waste Map
          </h1>
        </div>

        <button
          onClick={() => onOpenTrackModal()}
          className="text-xs bg-emerald-50 text-[#00450d] font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1 shadow-sm"
        >
          <span className="material-symbols-outlined text-[14px]">search</span>
          Track
        </button>
      </header>

      {/* Desktop Navigation Sidebar (Matches shared civic context) */}
      <nav className="hidden md:flex flex-col h-full py-8 px-6 fixed left-0 top-0 w-72 bg-white border-r border-[#E5E7EB] z-40 shadow-sm">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="bg-[#00450d]/10 p-2 rounded-xl flex items-center justify-center text-[#00450d]">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              park
            </span>
          </div>
          <div>
            <h1 className="font-outfit text-xl font-bold text-[#1a1c1b] tracking-tight leading-tight">
              Jaipur's Live Waste Map
            </h1>
            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Citizen Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8 px-2 p-3 bg-[#faf9f7] rounded-xl border border-gray-200/60">
          <img
            className="w-11 h-11 rounded-full object-cover ring-2 ring-[#00450d]/20"
            alt="Civic Admin Officer"
            src={CITIZEN_OFFICER_AVATAR}
          />
          <div>
            <div className="font-outfit text-sm font-bold text-gray-900">Jaipur Ward Desk</div>
            <div className="text-xs text-gray-500">Citizen Helpline 24/7</div>
          </div>
        </div>

        <ul className="flex flex-col gap-1.5 flex-1">
          <li>
            <button
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all text-left ${
                activeTab === 'map'
                  ? 'bg-[#00450d] text-white shadow-sm scale-[1.02]'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">explore</span>
              <span className="text-[14px]">Live Waste Map</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setActiveTab('report');
                onOpenReportModal();
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-100 transition-colors rounded-xl font-medium text-left"
            >
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
              <span className="text-[14px]">Report Hotspot</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setActiveTab('track');
                onOpenTrackModal();
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-100 transition-colors rounded-xl font-medium text-left"
            >
              <span className="material-symbols-outlined text-[20px]">assignment</span>
              <span className="text-[14px]">Track Complaints</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('hotspots')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all text-left ${
                activeTab === 'hotspots'
                  ? 'bg-[#00450d] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
              <span className="text-[14px]">Ward Hotspots</span>
            </button>
          </li>
        </ul>

        {/* Quick Report Trigger on Sidebar */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onOpenReportModal}
            className="w-full bg-[#00450d] hover:bg-[#1b5e20] text-white py-3 px-4 rounded-xl font-outfit text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Report Waste Now
          </button>
        </div>
      </nav>

      {/* Main Canvas Content */}
      <main className="flex-1 mt-16 md:mt-0 pt-4 md:pt-8 px-4 md:px-10 flex flex-col gap-6 max-w-[1360px] mx-auto w-full relative">
        {/* Stats Bar */}
        <section className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-200/70 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 p-2 md:p-3">
            <div className="flex flex-col items-center justify-center p-3">
              <span className="font-outfit text-[26px] md:text-[30px] font-bold text-[#1a1c1b] leading-none mb-1">
                {totalReports}
              </span>
              <span className="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest font-semibold">
                Reports
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3">
              <span className="font-outfit text-[26px] md:text-[30px] font-bold text-[#fc820c] leading-none mb-1">
                {activeReports}
              </span>
              <span className="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest font-semibold">
                Active
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3">
              <span className="font-outfit text-[26px] md:text-[30px] font-bold text-[#2E7D32] leading-none mb-1">
                {resolvedCount}
              </span>
              <span className="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest font-semibold">
                Resolved
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3">
              <span className="font-outfit text-[26px] md:text-[30px] font-bold text-[#D32F2F] leading-none mb-1">
                {criticalCount}
              </span>
              <span className="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest font-semibold">
                Critical
              </span>
            </div>
          </div>
        </section>

        {/* Interactive Map Container */}
        <section className="relative w-full h-[460px] md:h-[560px] rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)] bg-[#e8eae6] border border-gray-200/80 group">
          {/* Map Base Image */}
          <img
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-[1.02]"
            alt="Top-down Jaipur Street Map"
            src={CITIZEN_MAP_BG}
          />

          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f7]/40 via-transparent to-transparent pointer-events-none" />

          {/* Map Top Floating Header / Filter */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl px-4 py-2 shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-gray-800">Jaipur Live Cluster Map</span>
            </div>

            {selectedWardFilter && (
              <button
                onClick={() => setSelectedWardFilter(null)}
                className="bg-[#00450d] text-white text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-sm"
              >
                Filtering: {selectedWardFilter}
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          {/* Interactive Pins Overlay */}
          <div className="absolute inset-0 p-4">
            {filteredIncidents.map((incident) => {
              const isCritical = incident.severity === 'critical';
              const isWarning = incident.severity === 'high';
              const isResolved = incident.status === 'resolved';

              return (
                <div
                  key={incident.id}
                  style={{
                    left: `${incident.coordinates.x}%`,
                    top: `${incident.coordinates.y}%`
                  }}
                  onClick={() => {
                    setSelectedPin(incident);
                    onSelectIncident(incident);
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-20 group/pin"
                >
                  {/* Pin outer pulse */}
                  <div
                    className={`p-1.5 rounded-full mb-0.5 transition-transform group-hover/pin:scale-125 ${
                      isCritical
                        ? 'bg-red-500/20 animate-pulse'
                        : isWarning
                        ? 'bg-amber-500/20'
                        : 'bg-emerald-500/20'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-full shadow-lg flex items-center justify-center text-white text-[15px] ${
                        isCritical
                          ? 'bg-[#D32F2F]'
                          : isWarning
                          ? 'bg-[#fc820c]'
                          : 'bg-[#2E7D32]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isCritical ? 'error' : isWarning ? 'warning' : 'check_circle'}
                      </span>
                    </div>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="hidden md:group-hover/pin:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-900/90 text-white text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap shadow-xl flex-col items-center pointer-events-none">
                    <span className="font-bold">{incident.title}</span>
                    <span className="text-[10px] text-gray-300">
                      {incident.ward} • {incident.reportsCount} Reports
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Pin Popup Drawer / Card */}
          {selectedPin && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-24 md:w-96 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-gray-200 z-30 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#00450d] bg-emerald-100/60 px-2 py-0.5 rounded">
                      {selectedPin.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        selectedPin.severity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : selectedPin.severity === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {selectedPin.severity}
                    </span>
                  </div>
                  <h4 className="font-outfit text-base font-bold text-gray-900 mt-1">{selectedPin.title}</h4>
                  <p className="text-xs text-gray-500">{selectedPin.location} ({selectedPin.ward})</p>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  onClick={() => onUpvoteIncident(selectedPin.id)}
                  className="text-xs text-gray-600 font-semibold flex items-center gap-1.5 hover:text-[#00450d]"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#00450d]">thumb_up</span>
                  {selectedPin.reportsCount} Citizens Reported
                </button>
                <button
                  onClick={() => onOpenTrackModal(selectedPin.id)}
                  className="text-xs font-bold text-[#00450d] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                >
                  Track Status
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Floating Action Button (FAB) */}
          <button
            onClick={onOpenReportModal}
            className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-[#00450d] text-white rounded-full pl-5 pr-6 py-4 flex items-center gap-3 shadow-[0_8px_24px_rgba(0,69,13,0.35)] hover:shadow-[0_12px_32px_rgba(0,69,13,0.45)] hover:-translate-y-1 transition-all duration-300 z-20"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              add
            </span>
            <span className="font-outfit text-[15px] font-bold uppercase tracking-wider mt-0.5">
              Report Waste
            </span>
          </button>
        </section>

        {/* Recent Hotspots Section */}
        <section className="flex flex-col gap-5 mb-8">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="font-outfit text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight">
              Recent Hotspots
            </h2>
            <button
              onClick={() => setSelectedWardFilter(null)}
              className="text-sm font-semibold text-[#00450d] hover:underline"
            >
              View All Hotspots
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotspots.map((hotspot) => {
              const isCritical = hotspot.severity === 'Critical';
              return (
                <div
                  key={hotspot.name}
                  onClick={() => setSelectedWardFilter(hotspot.name)}
                  className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-200/60 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all duration-300 cursor-pointer flex flex-col gap-4 group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-outfit text-xl text-gray-900 font-semibold group-hover:text-[#00450d] transition-colors">
                        {hotspot.name}
                      </h3>
                      <p className="text-[14px] text-gray-500 mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">location_on</span>
                        {hotspot.zone}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-sm ${
                        isCritical
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : 'bg-[#ffdcc6] text-[#723600]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isCritical ? 'local_fire_department' : 'warning'}
                      </span>
                      {hotspot.severity}
                    </span>
                  </div>

                  <div className="h-px w-full bg-gray-100" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-outfit text-3xl font-bold leading-none ${
                          isCritical ? 'text-[#D32F2F]' : 'text-[#fc820c]'
                        }`}
                      >
                        {hotspot.activeReports}
                      </span>
                      <span className="text-[15px] text-gray-600 font-medium">Active Reports</span>
                    </div>

                    <span className="text-xs text-gray-400 font-medium">{hotspot.primaryCategory}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 w-full z-40 flex justify-around items-center px-2 py-3 bg-white/95 backdrop-blur-lg shadow-[0_-8px_32px_rgba(0,0,0,0.06)] border-t border-gray-200/80">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center w-16 transition-transform active:scale-95 ${
            activeTab === 'map' ? 'text-[#00450d]' : 'text-gray-500'
          }`}
        >
          <div
            className={`rounded-full px-5 py-1.5 mb-0.5 transition-colors ${
              activeTab === 'map' ? 'bg-[#1b5e20] text-white shadow-sm' : 'bg-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              map
            </span>
          </div>
          <span className="text-[11px] font-bold">Map</span>
        </button>

        <button
          onClick={onOpenReportModal}
          className="flex flex-col items-center justify-center text-gray-600 hover:text-[#00450d] w-16 transition-transform active:scale-95 group"
        >
          <div className="px-5 py-1.5 mb-0.5 group-hover:bg-[#00450d]/5 rounded-full">
            <span className="material-symbols-outlined text-2xl">add_a_photo</span>
          </div>
          <span className="text-[11px] font-medium">Report</span>
        </button>

        <button
          onClick={() => onOpenTrackModal()}
          className="flex flex-col items-center justify-center text-gray-600 hover:text-[#00450d] w-16 transition-transform active:scale-95 group"
        >
          <div className="px-5 py-1.5 mb-0.5 group-hover:bg-[#00450d]/5 rounded-full">
            <span className="material-symbols-outlined text-2xl">assignment</span>
          </div>
          <span className="text-[11px] font-medium">Track</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('recent-hotspots');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center text-gray-600 hover:text-[#00450d] w-16 transition-transform active:scale-95 group"
        >
          <div className="px-5 py-1.5 mb-0.5 group-hover:bg-[#00450d]/5 rounded-full">
            <span className="material-symbols-outlined text-2xl">local_fire_department</span>
          </div>
          <span className="text-[11px] font-medium">Hotspots</span>
        </button>
      </nav>
    </div>
  );
};
