import { Head, useForm } from '@inertiajs/react';
import { Calendar, Download, FileSpreadsheet, FileText, TrendingUp, Trophy } from 'lucide-react';
import { students, trendData } from '../../Data/adminSuiteData';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

function SummaryCard({ label, value, detail, icon: Icon }) {
    return (
        <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <p className="mt-3 text-sm font-normal leading-6 text-slate-500">{detail}</p>
        </article>
    );
}

function PerformanceTrend() {
    const max = Math.max(...trendData.map((item) => item.performance));
    const min = Math.min(...trendData.map((item) => item.risk));
    const width = 520;
    const height = 220;
    const xStep = width / (trendData.length - 1);

    const points = (key) =>
        trendData
            .map((item, index) => {
                const value = item[key];
                const y = height - ((value - min) / (max - min)) * (height - 28) - 14;
                return `${index * xStep},${y}`;
            })
            .join(' ');

    return (
        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Semester Trend</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">Performance Trends Over Semester</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">Live model</span>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl bg-slate-50 p-4">
                <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
                    {[0, 1, 2, 3].map((line) => (
                        <line
                            key={line}
                            x1="0"
                            x2={width}
                            y1={line * 54 + 18}
                            y2={line * 54 + 18}
                            stroke="#e2e8f0"
                            strokeDasharray="5 5"
                        />
                    ))}
                    <polyline points={points('performance')} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points={points('risk')} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {trendData.map((item, index) => {
                        const x = index * xStep;
                        const performanceY = height - ((item.performance - min) / (max - min)) * (height - 28) - 14;
                        return <circle key={item.month} cx={x} cy={performanceY} r="5" fill="#2563eb" stroke="#fff" strokeWidth="3" />;
                    })}
                </svg>
                <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
                    {trendData.map((item) => <span key={item.month}>{item.month}</span>)}
                </div>
            </div>

            <div className="mt-4 flex gap-4 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-600" />Performance</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" />Risk</span>
            </div>
        </article>
    );
}

export default function Reports() {
    const { data, setData } = useForm({ range: 'semester', format: 'PDF', includeRisk: true });
    const average = Math.round(students.reduce((sum, student) => sum + student.currentGrade, 0) / students.length);
    const topStudents = students.filter((student) => student.currentGrade >= 80).length;

    return (
        <AuthenticatedLayout title="Reports & Exports" searchPlaceholder="Search reports...">
            <Head title="Reports & Exports" />
            <div className="space-y-8">
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Business Intelligence</p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Reports & Export Center</h1>
                            <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-slate-500">
                                Generate leadership-ready PDF, CSV, and Excel outputs from live academic and AI risk data.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => console.log('Generate export:', data)}
                            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Generate Export
                        </button>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <SummaryCard label="Average Class Performance" value={`${average}%`} detail="+6% improvement across the active semester." icon={TrendingUp} />
                    <SummaryCard label="Risk Mitigation Rate" value="64%" detail="Students moved out of high-risk status after intervention." icon={FileText} />
                    <SummaryCard label="Top Performing Students" value={topStudents} detail="Learners sustaining high or excellent performance." icon={Trophy} />
                </section>

                <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_330px]">
                    <PerformanceTrend />

                    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Export Center</p>
                        <h2 className="mt-1 text-lg font-semibold text-slate-900">Generate Report</h2>
                        <div className="mt-5 space-y-4">
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Date range</span>
                                <select
                                    value={data.range}
                                    onChange={(event) => setData('range', event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-normal text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="semester">Current semester</option>
                                    <option value="30">Last 30 days</option>
                                    <option value="90">Last 90 days</option>
                                </select>
                            </label>
                            <div>
                                <span className="text-xs font-medium text-slate-500">Format</span>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {['PDF', 'CSV', 'Excel'].map((format) => (
                                        <button
                                            type="button"
                                            key={format}
                                            onClick={() => setData('format', format)}
                                            className={`rounded-2xl border px-3 py-3 text-xs font-medium ${data.format === format ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500'}`}
                                        >
                                            {format}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => console.log('Download export:', data)}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                Download {data.format}
                            </button>
                        </div>
                        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-normal leading-6 text-slate-500">
                            <Calendar className="mb-2 h-5 w-5 text-blue-600" />
                            Exports include the current AI risk summary and intervention status.
                        </div>
                    </article>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
