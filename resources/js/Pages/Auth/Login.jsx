import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    // useForm hook handle karta hai data, errors, aur processing state ko
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Direct POST to the login endpoint to avoid route helper issues
        post('/login', {
            onFinish: () => reset('password'), // Form khatam hone par password field khali kar dega
        });
    };

    return (
        <>
            <Head title="Login" />
            
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
                <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.65)]">
                    
                    <div className="mb-8 text-center">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">AuraLearn Portal</p>
                        <h1 className="mt-4 text-3xl font-semibold text-white">Sign in to continue</h1>
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Use admin@auralearn.com or any of the seeded student accounts.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={submit}>
                        {/* Email Field */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                                placeholder="name@auralearn.com"
                                required
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-rose-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                                placeholder="Password"
                                required
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-rose-400">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={processing}
                            className={`w-full rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {processing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}