import { Head } from '@inertiajs/react';
import { Bell, BrainCircuit, Lock, Save, Shield, UserCog } from 'lucide-react';
import { useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCog },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI Sensitivity', icon: BrainCircuit },
    { id: 'access', label: 'Access Control', icon: Lock },
];

function Toggle({ enabled, onChange }) {
    return (
        <button type="button" onClick={() => onChange(!enabled)} className={`h-6 w-11 rounded-full p-1 transition ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
            <span className={`block h-4 w-4 rounded-full bg-white transition ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );
}

function SettingCard({ title, description, children }) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-500">{description}</p>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [riskThreshold, setRiskThreshold] = useState(65);
    const [toggles, setToggles] = useState({
        email: true,
        sms: false,
        weekly: true,
        strictModel: true,
        staffApproval: true,
    });

    const setToggle = (key, value) => setToggles((current) => ({ ...current, [key]: value }));

    return (
        <AuthenticatedLayout title="Settings" searchPlaceholder="Search settings...">
            <Head title="Settings" />

            <div className="space-y-4">
                <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">System Control</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Administrative Settings</h1>
                    <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                        Configure profile preferences, notification routing, AI model sensitivity, and user access policies.
                    </p>
                </section>

                <section className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="rounded-3xl border border-slate-100 bg-white p-3 shadow-sm">
                        <div className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const active = activeTab === tab.id;
                                return (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                        <Icon className="h-5 w-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <div className="space-y-3">
                        {activeTab === 'profile' && (
                            <>
                                <SettingCard title="Admin profile" description="Manage the visible administrative identity used across the portal.">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white">AA</div>
                                </SettingCard>
                                <SettingCard title="Security posture" description="Require admin confirmation before high-risk intervention exports.">
                                    <Toggle enabled={toggles.staffApproval} onChange={(value) => setToggle('staffApproval', value)} />
                                </SettingCard>
                            </>
                        )}

                        {activeTab === 'notifications' && (
                            <>
                                <SettingCard title="Email alerts" description="Send risk alerts to administrators when a student drops into the high-risk band.">
                                    <Toggle enabled={toggles.email} onChange={(value) => setToggle('email', value)} />
                                </SettingCard>
                                <SettingCard title="SMS escalation" description="Escalate unresolved high-risk alerts to student support leads.">
                                    <Toggle enabled={toggles.sms} onChange={(value) => setToggle('sms', value)} />
                                </SettingCard>
                                <SettingCard title="Weekly digest" description="Deliver a weekly executive summary of performance and model activity.">
                                    <Toggle enabled={toggles.weekly} onChange={(value) => setToggle('weekly', value)} />
                                </SettingCard>
                            </>
                        )}

                        {activeTab === 'ai' && (
                            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                        <BrainCircuit className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">AI Model Sensitivity</h3>
                                        <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                                            Alert administrators when predicted grade falls below the selected threshold.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700">Risk Threshold</span>
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{riskThreshold}%</span>
                                    </div>
                                    <input type="range" min="40" max="90" value={riskThreshold} onChange={(event) => setRiskThreshold(event.target.value)} className="mt-4 w-full accent-blue-600" />
                                </div>
                                <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Strict model review</p>
                                        <p className="text-xs font-medium text-slate-500">Require manual review for high-confidence risk flags.</p>
                                    </div>
                                    <Toggle enabled={toggles.strictModel} onChange={(value) => setToggle('strictModel', value)} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'access' && (
                            <>
                                <SettingCard title="Role-based access control" description="Limit AI prediction and exports to authorized administrators.">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </SettingCard>
                                <SettingCard title="Audit activity logging" description="Track profile views, exports, threshold changes, and alert actions.">
                                    <Toggle enabled onChange={() => console.log('Audit logging locked on')} />
                                </SettingCard>
                            </>
                        )}

                        <button onClick={() => console.log('Save settings:', { activeTab, riskThreshold, toggles })} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                            <Save className="h-4 w-4" />
                            Save changes
                        </button>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
