import { Head, router, useForm } from '@inertiajs/react';
import {
    Eye,
    TriangleAlert,
    TrendingUp,
    UserRound,
} from 'lucide-react';
import { useMemo } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

const bucketColors = {
    Low: '#ef4444',
    Medium: '#f59e0b',
    High: '#16a34a',
    Excellent: '#2563eb',
};

function MiniMetric({ title, value, caption, icon: Icon, tone = 'blue' }) {
    const tones = {
        blue: 'bg-blue-50 text-blue-600',
        red: 'bg-red-50 text-red-600',
        green: 'bg-emerald-50 text-emerald-600',
    };

    return (
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(45,70,92,0.06)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-black text-slate-500">{title}</p>
                    <p className="mt-2 text-[26px] font-black leading-none tracking-[-0.04em] text-slate-950">{value}</p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <p className="mt-3 text-[11px] font-bold leading-4 text-slate-400">{caption}</p>
        </article>
    );
}

function MainProgressCard({ totalStudents, riskCount }) {
    const safeRate = totalStudents > 0 ? Math.round(((totalStudents - riskCount) / totalStudents) * 100) : 0;
    const riskRate = totalStudents > 0 ? Math.round((riskCount / totalStudents) * 100) : 0;

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(45,70,92,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Platform Health</p>
                    <div className="mt-2 flex items-end gap-2">
                        <p className="text-[34px] font-black leading-none tracking-[-0.05em] text-slate-950">{totalStudents}</p>
                        <p className="pb-1 text-sm font-extrabold text-slate-600">learners on the platform</p>
                    </div>
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700">
                    {safeRate}% stable · {riskRate}% risk
                </div>
            </div>

            <div className="mt-5">
                <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all"
                        style={{ width: `${Math.max(safeRate, 4)}%` }}
                    />
                    <div
                        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-[5px] border-white bg-blue-600 shadow transition-all"
                        style={{ left: `calc(${Math.max(Math.min(safeRate, 96), 4)}% - 10px)` }}
                    />
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-black uppercase text-slate-400">
                    <span>Risk watch</span>
                    <span>Intervention goal</span>
                </div>
            </div>
        </section>
    );
}

