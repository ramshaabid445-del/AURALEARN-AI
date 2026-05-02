import { Head, useForm } from '@inertiajs/react';
import { CalendarCheck, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { interventionLogs as initialLogs, students } from '../../Data/adminSuiteData';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function InterventionLogs() {
    const [logs, setLogs] = useState(initialLogs);
    const [open, setOpen] = useState(false);
    const { data, setData, reset } = useForm({ student: students[0].name, type: 'Advisor Meeting', note: '' });

    const addLog = (event) => {
        event.preventDefault();
        setLogs((current) => [{ id: `LOG-${Math.floor(Math.random() * 900 + 100)}`, student: data.student, type: data.type, status: 'Open', owner: 'Admin Office', date: new Date().toISOString().slice(0, 10), note: data.note }, ...current]);
        reset();
        setOpen(false);
    };

    return (
        <AuthenticatedLayout title="Intervention Logs" searchPlaceholder="Search intervention logs...">
            <Head title="Intervention Logs" />
            <div className="space-y-8">
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Close The Loop</p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Intervention Logs</h1>
                            <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-slate-500">Track what happened after an AI alert: meetings, parent notifications, assigned plans, and resolution status.</p>
                        </div>
                        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Plus className="h-4 w-4" />Add Log</button>
                    </div>
                </section>

                <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50"><tr>{['Student', 'Intervention', 'Owner', 'Date', 'Status'].map((heading) => <th key={heading} className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">{heading}</th>)}</tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log) => (
                                <tr key={log.id} className="transition hover:bg-blue-50/40">
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{log.student}<p className="text-xs font-normal text-slate-500">{log.id}</p></td>
                                    <td className="px-5 py-4 text-sm font-normal text-slate-500">{log.type}<p className="text-xs">{log.note}</p></td>
                                    <td className="px-5 py-4 text-sm font-normal text-slate-500">{log.owner}</td>
                                    <td className="px-5 py-4 text-sm font-normal text-slate-500">{log.date}</td>
                                    <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{log.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
                    <form onSubmit={addLog} className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex items-start justify-between">
                            <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">New intervention</p><h2 className="mt-1 text-xl font-semibold text-slate-900">Add Log Entry</h2></div>
                            <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-slate-100 p-2 text-slate-500"><X className="h-4 w-4" /></button>
                        </div>
                        <div className="mt-6 space-y-4">
                            <select value={data.student} onChange={(event) => setData('student', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20">{students.map((student) => <option key={student.id}>{student.name}</option>)}</select>
                            <select value={data.type} onChange={(event) => setData('type', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20">{['Advisor Meeting', 'Parent Contact', 'Study Plan', 'Attendance Review'].map((type) => <option key={type}>{type}</option>)}</select>
                            <textarea value={data.note} onChange={(event) => setData('note', event.target.value)} placeholder="What happened after the alert?" className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"><CalendarCheck className="h-4 w-4" />Save log</button>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
