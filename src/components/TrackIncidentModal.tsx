import React, { useState } from 'react';
import { Incident } from '../types';
import { motion } from 'motion/react';

interface TrackIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  selectedIncidentId?: string | null;
  onUpvoteIncident: (id: string) => void;
}

export const TrackIncidentModal: React.FC<TrackIncidentModalProps> = ({
  isOpen,
  onClose,
  incidents,
  selectedIncidentId,
  onUpvoteIncident
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedIncidentId || '');
  const [activeIncidentId, setActiveIncidentId] = useState<string>(
    selectedIncidentId || incidents[0]?.id || ''
  );
  const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentIncident =
    incidents.find((inc) => inc.id === activeIncidentId) ||
    incidents.find((inc) => inc.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    incidents[0];

  const handleUpvote = (id: string) => {
    if (!hasUpvoted[id]) {
      onUpvoteIncident(id);
      setHasUpvoted((prev) => ({ ...prev, [id]: true }));
    }
  };

  const steps = [
    { key: 'submitted', label: 'Report Submitted', desc: 'Received at City Waste Desk' },
    { key: 'under_review', label: 'Under Review', desc: 'Ward Supervisor inspecting issue' },
    { key: 'assigned', label: 'Crew Dispatched', desc: 'Assigned to field sanitation team' },
    { key: 'in_progress', label: 'Cleanup In Progress', desc: 'Trucks & machinery at site' },
    { key: 'resolved', label: 'Resolved & Cleared', desc: 'Photographic proof submitted' }
  ];

  const getStepIndex = (status: Incident['status']) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'under_review':
        return 1;
      case 'assigned':
        return 2;
      case 'in_progress':
        return 3;
      case 'resolved':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = currentIncident ? getStepIndex(currentIncident.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 overflow-hidden my-6 flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="bg-[#00450d] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                assignment
              </span>
            </div>
            <div>
              <h3 className="font-outfit text-xl font-bold">Track Incident Status</h3>
              <p className="text-xs text-white/80">Real-Time SLA & Sanitation Crew Dispatch Log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search by Tracking ID (e.g. KR-2026-0042)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00450d] focus:ring-1 focus:ring-[#00450d]"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[240px]">
            {incidents.slice(0, 3).map((inc) => (
              <button
                key={inc.id}
                onClick={() => setActiveIncidentId(inc.id)}
                className={`text-xs px-2.5 py-2 rounded-lg font-mono font-bold whitespace-nowrap transition-colors ${
                  activeIncidentId === inc.id
                    ? 'bg-[#00450d] text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {inc.id}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {currentIncident ? (
          <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-1">
            {/* Top Incident Summary Card */}
            <div className="bg-[#faf9f7] rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm font-bold bg-[#acf4a4]/40 text-[#00450d] px-2.5 py-0.5 rounded">
                    {currentIncident.id}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      currentIncident.severity === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : currentIncident.severity === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {currentIncident.severity}
                  </span>
                  <span className="text-xs text-gray-500">• {currentIncident.openDuration}</span>
                </div>

                <h4 className="font-outfit text-xl font-bold text-gray-900 mb-1">{currentIncident.title}</h4>

                <p className="text-xs text-gray-600 flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-[16px] text-gray-400">location_on</span>
                  <strong className="text-gray-800">{currentIncident.location}</strong> ({currentIncident.ward})
                </p>

                <p className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
                  {currentIncident.description}
                </p>
              </div>

              {/* Photos comparison / preview */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-36 h-36 rounded-xl overflow-hidden bg-gray-200 border border-gray-300 shadow-inner">
                  <img
                    src={currentIncident.status === 'resolved' && currentIncident.resolvedImageUrl ? currentIncident.resolvedImageUrl : currentIncident.imageUrl}
                    alt={currentIncident.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-1 font-semibold">
                    {currentIncident.status === 'resolved' ? 'After Cleanup' : 'Reported Photo'}
                  </div>
                </div>

                <button
                  onClick={() => handleUpvote(currentIncident.id)}
                  className={`w-full text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    hasUpvoted[currentIncident.id]
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                  {hasUpvoted[currentIncident.id] ? 'Confirmed (Reported)' : `I also see this (${currentIncident.reportsCount})`}
                </button>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#00450d]">timeline</span>
                Resolution Progress Stepper
              </h5>

              <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="relative group">
                      {/* Step marker */}
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-[#00450d] text-white ring-4 ring-emerald-100'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isDone ? (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              isCurrent ? 'text-[#00450d]' : isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span className="bg-[#00450d] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full animate-pulse">
                              Current Status
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>

                        {/* Extra contextual details for assigned crew */}
                        {step.key === 'assigned' && currentIncident.assignedTeam && idx <= currentStepIdx && (
                          <div className="mt-2 bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                            <div>
                              <div className="font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                                {currentIncident.assignedTeam}
                              </div>
                              <div className="text-[11px] text-emerald-700 mt-0.5">
                                Emergency Line: {currentIncident.assignedCrewContact || '+91 98290 11420'}
                              </div>
                            </div>
                            <span className="bg-emerald-600 text-white font-bold px-2 py-1 rounded text-[10px]">
                              ON SITE
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
            <p>No matching report found for this ID.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
