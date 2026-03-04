'use client';

import { useState, useEffect, useCallback } from 'react';

export type Severity = 'critical' | 'warning' | 'info' | 'resolved';

export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: Severity;
    zone: string;
    timestamp: Date;
    source: string;
    isNew?: boolean;
}

export interface SensorData {
    [field: string]: { value: number; time: string };
}

let idCounter = 0;

export function useAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [sensors, setSensors] = useState<SensorData>({});
    const [sirenActive, setSirenActive] = useState(false);
    const [connected, setConnected] = useState<boolean | null>(null);
    const [lastQueried, setLastQueried] = useState<string | null>(null);

    // Poll the API route
    useEffect(() => {
        let active = true;

        async function poll() {
            try {
                const res = await fetch('/api/sensors');
                const data = await res.json();

                if (!active) return;

                if (data.error) {
                    setConnected(false);
                    return;
                }

                setConnected(true);
                setSensors(data.sensors || {});
                setLastQueried(data.queriedAt);

                // Convert API alerts into our Alert format
                if (data.alerts && data.alerts.length > 0) {
                    const newAlerts: Alert[] = data.alerts.map((a: { id: string; title: string; description: string; severity: Severity; zone: string; source: string; timestamp: string }) => ({
                        id: a.id + '-' + Date.now(),
                        title: a.title,
                        description: a.description,
                        severity: a.severity,
                        zone: a.zone,
                        source: a.source,
                        timestamp: new Date(a.timestamp || Date.now()),
                        isNew: true,
                    }));

                    setAlerts((prev) => {
                        // Deduplicate by base ID (field + severity) — only add if not already present in last cycle
                        const existingBaseIds = new Set(prev.slice(0, 20).map((a) => a.id.replace(/-\d+$/, '')));
                        const truly = newAlerts.filter((a: Alert) => !existingBaseIds.has(a.id.replace(/-\d+$/, '')));

                        if (truly.length === 0) return prev;

                        const merged = [...truly, ...prev].slice(0, 50);
                        return merged;
                    });

                    // Trigger siren for critical
                    if (newAlerts.some((a: Alert) => a.severity === 'critical')) {
                        setSirenActive(true);
                        setTimeout(() => setSirenActive(false), 3000);
                    }

                    // Clear isNew after animation
                    setTimeout(() => {
                        setAlerts((prev) => prev.map((a) => ({ ...a, isNew: false })));
                    }, 600);
                }
            } catch {
                if (active) setConnected(false);
            }
        }

        poll();
        const interval = setInterval(poll, 5000); // Poll every 5s

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, []);

    const sendAlert = useCallback((alert: Omit<Alert, 'id' | 'timestamp' | 'isNew'>) => {
        const newAlert: Alert = {
            ...alert,
            id: `user-${idCounter++}`,
            timestamp: new Date(),
            isNew: true,
        };
        setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
        if (newAlert.severity === 'critical') {
            setSirenActive(true);
            setTimeout(() => setSirenActive(false), 3000);
        }
        setTimeout(() => {
            setAlerts((prev) => prev.map((a) => (a.id === newAlert.id ? { ...a, isNew: false } : a)));
        }, 600);
    }, []);

    const resolveAlert = useCallback((id: string) => {
        setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, severity: 'resolved' as Severity } : a))
        );
    }, []);

    const stats = {
        total: alerts.length,
        critical: alerts.filter((a) => a.severity === 'critical').length,
        warning: alerts.filter((a) => a.severity === 'warning').length,
        resolved: alerts.filter((a) => a.severity === 'resolved').length,
    };

    return { alerts, sensors, sendAlert, resolveAlert, sirenActive, stats, connected, lastQueried };
}
