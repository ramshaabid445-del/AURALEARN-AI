import { Head } from '@inertiajs/react';
import { AlertTriangle, GraduationCap, LineChart as LineChartIcon, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { students, trendData } from '../../Data/adminSuiteData';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function AcademicAnalytics() {
    const averageGrade = Math.round(students.reduce((sum, student) => sum + student.currentGrade, 0) / students.length);
    const averageAttendance = Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length);
    const highRisk = students.filter((student) => student.riskScore > 70);

    return (
        <AuthenticatedLayout title="Academic Analytics" searchPlaceholder="Search analytics...">
            <Head title="Academic Analytics" />
            <div className="space-y-8">
                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        ['Average Grade', `${averageGrade}%`, 'Current weighted learner performance.', GraduationCap],
                        ['Attendance Health', `${averageAttendance}%`, 'Average attendance across active students.', TrendingUp],
                        ['High Risk Signals', highRisk.length, 'Learners above 70% AI risk score.', AlertTriangle],
                    ].map(([label, value, detail, Icon]) => (
                        <article key={label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <Icon className="h-5 w-5 text-blue-600" />
                            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{label}</p>
                            <p className="mt-2 text-sm font-normal leading-6 text-slate-500">{detail}</p>
                        </article>
                    ))}
                </section>

                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Trend Analysis</p>
                            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Grade Tracking Over Semester</h2>
                        </div>
                        <LineChartIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-6 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 10, right: 12, left: -24, bottom: 0 }}>
                                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="performance" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
