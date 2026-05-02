import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function StudentProfile({ studentId }) {
    return (
        <AuthenticatedLayout title="Student Profile">
            <Head title="Student Profile" />
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(45,70,92,0.06)]">
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Placeholder profile</p>
                <h1 className="mt-2 text-xl font-black text-slate-950">Student #{studentId}</h1>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                    This route is wired for the detailed student profile view.
                </p>
                <Link
                    href="/admin/dashboard"
                    className="mt-5 inline-flex rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white"
                >
                    Back to dashboard
                </Link>
            </section>
        </AuthenticatedLayout>
    );
}
