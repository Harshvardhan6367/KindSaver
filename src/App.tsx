import { useState, useEffect } from 'react';
import { Incident, WardInfo, Hotspot, SanitationCrew, LiveActivity } from './types';
import {
  INITIAL_INCIDENTS,
  INITIAL_WARDS,
  INITIAL_HOTSPOTS,
  INITIAL_CREWS,
  INITIAL_ACTIVITIES
} from './data/initialData';
import { TopHeaderNav } from './components/TopHeaderNav';
import { CitizenView } from './components/CitizenView';
import { AdminDashboard } from './components/AdminDashboard';
import { ReportModal } from './components/ReportModal';
import { TrackIncidentModal } from './components/TrackIncidentModal';
import { AssignCrewModal } from './components/AssignCrewModal';
import { ResolveIncidentModal } from './components/ResolveIncidentModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'citizen' | 'admin'>('citizen');

  // Core persistent state
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('jaipur_incidents_v1');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [wards, setWards] = useState<WardInfo[]>(() => {
    const saved = localStorage.getItem('jaipur_wards_v1');
    return saved ? JSON.parse(saved) : INITIAL_WARDS;
  });

  const [hotspots, setHotspots] = useState<Hotspot[]>(() => {
    const saved = localStorage.getItem('jaipur_hotspots_v1');
    return saved ? JSON.parse(saved) : INITIAL_HOTSPOTS;
  });

  const [crews, setCrews] = useState<SanitationCrew[]>(() => {
    const saved = localStorage.getItem('jaipur_crews_v1');
    return saved ? JSON.parse(saved) : INITIAL_CREWS;
  });

  const [activities, setActivities] = useState<LiveActivity[]>(INITIAL_ACTIVITIES);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedIncidentForTrack, setSelectedIncidentForTrack] = useState<string | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('jaipur_incidents_v1', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('jaipur_wards_v1', JSON.stringify(wards));
  }, [wards]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddIncident = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);

    // Update corresponding ward active incidents
    setWards((prev) =>
      prev.map((w) =>
        w.wardNumber === newIncident.wardNumber
          ? { ...w, activeIncidents: w.activeIncidents + 1 }
          : w
      )
    );

    // Update hotspots
    setHotspots((prev) =>
      prev.map((h) =>
        h.wardNumber === newIncident.wardNumber
          ? { ...h, activeReports: h.activeReports + 1 }
          : h
      )
    );

    // Add live activity
    const newAct: LiveActivity = {
      id: `ACT-${Date.now()}`,
      type: 'new_report',
      message: `Citizen reported: ${newIncident.title} (${newIncident.location})`,
      ward: newIncident.ward,
      timeAgo: 'Just now',
      severity: newIncident.severity
    };
    setActivities((prev) => [newAct, ...prev]);

    showToast(`Report ${newIncident.id} successfully recorded! Dispatcher notified.`);
  };

  const handleAssignCrew = (incidentId: string, crewName: string, crewPhone: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'assigned',
              assignedTeam: crewName,
              assignedCrewContact: crewPhone,
              updatedAt: new Date().toISOString()
            }
          : inc
      )
    );

    const act: LiveActivity = {
      id: `ACT-${Date.now()}`,
      type: 'crew_assigned',
      message: `${crewName} dispatched to ${incidentId}`,
      ward: 'Dispatched',
      timeAgo: 'Just now',
      severity: 'moderate'
    };
    setActivities((prev) => [act, ...prev]);

    showToast(`Dispatched ${crewName} to ticket ${incidentId}`);
  };

  const handleResolveIncident = (incidentId: string, resolvedImageUrl: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'resolved',
              resolvedImageUrl,
              resolvedAt: new Date().toISOString(),
              slaRemaining: 'Resolved within SLA',
              isOverdue: false,
              updatedAt: new Date().toISOString()
            }
          : inc
      )
    );

    const target = incidents.find((i) => i.id === incidentId);
    if (target) {
      setWards((prev) =>
        prev.map((w) =>
          w.wardNumber === target.wardNumber
            ? {
                ...w,
                activeIncidents: Math.max(0, w.activeIncidents - 1),
                resolutionRate7d: Math.min(100, w.resolutionRate7d + 1)
              }
            : w
        )
      );
    }

    const act: LiveActivity = {
      id: `ACT-${Date.now()}`,
      type: 'resolved',
      message: `Incident ${incidentId} cleared and verified with photographic evidence`,
      ward: target?.ward || 'Jaipur',
      timeAgo: 'Just now',
      severity: 'low'
    };
    setActivities((prev) => [act, ...prev]);

    showToast(`Incident ${incidentId} successfully marked as Resolved!`);
  };

  const handleUpvoteIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, reportsCount: inc.reportsCount + 1 } : inc
      )
    );
    showToast(`Your confirmation was added to report #${id}.`);
  };

  const handleSimulateReport = () => {
    const randomWards = [
      { name: 'Ward 42 - Malviya Nagar', num: 42, loc: 'Near World Trade Park back alley', cat: 'Massive Overflowing Bin' as const },
      { name: 'Ward 18 - Sita Pura', num: 18, loc: 'Plot 45 RIICO Road', cat: 'Illegal Dumping Site' as const },
      { name: 'Ward 33 - Vaishali Nagar', num: 33, loc: 'Near Gandhi Path Drainage', cat: 'Blocked Drainage' as const }
    ];
    const item = randomWards[Math.floor(Math.random() * randomWards.length)];
    const generatedId = `KR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const simulated: Incident = {
      id: generatedId,
      title: `${item.cat} in ${item.name.split('-')[1]?.trim()}`,
      category: item.cat,
      location: item.loc,
      ward: item.name,
      wardNumber: item.num,
      coordinates: { x: 50 + (Math.random() * 20 - 10), y: 55 + (Math.random() * 20 - 10) },
      severity: 'critical',
      status: 'submitted',
      reportsCount: Math.floor(Math.random() * 5) + 1,
      openDuration: 'Just reported',
      slaRemaining: '6h SLA active',
      isOverdue: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'Incoming live citizen transmission via automated civic sensor & camera.',
      imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
      citizenName: 'Deepak Saxena',
      citizenPhone: '+91 98290 88765'
    };

    handleAddIncident(simulated);
  };

  const handleResetData = () => {
    localStorage.removeItem('jaipur_incidents_v1');
    localStorage.removeItem('jaipur_wards_v1');
    localStorage.removeItem('jaipur_hotspots_v1');
    localStorage.removeItem('jaipur_crews_v1');
    setIncidents(INITIAL_INCIDENTS);
    setWards(INITIAL_WARDS);
    setHotspots(INITIAL_HOTSPOTS);
    setCrews(INITIAL_CREWS);
    setActivities(INITIAL_ACTIVITIES);
    showToast('Reset all database records to initial Jaipur operational seed state.');
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Role & Screen Navigation Bar */}
      <TopHeaderNav
        currentView={currentView}
        onToggleView={setCurrentView}
        onSimulateReport={handleSimulateReport}
        onResetData={handleResetData}
      />

      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-emerald-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          {toastMessage}
        </div>
      )}

      {/* Screen Views */}
      {currentView === 'citizen' ? (
        <CitizenView
          incidents={incidents}
          hotspots={hotspots}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenTrackModal={(incidentId) => {
            setSelectedIncidentForTrack(incidentId || null);
            setIsTrackModalOpen(true);
          }}
          onSelectIncident={(inc) => {
            setSelectedIncident(inc);
            setSelectedIncidentForTrack(inc.id);
            setIsTrackModalOpen(true);
          }}
          onUpvoteIncident={handleUpvoteIncident}
        />
      ) : (
        <AdminDashboard
          incidents={incidents}
          wards={wards}
          crews={crews}
          activities={activities}
          onOpenAssignModal={(inc) => {
            setSelectedIncident(inc);
            setIsAssignModalOpen(true);
          }}
          onOpenResolveModal={(inc) => {
            setSelectedIncident(inc);
            setIsResolveModalOpen(true);
          }}
          onSelectIncident={(inc) => {
            setSelectedIncident(inc);
            setSelectedIncidentForTrack(inc.id);
            setIsTrackModalOpen(true);
          }}
          onSwitchToCitizen={() => setCurrentView('citizen')}
        />
      )}

      {/* Citizen Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleAddIncident}
      />

      {/* Track Complaint Modal */}
      <TrackIncidentModal
        isOpen={isTrackModalOpen}
        onClose={() => {
          setIsTrackModalOpen(false);
          setSelectedIncidentForTrack(null);
        }}
        incidents={incidents}
        selectedIncidentId={selectedIncidentForTrack}
        onUpvoteIncident={handleUpvoteIncident}
      />

      {/* Admin Assign Crew Modal */}
      <AssignCrewModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedIncident(null);
        }}
        incident={selectedIncident}
        crews={crews}
        onAssign={handleAssignCrew}
      />

      {/* Admin Resolve Incident Modal */}
      <ResolveIncidentModal
        isOpen={isResolveModalOpen}
        onClose={() => {
          setIsResolveModalOpen(false);
          setSelectedIncident(null);
        }}
        incident={selectedIncident}
        onResolve={handleResolveIncident}
      />
    </div>
  );
}
