import { Head } from '@inertiajs/react';
import { AlertTriangle, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { students } from '../../Data/adminSuiteData';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function AIPredictions() {
    const failureModels = students.filter((student) => student.riskScore > 70);

    return (
        <AuthenticatedLayout title="AI Predictions" searchPlaceholder="Search prediction models...">
            <Head title="AI Predictions" />
            <div className="space-y-8">
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><BrainCircuit className="h-6 w-6" /></div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Predictive Intelligence</p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Failure Models & Early Warnings</h1>
                            <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-slate-500">Students with risk scores above 70% are automatically surfaced for human review and intervention planning.</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Failure Model Alert List</h2>
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">{failureModels.length} high risk</span>
                    </div>
                    <div className="mt-5 space-y-3">
                        {failureModels.map((student) => (
                            <div key={student.id} className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-blue-50/50 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                                        <p className="text-xs font-normal text-slate-500">{student.gradeLevel} · {student.currentGrade}% grade · {student.attendance}% attendance</p>
                                    </div>
                                </div>
                                <button onClick={() => console.log('Take AI action:', student.id)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Take Action
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
