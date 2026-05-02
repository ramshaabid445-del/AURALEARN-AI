import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    BrainCircuit,
    ChevronRight,
    ClipboardList,
    FileDown,
    LayoutDashboard,
    LineChart,
    Menu,
    Search,
    Settings,
    ShieldCheck,
    Sparkles,
    Users,
    UsersRound,
    X,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Academic Analytics', href: '/admin/academic-analytics', icon: LineChart },
    { name: 'AI Predictions', href: '/admin/ai-predictions', icon: BrainCircuit },
    { name: 'Faculty Management', href: '/admin/faculty', icon: UsersRound },
    { name: 'Intervention Logs', href: '/admin/intervention-logs', icon: ClipboardList },
    { name: 'Reports & Exports', href: '/admin/reports', icon: FileDown },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

function Brand() {
    return (
        <Link href="/admin/dashboard" className="flex items-center gap-3 px-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-blue-500/25">
                <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
                <p className="truncate text-base font-semibold tracking-tight text-slate-900">AuraLearn AI</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Admin Suite</p>
            </div>
        </Link>
    );
}

function Sidebar({ currentPath, onNavigate }) {
    return (
        <div className="flex h-full flex-col bg-white py-5">
            <Brand />

            <nav className="mt-8 flex-1 space-y-2 px-3">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = currentPath === item.href || (item.href !== '/admin/dashboard' && currentPath.startsWith(item.href));

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onNavigate}
                            preserveScroll={item.href === currentPath}
                            className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-[13px] font-medium transition ${
                                active
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            {active && <span className="absolute left-0 top-3 h-7 w-1 rounded-r-full bg-blue-600" />}
                            <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            <span className="leading-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 pt-5">
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-semibold text-slate-900">AI Guardrails</p>
                    </div>
                    <p className="mt-2 text-[11px] font-normal leading-5 text-slate-500">
                        Risk scoring, manual overrides, and intervention logs are active.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({
    children,
    title = 'Dashboard',
    userName,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Search student, report, or alert...',
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { auth } = usePage().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const displayName = userName || auth?.user?.name || 'AuraLearn Admin';
    const initials = displayName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const searchInput = (
        <div className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500/20">
            <Search className="h-4 w-4 text-slate-300" />
            <input
                type="search"
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full border-0 bg-transparent p-0 text-xs font-normal text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#dfeaf2] px-3 py-4 font-sans text-slate-900 sm:px-5">
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
                        aria-label="Close navigation"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="relative h-full w-[292px] border-r border-slate-200 bg-white shadow-2xl">
                        <button
                            type="button"
                            className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:text-slate-900"
                            aria-label="Close navigation"
                            onClick={() => setMobileOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <Sidebar currentPath={currentPath} onNavigate={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}

            <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-[1320px] overflow-hidden rounded-[22px] border border-white/80 bg-[#f7fbff] shadow-[0_18px_45px_rgba(38,72,100,0.18)]">
                <aside className="hidden w-[270px] shrink-0 border-r border-slate-200 bg-white/95 lg:block">
                    <Sidebar currentPath={currentPath} />
                </aside>

                <div className="min-w-0 flex-1">
                    <header className="flex min-h-[78px] items-center gap-3 border-b border-slate-200/80 bg-[#f7fbff] px-4 sm:gap-4 sm:px-6">
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
                            aria-label="Open navigation"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-4 w-4" />
                        </button>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">{title}</h1>
                            <div className="mt-0.5 flex items-center gap-1 text-xs font-normal text-slate-400">
                                <span>Admin</span>
                                <ChevronRight className="h-3 w-3" />
                                <span className="font-medium text-blue-600">{title}</span>
                            </div>
                        </div>

                        <div className="hidden w-full max-w-[360px] lg:block">{searchInput}</div>

                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-blue-600">
                            <Bell className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
                                {initials}
                            </div>
                            <div className="hidden leading-tight sm:block">
                                <p className="text-xs font-semibold text-slate-900">{displayName}</p>
                                <p className="text-[10px] font-normal text-slate-400">Administrator</p>
                            </div>
                        </div>
                    </header>

                    <div className="border-b border-slate-200 bg-white/60 px-4 py-3 lg:hidden">{searchInput}</div>

                    <main className="h-[calc(100vh-110px)] overflow-y-auto bg-[#f7fbff] p-4 sm:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