function BucketChart({ gradeDistribution }) {
    const buckets = Object.entries(gradeDistribution).map(([name, count]) => ({ name, count }));
    const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
    const max = Math.max(...buckets.map((bucket) => bucket.count), 1);

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(45,70,92,0.06)]">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-black text-slate-500">Performance buckets</p>
                    <h2 className="mt-1 text-base font-black tracking-[-0.02em] text-slate-950">Grade Distribution</h2>
                </div>
                <p className="text-[11px] font-black text-slate-400">{total} records</p>
            </div>

            <div className="mt-5 space-y-4">
                {buckets.map((bucket) => {
                    const percent = total > 0 ? Math.round((bucket.count / total) * 100) : 0;
                    const width = bucket.count > 0 ? Math.max(Math.round((bucket.count / max) * 100), 8) : 0;
                    const color = bucketColors[bucket.name] || '#2563eb';

                    return (
                        <div key={bucket.name}>
                            <div className="mb-2 flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="font-black text-slate-700">{bucket.name}</span>
                                    <span className="font-bold text-slate-400">{bucket.count} learners</span>
                                </div>
                                <span className="font-black text-slate-700">{percent}%</span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, backgroundColor: color }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function LearnerTrends({ gradeDistribution }) {
    const buckets = Object.entries(gradeDistribution).map(([name, count]) => ({ name, count }));
    const total = Math.max(buckets.reduce((sum, item) => sum + item.count, 0), 1);

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(45,70,92,0.06)]">
            <p className="text-[11px] font-black text-slate-500">Learner trends</p>
            <h2 className="mt-1 text-base font-black tracking-[-0.02em] text-slate-950">Performance Rings</h2>

            <div className="mt-5 flex items-center justify-center">
                <div className="relative h-44 w-44">
                    {buckets.map((bucket, index) => {
                        const percent = Math.round((bucket.count / total) * 100);
                        const size = 176 - index * 24;
                        const inset = index * 12;
                        const color = bucketColors[bucket.name] || '#2563eb';

                        return (
                            <div
                                key={bucket.name}
                                className="absolute rounded-full"
                                style={{
                                    width: size,
                                    height: size,
                                    inset,
                                    background: `conic-gradient(${color} ${percent * 3.6}deg, #eef2f7 0deg)`,
                                }}
                            >
                                <div className="absolute inset-[8px] rounded-full bg-white" />
                            </div>
                        );
                    })}
                    <div className="absolute inset-[58px] flex flex-col items-center justify-center rounded-full bg-white shadow-sm">
                        <span className="text-xl font-black text-slate-950">{total}</span>
                        <span className="text-[10px] font-bold text-slate-400">total</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function RiskTable({ riskStudents, search }) {
    const filteredStudents = useMemo(() => {
        const needle = search.trim().toLowerCase();

        if (!needle) {
            return riskStudents;
        }

        return riskStudents.filter((student) => {
            return [student.name, student.email, String(student.id), String(student.predicted_grade)]
                .join(' ')
                .toLowerCase()
                .includes(needle);
        });
    }, [riskStudents, search]);

    const viewStudent = (student) => {
        console.log('View student profile:', student.id);

        router.visit(`/admin/students/${student.id}`, {
            preserveScroll: true,
            onError: () => console.log('Student detail placeholder route:', student.id),
        });
    };

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(45,70,92,0.06)]">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-black text-slate-500">Top risk learners</p>
                    <h2 className="mt-1 text-base font-black tracking-[-0.02em] text-slate-950">Students Requiring Intervention</h2>
                </div>
                <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-black text-red-600">
                    {filteredStudents.length} shown
                </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400">Learner</th>
                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-slate-400">Email</th>
                            <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-slate-400">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-4 py-8 text-center text-xs font-bold text-slate-400">
                                    No matching intervention alerts.
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student.id} className="bg-white">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-700">
                                                {student.name
                                                    .split(' ')
                                                    .map((part) => part[0])
                                                    .join('')
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-950">{student.name}</p>
                                                <p className="text-[10px] font-bold text-red-500">{student.predicted_grade}% predicted grade</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs font-semibold text-slate-500">{student.email}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => viewStudent(student)}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700 transition hover:bg-blue-600 hover:text-white"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default function AdminDashboard({
    totalStudents = 0,
    riskStudents = [],
    gradeDistribution = {},
    userName,
}) {
    const { data, setData } = useForm({
        search: '',
    });

    const riskCount = riskStudents.length;
    const completionRate = totalStudents > 0 ? Math.round(((totalStudents - riskCount) / totalStudents) * 100) : 0;

    return (
        <AuthenticatedLayout
            title="Dashboard"
            userName={userName}
            searchValue={data.search}
            onSearchChange={(value) => setData('search', value)}
        >
            <Head title="Admin Dashboard" />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-4">
                    <MainProgressCard totalStudents={totalStudents} riskCount={riskCount} />

                    <div className="grid gap-4 md:grid-cols-3">
                        <MiniMetric
                            title="Active learners"
                            value={totalStudents}
                            caption="Synced from student records"
                            icon={UserRound}
                            tone="blue"
                        />
                        <MiniMetric
                            title="Risk queue"
                            value={riskCount}
                            caption="+1 from last review cycle"
                            icon={TriangleAlert}
                            tone="red"
                        />
                        <MiniMetric
                            title="Completion rate"
                            value={`${completionRate}%`}
                            caption="Students outside risk band"
                            icon={TrendingUp}
                            tone="green"
                        />
                    </div>

                    <RiskTable riskStudents={riskStudents} search={data.search} />
                </div>

                <div className="space-y-4">
                    <BucketChart gradeDistribution={gradeDistribution} />
                    <LearnerTrends gradeDistribution={gradeDistribution} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
