import { Link } from '@inertiajs/react';

export default function AppLayout({ children, navItems = [], title = 'Dashboard', userName = 'AuraLearn User' }) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto grid min-h-screen max-w-screen-2xl grid-cols-1 gap-8 px-4 py-6 sm:px-6 lg:px-10 xl:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="panel-surface flex flex-col gap-8 p-6">
                    <div className="space-y-4">
                        <p className="text-sm uppercase tracking-[0.32em] text-slate-500">AuraLearn AI</p>
                        <h1 className="text-3xl font-semibold text-white">Dual Portal</h1>
                        <p className="text-sm leading-6 text-slate-400">Portal links for admins and students with role-aware navigation.</p>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded-3xl border px-4 py-3 text-sm font-medium transition ${currentPath === item.href ? 'border-violet-500 bg-slate-900 text-white shadow-[0_12px_40px_rgba(124,58,237,0.25)]' : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900/95'}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-900/90 p-5 text-sm text-slate-400">
                        <p className="font-semibold text-white">Logged in as</p>
                        <p className="mt-2 leading-6">{userName}</p>
                    </div>
                </aside>

                <div className="flex min-h-screen flex-col gap-6">
                    <header className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">{title}</p>
                                <h2 className="mt-3 text-3xl font-semibold text-white">{title} overview</h2>
                            </div>
                            <div className="inline-flex items-center gap-3 text-sm text-slate-400">
                                <span className="rounded-full bg-slate-900/90 px-4 py-2 border border-slate-800">Industrial UI</span>
                                <span className="rounded-full bg-slate-900/90 px-4 py-2 border border-slate-800">Realtime insights</span>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1">{children}</main>

                    <footer className="text-center text-xs uppercase tracking-[0.3em] text-slate-600">
                        Built with Inertia, React, and AuraLearn API data.
                    </footer>
                </div>
            </div>
        </div>
    );
}
