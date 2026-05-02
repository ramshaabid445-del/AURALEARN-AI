import { Head, router, useForm } from '@inertiajs/react';
import {
    BellRing,
    FileUp,
    Filter,
    Plus,
    Search,
    Send,
    ShieldAlert,
    UserRound,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

const students = [
    { id: 'ST-1001', name: 'Sara Hassan', email: 'sara.hassan@example.com', gradeLevel: 'Grade 10', attendance: 72, gpa: 2.1, risk: 'High', riskScore: 88, enrolled: '2025-09-03' },
    { id: 'ST-1002', name: 'Naveed Khan', email: 'naveed.khan@example.com', gradeLevel: 'Grade 9', attendance: 91, gpa: 3.4, risk: 'Low', riskScore: 24, enrolled: '2025-08-21' },
    { id: 'ST-1003', name: 'Ayesha Malik', email: 'ayesha.malik@example.com', gradeLevel: 'Grade 11', attendance: 84, gpa: 2.8, risk: 'Medium', riskScore: 56, enrolled: '2025-07-14' },
    { id: 'ST-1004', name: 'Bilal Ahmed', email: 'bilal.ahmed@example.com', gradeLevel: 'Grade 10', attendance: 95, gpa: 3.7, risk: 'Low', riskScore: 18, enrolled: '2025-06-02' },
    { id: 'ST-1005', name: 'Mehak Raza', email: 'mehak.raza@example.com', gradeLevel: 'Grade 12', attendance: 78, gpa: 2.4, risk: 'Medium', riskScore: 63, enrolled: '2025-04-17' },
];

const riskStyles = {
    High: 'bg-red-50 text-red-600 ring-red-100',
    Medium: 'bg-amber-50 text-amber-600 ring-amber-100',
    Low: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
};

function initials(name) {
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function AddStudentModal({ open, onClose }) {
    const { data, setData, reset } = useForm({
        name: '',
        email: '',
        gradeLevel: 'Grade 10',
    });

    if (!open) return null;

    const submit = (event) => {
        event.preventDefault();
        console.log('Add student placeholder:', data);
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
            <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Student Intake</p>
                        <h2 className="mt-1 text-xl font-semibold text-slate-900">Add New Student</h2>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-900">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    <label className="block">
                        <span className="text-xs font-medium text-slate-500">Full name</span>
                        <input
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-400"
                            placeholder="Student name"
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs font-medium text-slate-500">Email</span>
                        <input
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-400"
                            placeholder="student@example.com"
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs font-medium text-slate-500">Grade level</span>
                        <select
                            value={data.gradeLevel}
                            onChange={(event) => setData('gradeLevel', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-400"
                        >
                            {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((grade) => <option key={grade}>{grade}</option>)}
                        </select>
                    </label>
                </div>

                <button className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    Create student
                </button>
            </form>
        </div>
    );
}

export default function Students() {
    const [modalOpen, setModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        gradeLevel: 'All',
        risk: 'All',
        enrolled: 'All',
        query: '',
    });

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const matchesGrade = filters.gradeLevel === 'All' || student.gradeLevel === filters.gradeLevel;
            const matchesRisk = filters.risk === 'All' || student.risk === filters.risk;
            const matchesQuery = [student.name, student.email, student.id].join(' ').toLowerCase().includes(filters.query.toLowerCase());
            const matchesDate = filters.enrolled === 'All' || (filters.enrolled === '2025' && student.enrolled.startsWith('2025'));
            return matchesGrade && matchesRisk && matchesQuery && matchesDate;
        });
    }, [filters]);

    return (
        <AuthenticatedLayout
            title="Students"
            searchValue={filters.query}
            onSearchChange={(value) => setFilters((current) => ({ ...current, query: value }))}
            searchPlaceholder="Search student directory..."
        >
            <Head title="Students" />
            <AddStudentModal open={modalOpen} onClose={() => setModalOpen(false)} />

            <div className="space-y-4">
                <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Data Management</p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Student Directory & AI Risk Profiles</h1>
                            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                                Manage learner records, monitor AI risk scores, and trigger intervention workflows from one dense operational surface.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => console.log('Bulk import CSV placeholder')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                <FileUp className="h-4 w-4" />
                                Bulk Import CSV
                            </button>
                            <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                                <Plus className="h-4 w-4" />
                                Add New Student
                            </button>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(3,minmax(150px,0.45fr))]">
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                value={filters.query}
                                onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                                placeholder="Search by name, ID, or email..."
                                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                            />
                        </div>
                        {[
                            ['gradeLevel', 'Grade Level', ['All', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']],
                            ['risk', 'Risk Status', ['All', 'High', 'Medium', 'Low']],
                            ['enrolled', 'Enrollment Date', ['All', '2025']],
                        ].map(([key, label, options]) => (
                            <label key={key} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                                <Filter className="h-4 w-4 text-slate-400" />
                                <select
                                    value={filters[key]}
                                    onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}
                                    className="w-full border-0 bg-transparent text-xs font-semibold text-slate-600 outline-none"
                                >
                                    {options.map((option) => <option key={option}>{option}</option>)}
                                </select>
                                <span className="sr-only">{label}</span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    {['Student', 'ID', 'Attendance', 'Current GPA', 'AI Risk Score', 'Actions'].map((heading) => (
                                        <th key={heading} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="transition hover:bg-blue-50/40">
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                                                    {initials(student.name)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                                                    <p className="text-xs font-medium text-slate-500">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-500">{student.id}</td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-700">{student.attendance}%</td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-700">{student.gpa.toFixed(1)}</td>
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${riskStyles[student.risk]}`}>
                                                {student.risk} · {student.riskScore}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => router.visit(`/admin/students/${student.id}`)} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white">
                                                    View Profile
                                                </button>
                                                <button onClick={() => console.log('Send alert:', student.id)} className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white">
                                                    <Send className="h-3.5 w-3.5" />
                                                    Alert
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                        <UserRound className="h-5 w-5 text-blue-600" />
                        <p className="mt-3 text-2xl font-semibold text-slate-900">{students.length}</p>
                        <p className="text-xs font-medium text-slate-500">Managed learners</p>
                    </div>
                    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                        <ShieldAlert className="h-5 w-5 text-red-500" />
                        <p className="mt-3 text-2xl font-semibold text-slate-900">{students.filter((student) => student.risk === 'High').length}</p>
                        <p className="text-xs font-medium text-slate-500">High risk profiles</p>
                    </div>
                    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                        <BellRing className="h-5 w-5 text-amber-500" />
                        <p className="mt-3 text-2xl font-semibold text-slate-900">3</p>
                        <p className="text-xs font-medium text-slate-500">Pending advisor alerts</p>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
