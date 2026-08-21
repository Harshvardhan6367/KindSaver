import React, { useState } from 'react';
import { Incident, SanitationCrew } from '../types';
import { motion } from 'motion/react';

interface AssignCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  crews: SanitationCrew[];
  onAssign: (incidentId: string, crewName: string, crewPhone: string) => void;
}

export const AssignCrewModal: React.FC<AssignCrewModalProps> = ({
  isOpen,
  onClose,
  incident,
  crews,
  onAssign
}) => {
  const [selectedCrewId, setSelectedCrewId] = useState<string>(crews[0]?.id || '');
  const [priorityNote, setPriorityNote] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  if (!isOpen || !incident) return null;

  const handleAssign = () => {
    const crew = crews.find((c) => c.id === selectedCrewId) || crews[0];
    setIsAssigning(true);

    setTimeout(() => {
      onAssign(incident.id, crew.name, crew.phone);
      setIsAssigning(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#00450d] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_shipping
              </span>
            </div>
            <div>
              <h3 className="font-outfit text-xl font-bold">Dispatch Sanitation Unit</h3>
              <p className="text-xs text-white/80">Rapid Triage & Task Allocation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Incident quick brief */}
        <div className="p-6 flex flex-col gap-5">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#00450d] bg-emerald-100/60 px-2 py-0.5 rounded">
                {incident.id}
              </span>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 uppercase">
                {incident.severity} Priority
              </span>
            </div>
            <h4 className="font-outfit text-base font-bold text-gray-900">{incident.title}</h4>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-gray-400">location_on</span>
              {incident.location}, {incident.ward}
            </p>
          </div>

          {/* Select Crew */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Available Fleet Units & Heavy Compactor Teams
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {crews.map((crew) => (
                <label
                  key={crew.id}
                  onClick={() => setSelectedCrewId(crew.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedCrewId === crew.id
                      ? 'border-[#00450d] bg-emerald-50 text-[#00450d] ring-1 ring-[#00450d]'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="crew"
                      checked={selectedCrewId === crew.id}
                      onChange={() => setSelectedCrewId(crew.id)}
                      className="accent-[#00450d]"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{crew.name}</div>
                      <div className="text-[11px] text-gray-500">
                        Leader: {crew.leader} • Vehicle: {crew.vehicleNo}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        crew.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {crew.status}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-0.5">{crew.currentWard}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Priority Note */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Special Instructions to Driver / Crew Lead
            </label>
            <input
              type="text"
              placeholder="e.g. Bring extra 1100L heavy bin & bio-spray for street washdown"
              value={priorityNote}
              onChange={(e) => setPriorityNote(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:border-[#00450d] focus:ring-1 focus:ring-[#00450d]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isAssigning}
              onClick={handleAssign}
              className="px-6 py-2.5 rounded-xl bg-[#00450d] hover:bg-[#1b5e20] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {isAssigning ? 'Dispatching Crew...' : 'Confirm & Dispatch Crew'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
