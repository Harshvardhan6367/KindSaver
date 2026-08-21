import React, { useState } from 'react';
import { Incident, SeverityLevel } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: Incident) => void;
}

const SAMPLE_PHOTOS = [
  {
    title: 'Overflowing Bin',
    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    category: 'Massive Overflowing Bin' as const
  },
  {
    title: 'Illegal Dumping',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    category: 'Illegal Dumping Site' as const
  },
  {
    title: 'Blocked Drain',
    url: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=800&q=80',
    category: 'Blocked Drainage' as const
  },
  {
    title: 'Street Litter',
    url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    category: 'Street Litter & Debris' as const
  }
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [category, setCategory] = useState<Incident['category']>('Massive Overflowing Bin');
  const [ward, setWard] = useState('Ward 42 - Malviya Nagar');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `KR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const wardNumberMatch = ward.match(/\d+/);
    const wardNumber = wardNumberMatch ? parseInt(wardNumberMatch[0], 10) : 42;

    // Determine coordinate jitter around Jaipur center based on ward
    const baseCoords =
      wardNumber === 42 ? { x: 60 + Math.random() * 6, y: 70 + Math.random() * 6 } :
      wardNumber === 18 ? { x: 72 + Math.random() * 6, y: 80 + Math.random() * 6 } :
      wardNumber === 33 ? { x: 36 + Math.random() * 6, y: 52 + Math.random() * 6 } :
      wardNumber === 12 ? { x: 42 + Math.random() * 6, y: 74 + Math.random() * 6 } :
      wardNumber === 5 ? { x: 44 + Math.random() * 6, y: 28 + Math.random() * 6 } :
      { x: 50 + Math.random() * 10, y: 50 + Math.random() * 10 };

    const newIncident: Incident = {
      id: generatedId,
      title: `${category} in ${ward.split('-')[1]?.trim() || ward}`,
      category,
      location: location.trim() || 'Near Main Landmark',
      ward,
      wardNumber,
      coordinates: baseCoords,
      severity,
      status: 'submitted',
      reportsCount: 1,
      openDuration: 'Just reported',
      slaRemaining: severity === 'critical' ? '6h SLA active' : '24h SLA active',
      isOverdue: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: description.trim() || 'Public waste report submitted via citizen app.',
      imageUrl,
      citizenName: citizenName.trim() || 'Anonymous Citizen',
      citizenPhone: citizenPhone.trim() || '+91 98290 XXXXX'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedId(generatedId);
      onSubmit(newIncident);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 overflow-hidden my-6"
        >
          {/* Header */}
          <div className="bg-[#00450d] text-white p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  add_a_photo
                </span>
              </div>
              <div>
                <h3 className="font-outfit text-xl font-bold">Report Waste Hotspot</h3>
                <p className="text-xs text-white/80">Jaipur Municipal Corporation • Swift Action Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {submittedId ? (
            <div className="p-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <h4 className="font-outfit text-2xl font-bold text-gray-900">Report Successfully Lodged!</h4>
              <p className="text-gray-600 text-sm max-w-md">
                Your report has been forwarded directly to the Ward Dispatch Center. You can track cleanup progress in real-time.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tracking Reference ID</span>
                <span className="font-mono text-lg font-bold text-[#00450d]">{submittedId}</span>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-[#00450d] hover:bg-[#1b5e20] text-white font-outfit font-semibold py-3.5 rounded-xl transition-all shadow-md mt-2"
              >
                Back to Live Map
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Photo Evidence (Required)
                </label>
                <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 p-3 flex flex-col items-center gap-3">
                  <div className="relative w-full h-44 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={imageUrl}
                      alt="Waste Evidence"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[11px] px-2.5 py-1 rounded-full font-mono backdrop-blur-sm">
                      GPS Tagged: Jaipur
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between gap-2">
                    <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">upload_file</span>
                      Upload from Device
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <span className="text-xs text-gray-400 font-medium">or select preset:</span>
                  </div>

                  {/* Sample presets */}
                  <div className="grid grid-cols-4 gap-2 w-full">
                    {SAMPLE_PHOTOS.map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => {
                          setImageUrl(item.url);
                          setCategory(item.category);
                        }}
                        className={`text-[11px] p-1.5 rounded-lg border text-left transition-all ${
                          imageUrl === item.url
                            ? 'border-[#00450d] bg-emerald-50 text-[#00450d] font-bold ring-2 ring-[#00450d]/20'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="truncate font-medium">{item.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Issue Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Massive Overflowing Bin', icon: 'delete_sweep' },
                    { label: 'Illegal Dumping Site', icon: 'report_problem' },
                    { label: 'Blocked Drainage', icon: 'water_damage' },
                    { label: 'Hazardous Bio-Waste', icon: 'biohazard' },
                    { label: 'Street Litter & Debris', icon: 'cleaning_services' },
                    { label: 'Dead Animal', icon: 'pets' }
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label as any)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all text-xs font-medium ${
                        category === cat.label
                          ? 'border-[#00450d] bg-emerald-50/70 text-[#00450d] font-bold ring-1 ring-[#00450d]'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ward and Specific Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Ward / Zone
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-[#00450d] focus:ring-1 focus:ring-[#00450d]"
                  >
                    <option value="Ward 42 - Malviya Nagar">Ward 42 - Malviya Nagar (South)</option>
                    <option value="Ward 18 - Sita Pura">Ward 18 - Sita Pura (Industrial)</option>
                    <option value="Ward 33 - Vaishali Nagar">Ward 33 - Vaishali Nagar (West)</option>
                    <option value="Ward 12 - Mansarovar">Ward 12 - Mansarovar (West)</option>
                    <option value="Ward 05 - Vidyadhar Nagar">Ward 05 - Vidyadhar Nagar (North)</option>
                    <option value="Ward 01 - Hawa Mahal Heritage Zone">Ward 01 - Hawa Mahal Heritage Zone</option>
                    <option value="Ward 21 - C-Scheme & Civil Lines">Ward 21 - C-Scheme & Civil Lines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Exact Location / Landmark
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Opposite Gaurav Tower Block B"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-[#00450d] focus:ring-1 focus:ring-[#00450d]"
                  />
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Severity / Urgency
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'low', label: 'Low', color: 'border-emerald-300 text-emerald-700 bg-emerald-50' },
                    { id: 'moderate', label: 'Moderate', color: 'border-blue-300 text-blue-700 bg-blue-50' },
                    { id: 'high', label: 'High', color: 'border-amber-300 text-amber-800 bg-amber-50' },
                    { id: 'critical', label: 'Critical (SLA 6h)', color: 'border-red-300 text-red-700 bg-red-50 font-bold' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSeverity(lvl.id as SeverityLevel)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs transition-all ${
                        severity === lvl.id
                          ? `${lvl.color} ring-2 ring-[#00450d]/30 font-bold`
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Additional Details / Observations
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the issue, size of spill, whether road is blocked, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-[#00450d] focus:ring-1 focus:ring-[#00450d]"
                />
              </div>

              {/* Citizen Details */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Phone for SMS Updates
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98290 12345"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00450d] hover:bg-[#1b5e20] text-white font-outfit text-base font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    Transmitting to Dispatch Control...
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      send
                    </span>
                    Submit Waste Report
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
