import { Head, useForm } from '@inertiajs/react';
import { BookOpen, Plus, SlidersHorizontal, UserCheck, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { faculty as initialFaculty } from '../../Data/adminSuiteData';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

function Modal({ open, onClose, onAdd }) {
    const { data, setData, reset } = useForm({ name: '', subject: '', workload: 45 });

    if (!open) return null;

    const submit = (event) => {
        event.preventDefault();
        onAdd({ ...data, id: `FC-${Math.floor(Math.random() * 800 + 300)}`, workload: Number(data.workload), assigned: 0, status: 'Available' });
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
            <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Faculty Intake</p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Add Faculty</h2>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-900">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="mt-6 space-y-4">
                    {[
                        ['name', 'Teacher Name', 'Dr. Example'],
                        ['subject', 'Assigned Subject', 'Mathematics'],
                    ].map(([key, label, placeholder]) => (
                        <label key={key} className="block">
                            <span className="text-xs font-medium text-slate-500">{label}</span>
                            <input value={data[key]} onChange={(event) => setData(key, event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </label>
                    ))}
                    <label className="block">
                        <span className="text-xs font-medium text-slate-500">Initial Workload</span>
                        <input type="range" min="0" max="100" value={data.workload} onChange={(event) => setData('workload', event.target.value)} className="mt-3 w-full accent-blue-600" />
                        <p className="mt-1 text-xs font-medium text-slate-500">{data.workload}% workload score</p>
                    </label>
                </div>
                <button className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Create faculty record</button>
            </form>
        </div>
    );
}

export default function FacultyManagement() {
    const [faculty, setFaculty] = useState(initialFaculty);
    const [modalOpen, setModalOpen] = useState(false);
    const { data, setData } = useForm({ facultyId: initialFaculty[0]?.id ?? '', workload: initialFaculty[0]?.workload ?? 0 });

    const selectedFaculty = useMemo(() => faculty.find((member) => member.id === data.facultyId) ?? faculty[0], [faculty, data.facultyId]);

    const applyOverride = () => {
        setFaculty((current) => current.map((member) => member.id === data.facultyId ? { ...member, workload: Number(data.workload), status: Number(data.workload) > 78 ? 'At Capacity' : 'Available' } : member));
    };

    return (
        <AuthenticatedLayout title="Faculty Management" searchPlaceholder="Search faculty...">
            <Head title="Faculty Management" />
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={(record) => setFaculty((current) => [...current, record])} />

            <div className="space-y-8">
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Staff Operations</p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Teacher Assignments & Workload</h1>
                            <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-slate-500">Assign intervention ownership, monitor staff capacity, and rebalance support queues.</p>
                        </div>
                        <button onClick={() => setModalOpen(true)} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                            <Plus className="h-4 w-4" />
                            Add Faculty
                        </button>
                    </div>
                </section>

                <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_330px]">
                    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    {['Teacher Name', 'Assigned Subject', 'Workload Score', 'Status', 'Action'].map((heading) => <th key={heading} className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">{heading}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {faculty.map((member) => (
                                    <tr key={member.id} className="transition hover:bg-blue-50/40">
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                                            <p className="text-xs font-normal text-slate-500">{member.id} · {member.assigned} students</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-normal text-slate-500">{member.subject}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                                                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${member.workload}%` }} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{member.workload}%</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4"><span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-100">{member.status}</span></td>
                                        <td className="px-5 py-4"><button onClick={() => console.log('Assign faculty:', member.id)} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white">Assign</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </article>

                    <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><SlidersHorizontal className="h-5 w-5" /></div>
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">Quick Entry</h2>
                                <p className="text-xs font-normal text-slate-500">Manual workload override</p>
                            </div>
                        </div>
                        <label className="mt-5 block">
                            <span className="text-xs font-medium text-slate-500">Faculty member</span>
                            <select value={data.facultyId} onChange={(event) => { const member = faculty.find((item) => item.id === event.target.value); setData({ facultyId: event.target.value, workload: member?.workload ?? 0 }); }} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20">
                                {faculty.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
                            </select>
                        </label>
                        <label className="mt-4 block">
                            <span className="text-xs font-medium text-slate-500">Workload score</span>
                            <input type="range" min="0" max="100" value={data.workload} onChange={(event) => setData('workload', event.target.value)} className="mt-3 w-full accent-blue-600" />
                        </label>
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <p className="mt-2 text-sm font-semibold text-slate-900">{selectedFaculty?.subject}</p>
                            <p className="text-xs font-normal text-slate-500">Preview workload: {data.workload}%</p>
                        </div>
                        <button onClick={applyOverride} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                            <UserCheck className="h-4 w-4" />
                            Apply override
                        </button>
                    </aside>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
