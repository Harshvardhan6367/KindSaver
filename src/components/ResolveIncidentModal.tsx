import React, { useState } from 'react';
import { Incident } from '../types';
import { motion } from 'motion/react';

interface ResolveIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  onResolve: (incidentId: string, resolvedImageUrl: string) => void;
}

export const ResolveIncidentModal: React.FC<ResolveIncidentModalProps> = ({
  isOpen,
  onClose,
  incident,
  onResolve
}) => {
  const [resolvedImageUrl, setResolvedImageUrl] = useState(
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  );
  const [resolutionNotes, setResolutionNotes] = useState(
    'Area completely swept, garbage hauled to Langar Ke Balaji landfill, bins sanitized.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !incident) return null;

  const handleResolve = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onResolve(incident.id, resolvedImageUrl);
      setIsSubmitting(false);
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
        <div className="bg-[#2E7D32] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <div>
              <h3 className="font-outfit text-xl font-bold">Mark Incident as Resolved</h3>
              <p className="text-xs text-white/80">Submit Cleanup Verification & Photographic Proof</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs">
            <div className="font-mono font-bold text-emerald-800">{incident.id} • {incident.title}</div>
            <div className="text-gray-500 mt-0.5">{incident.location} ({incident.ward})</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Post-Cleanup Photo Evidence
            </label>
            <div className="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 h-44">
              <img
                src={resolvedImageUrl}
                alt="Resolved proof"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">
                Cleaned & Sanitized
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Sanitation Supervisor Notes
            </label>
            <textarea
              rows={2}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
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
              disabled={isSubmitting}
              onClick={handleResolve}
              className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b5e20] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Finalizing Resolution...' : 'Approve & Close Incident'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
