import { useEffect, useState } from 'react';

export default function DiscussionPanel() {
    const [discussions, setDiscussions] = useState([]);
    const [form, setForm] = useState({ title: '', body: '' });
    const [status, setStatus] = useState({ loading: true, saving: false, error: null });

    const loadDiscussions = () => {
        setStatus({ loading: true, saving: false, error: null });

        window.axios
            .get('/api/discussions')
            .then((response) => {
                setDiscussions(response.data.data ?? response.data ?? []);
            })
            .catch(() => {
                setStatus((prev) => ({ ...prev, error: 'Unable to load discussions.' }));
            })
            .finally(() => setStatus((prev) => ({ ...prev, loading: false, saving: false })));
    };

    useEffect(() => {
        loadDiscussions();
    }, []);

    const submitDiscussion = async (event) => {
        event.preventDefault();
        if (!form.title.trim()) {
            setStatus((prev) => ({ ...prev, error: 'Title is required.' }));
            return;
        }

        setStatus({ loading: false, saving: true, error: null });

        try {
            const response = await window.axios.post('/api/discussions', {
                title: form.title,
                body: form.body,
            });

            setDiscussions((prev) => [response.data.data ?? response.data, ...prev]);
            setForm({ title: '', body: '' });
        } catch (error) {
            setStatus((prev) => ({ ...prev, error: 'Unable to create discussion.' }));
        } finally {
            setStatus((prev) => ({ ...prev, saving: false }));
        }
    };

    return (
        <aside className="panel-surface p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Discussion</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Recent conversations</h2>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">API connected</span>
            </div>

            <form className="space-y-4" onSubmit={submitDiscussion}>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Topic</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                        placeholder="Start a new discussion"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Details</label>
                    <textarea
                        rows="4"
                        value={form.body}
                        onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                        placeholder="Add optional context for your discussion."
                    />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                        disabled={status.saving}
                    >
                        {status.saving ? 'Posting...' : 'Post discussion'}
                    </button>
                    <span className="text-sm text-slate-500">{discussions.length} conversations</span>
                </div>
                {status.error ? <p className="text-sm text-rose-400">{status.error}</p> : null}
            </form>

            <div className="mt-8 space-y-4">
                {status.loading ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-slate-500">Loading discussions...</div>
                ) : discussions.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-slate-500">No discussions available yet.</div>
                ) : (
                    discussions.map((discussion) => (
                        <article key={discussion.id ?? discussion.title} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-base font-semibold text-white">{discussion.title}</h3>
                                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Active</span>
                            </div>
                            {discussion.body ? <p className="mt-3 text-sm leading-6 text-slate-400">{discussion.body}</p> : null}
                        </article>
                    ))
                )}
            </div>
        </aside>
    );
}
