'use client';

import { Severity } from '@/hooks/useAlerts';

interface QuickAlert {
    label: string;
    icon: string;
    severity: Severity;
    title: string;
    description: string;
}

const presets: QuickAlert[] = [
    { label: 'Fire', icon: '🔥', severity: 'critical', title: 'Fire Emergency', description: 'Fire reported in the neighborhood. Evacuate the area immediately and call 911.' },
    { label: 'Flood', icon: '🌊', severity: 'critical', title: 'Flood Alert', description: 'Rising water levels detected. Move to higher ground immediately.' },
    { label: 'Break-In', icon: '🚨', severity: 'critical', title: 'Break-In Reported', description: 'Unauthorized entry reported. Lock doors and contact authorities.' },
    { label: 'Medical', icon: '🏥', severity: 'warning', title: 'Medical Emergency', description: 'Medical emergency in progress. Paramedics have been notified.' },
    { label: 'Power Out', icon: '⚡', severity: 'info', title: 'Power Outage', description: 'Power outage affecting the area. Utility company has been notified.' },
    { label: 'Lost Pet', icon: '🐾', severity: 'info', title: 'Lost Pet Alert', description: 'A pet has been reported missing. Please keep an eye out in your area.' },
];

interface QuickAlertsProps {
    onSend: (alert: { title: string; description: string; severity: Severity; zone: string; source: string }) => void;
}

export default function QuickAlerts({ onSend }: QuickAlertsProps) {
    return (
        <div
            className="rounded-xl p-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
            <h2 className="text-[11px] text-[var(--text-3)] tracking-wide uppercase mb-3">Quick Alerts</h2>
            <div className="grid grid-cols-3 gap-2">
                {presets.map((p) => (
                    <button
                        key={p.label}
                        onClick={() => onSend({ title: p.title, description: p.description, severity: p.severity, zone: 'My Area', source: 'Manual Report' })}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]"
                        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
                    >
                        <span className="text-xl">{p.icon}</span>
                        <span className="text-[10px] font-medium text-[var(--text-2)]">{p.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
