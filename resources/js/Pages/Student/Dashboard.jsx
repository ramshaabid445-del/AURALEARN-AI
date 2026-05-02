import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import DiscussionPanel from '../../Components/DiscussionPanel';

const sidebarItems = [
    { href: '/student/dashboard', label: 'Dashboard' },
];

export default function StudentDashboard({ student, userName }) {
    return (
        <>
            <Head title="Student Dashboard" />
            <AppLayout title="Student Dashboard" userName={userName} navItems={sidebarItems}>
                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.8fr]">
                    <section className="panel-surface p-8">
                        <div className="flex flex-col gap-3">
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Aura AI learning</p>
                            <h2 className="text-3xl font-semibold text-white">Personalized performance</h2>
                        </div>

                        <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8">
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Predicted grade</p>
                            <p className="mt-4 text-6xl font-semibold text-white">{student.predicted_grade !== null ? `${student.predicted_grade}%` : '—'}</p>
                            <p className="mt-3 text-sm text-slate-400">Current AI prediction for your next term, based on recent performance signals.</p>
                        </div>

                        <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recommended path</p>
                                    <h3 className="mt-2 text-2xl font-semibold text-white">Aura AI next steps</h3>
                                </div>
                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">Adaptive</span>
                            </div>

                            <div className="mt-6 space-y-4">
                                {student.recommended_path.length === 0 ? (
                                    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-500">No recommendations are available yet.</div>
                                ) : (
                                    student.recommended_path.map((recommendation, index) => (
                                        <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                                            <p className="text-base font-semibold text-white">{recommendation.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <DiscussionPanel />
                </div>
            </AppLayout>
        </>
    );
}
