import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import DiscussionPanel from '../Components/DiscussionPanel';
import LanguageSwitcher from '../Components/LanguageSwitcher';

const studentId = 1;

export default function Dashboard({ locale }) {
    const [language, setLanguage] = useState(locale ?? 'en');
    const [prediction, setPrediction] = useState(null);
    const [status, setStatus] = useState({ loading: true, error: null });

    useEffect(() => {
        window.setLocale(language);
        setStatus({ loading: true, error: null });

        window.axios
            .get(`/api/students/${studentId}/predict`)
            .then((response) => {
                setPrediction(response.data.data ?? response.data);
            })
            .catch((error) => {
                const message = error?.response?.data?.message ?? 'Unable to load student prediction.';
                setStatus({ loading: false, error: message });
            })
            .finally(() => {
                setStatus((current) => ({ ...current, loading: false }));
            });
    }, [language]);

    const recommendedPath = prediction?.recommended_topics ?? [];
    const grade = prediction?.predicted_grade ?? null;
    const confidence = prediction?.confidence ?? '—';

    return (
        <>
            <Head title="Dashboard" />
            <AppLayout>
                <div className="space-y-8">
                    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
                        <section className="panel-surface p-8">
                            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Student AI Prediction</p>
                                    <h2 className="mt-4 text-4xl font-semibold text-white">Personalized student insights</h2>
                                    <p className="mt-3 max-w-2xl text-slate-400">Monitor grades and fine-tune the recommended learning path with a responsive language-aware dashboard.</p>
                                </div>
                                <LanguageSwitcher locale={language} onChange={setLanguage} />
                            </div>

                            <div className="mt-10 grid gap-6 xl:grid-cols-2">
                                <article className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8">
                                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Predicted grade</p>
                                    <div className="mt-6 flex items-end gap-5">
                                        <span className="text-6xl font-semibold text-white">{status.loading ? '...' : grade !== null ? `${grade}%` : 'N/A'}</span>
                                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">Projected</span>
                                    </div>
                                    <p className="mt-4 text-sm leading-6 text-slate-400">{status.error ?? 'This score reflects the student’s current trajectory based on performance indicators.'}</p>
                                </article>
                                <article className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8">
                                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Model confidence</p>
                                    <p className="mt-6 text-5xl font-semibold text-white">{status.loading ? '...' : `${confidence}%`}</p>
                                    <p className="mt-4 text-sm text-slate-400">Confidence is calculated from recent performance, attendance, and historical learning data.</p>
                                </article>
                            </div>

                            <div className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Recommended Path</p>
                                        <h3 className="mt-2 text-2xl font-semibold text-white">Next steps for success</h3>
                                    </div>
                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">{language === 'ur' ? 'اردو میں' : 'English'}</span>
                                </div>
                                <div className="mt-6 grid gap-4">
                                    {status.loading ? (
                                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-500">Loading recommendations...</div>
                                    ) : recommendedPath.length === 0 ? (
                                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-500">No recommended topics available yet.</div>
                                    ) : (
                                        recommendedPath.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                                                <div>
                                                    <p className="text-sm font-medium text-white">{item}</p>
                                                </div>
                                                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">Step {index + 1}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </section>

                        <DiscussionPanel />
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
