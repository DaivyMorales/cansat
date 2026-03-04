'use client';

import { useState } from 'react';
import { Severity } from '@/hooks/useAlerts';

interface SendAlertProps {
    onSend: (alert: { title: string; description: string; severity: Severity; zone: string; source: string }) => void;
}

export default function SendAlert({ onSend }: SendAlertProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [severity, setSeverity] = useState<Severity>('warning');
    const [zone, setZone] = useState('Mi Zona');

    const submit = () => {
        if (!title.trim()) return;
        onSend({ title, description: desc, severity, zone, source: 'Reporte Manual' });
        setTitle('');
        setDesc('');
        setOpen(false);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)33' }}
            >
                + Enviar Alerta
            </button>
        );
    }

    return (
        <div
            className="rounded-xl p-4 animate-slide-in"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-[var(--text)]">Nueva Alerta</h2>
                <button
                    onClick={() => setOpen(false)}
                    className="text-[var(--text-3)] text-xs cursor-pointer hover:text-[var(--text-2)]"
                >
                    ✕
                </button>
            </div>

            <div className="flex flex-col gap-2.5">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título de la alerta..."
                    className="w-full px-3 py-2 rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-3)] outline-none"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
                />
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Describa la situación..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-3)] outline-none resize-none"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
                />

                <div className="flex gap-2">
                    {(['critical', 'warning', 'info'] as Severity[]).map((s) => {
                        const colors: Record<string, string> = { critical: 'var(--red)', warning: 'var(--orange)', info: 'var(--blue)' };
                        const dims: Record<string, string> = { critical: 'var(--red-dim)', warning: 'var(--orange-dim)', info: 'var(--blue-dim)' };
                        const labels: Record<string, string> = { critical: 'crítico', warning: 'advertencia', info: 'info' };
                        return (
                            <button
                                key={s}
                                onClick={() => setSeverity(s)}
                                className="flex-1 text-[10px] font-medium py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
                                style={{
                                    background: severity === s ? colors[s] + '22' : 'var(--bg-raised)',
                                    color: severity === s ? colors[s] : 'var(--text-3)',
                                    border: `1px solid ${severity === s ? colors[s] + '44' : 'var(--border)'}`,
                                }}
                            >
                                {labels[s]}
                            </button>
                        );
                    })}
                </div>

                <input
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Zona / Área"
                    className="w-full px-3 py-2 rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-3)] outline-none"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
                />

                <button
                    onClick={submit}
                    className="w-full py-2 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-[0.98]"
                    style={{ background: 'var(--red)', color: 'white' }}
                >
                    Transmitir Alerta
                </button>
            </div>
        </div>
    );
}
