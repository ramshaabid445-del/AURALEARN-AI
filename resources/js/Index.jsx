import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function SettingsIndex() {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        ai_sensitivity: 50, // Example setting
        profile_name: 'Test User', // Example profile field
        profile_email: 'test@example.com', // Example profile field
    });

    const updateAISensitivity = (e) => {
        e.preventDefault();
        // In a real app, this would send a patch request to a settings endpoint
        console.log('Updating AI Sensitivity:', data.ai_sensitivity);
        // patch(route('settings.update'), {
        //     onSuccess: () => { /* handle success */ },
        // });
    };

    const updateProfileInformation = (e) => {
        e.preventDefault();
        // This would typically use the existing profile update route
        console.log('Updating Profile:', data.profile_name, data.profile_email);
        // patch(route('profile.update'), {
        //     onSuccess: () => { /* handle success */ },
        // });
    };

    return (
        <Layout>
            <Head title="Settings" />
            <div className="p-8 font-['Figtree']">
                <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-sm p-6 h-full mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Settings</h1>
                    <p className="text-slate-500 mt-1 mb-4">Manage application settings and your profile.</p>

                    <form onSubmit={updateAISensitivity} className="mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-3">AI Sensitivity</h2>
                        <InputLabel htmlFor="ai_sensitivity" value="Adjust AI Model Sensitivity" />
                        <input type="range" id="ai_sensitivity" min="0" max="100" value={data.ai_sensitivity} onChange={(e) => setData('ai_sensitivity', e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600" />
                        <span className="text-sm text-slate-500 mt-1 block">Current Sensitivity: {data.ai_sensitivity}%</span>
                        <PrimaryButton className="mt-4" disabled={processing}>Save AI Settings</PrimaryButton>
                    </form>

                    <form onSubmit={updateProfileInformation}>
                        <h2 className="text-xl font-bold text-slate-800 mb-3">Profile Information</h2>
                        <InputLabel htmlFor="profile_name" value="Name" />
                        <TextInput id="profile_name" type="text" className="mt-1 block w-full" value={data.profile_name} onChange={(e) => setData('profile_name', e.target.value)} required />
                        <InputError message={errors.profile_name} className="mt-2" />
                        <InputLabel htmlFor="profile_email" value="Email" className="mt-4" />
                        <TextInput id="profile_email" type="email" className="mt-1 block w-full" value={data.profile_email} onChange={(e) => setData('profile_email', e.target.value)} required />
                        <InputError message={errors.profile_email} className="mt-2" />
                        <PrimaryButton className="mt-4" disabled={processing}>Update Profile</PrimaryButton>
                    </form>
                </div>
            </div>
        </Layout>
    );
}