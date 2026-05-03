import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal'; // Assuming a Modal component exists
import TextInput from '@/Components/TextInput'; // Assuming TextInput exists
import InputLabel from '@/Components/InputLabel'; // Assuming InputLabel exists
import InputError from '@/Components/InputError'; // Assuming InputError exists
import PrimaryButton from '@/Components/PrimaryButton'; // Assuming PrimaryButton exists
import SecondaryButton from '@/Components/SecondaryButton'; // Assuming SecondaryButton exists
import SelectInput from '@/Components/SelectInput'; // Assuming a SelectInput component exists

export default function Students({ students, faculties }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        name: '',
        email: '',
        faculty_id: '',
        gpa: '',
        risk_level: 'Low',
        csv_file: null,
        intervention_type: '',
        notes: '',
    });

    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [showBulkImportModal, setShowBulkImportModal] = useState(false);
    const [showAlertStudentModal, setShowAlertStudentModal] = useState(false);
    const [selectedStudentForAlert, setSelectedStudentForAlert] = useState(null);

    const openAddStudentModal = () => {
        reset();
        setShowAddStudentModal(true);
    };

    const closeAddStudentModal = () => {
        setShowAddStudentModal(false);
    };

    const openBulkImportModal = () => {
        reset();
        setShowBulkImportModal(true);
    };

    const closeBulkImportModal = () => {
        setShowBulkImportModal(false);
    };

    const openAlertStudentModal = (student) => {
        setSelectedStudentForAlert(student);
        setData(prevData => ({ ...prevData, intervention_type: '', notes: '' }));
        setShowAlertStudentModal(true);
    };

    const closeAlertStudentModal = () => {
        setSelectedStudentForAlert(null);
        setShowAlertStudentModal(false);
    };

    const submitAddStudent = (e) => {
        e.preventDefault();
        post(route('students.store'), {
            onSuccess: () => {
                closeAddStudentModal();
                // Optionally show a success message
            },
            onError: () => {
                // Handle errors
            },
        });
    };

    const submitBulkImport = (e) => {
        e.preventDefault();
        post(route('students.bulk-import'), {
            onSuccess: () => {
                closeBulkImportModal();
                // Optionally show a success message
            },
            onError: () => {
                // Handle errors
            },
        });
    };

    const submitAlertStudent = (e) => {
        e.preventDefault();
        if (selectedStudentForAlert) {
            post(route('students.alert', selectedStudentForAlert.id), {
                onSuccess: () => {
                    closeAlertStudentModal();
                    // Optionally show a success message
                },
                onError: () => {
                    // Handle errors
                },
            });
        }
    };

    return (
        <Layout>
            <Head title="Student Registry" />
            <div className="p-8 font-['Figtree']">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Student Registry</h1>
                        <p className="text-slate-500 mt-1">Manage academic performance and risks.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={openBulkImportModal} className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Bulk Import CSV
                        </button>
                        <button onClick={openAddStudentModal} className="bg-violet-600 text-white px-5 py-2.5 rounded-2xl font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100">
                            Add Student
                        </button>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200/60">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Faculty</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">GPA</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.data.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-sm text-slate-500 font-medium">{student.student_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{student.name}</div>
                                        <div className="text-xs text-slate-400">{student.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">{student.faculty.name}</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{student.gpa}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            student.risk_level === 'High' ? 'bg-red-100 text-red-600' : 
                                            student.risk_level === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                                            'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            {student.risk_level} Risk
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={route('students.show', student.id)} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </Link>
                                            <button onClick={() => openAlertStudentModal(student)} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-red-300 hover:text-red-600 transition-all shadow-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Standard Pagination logic using Tailwind */}
                <div className="mt-6 flex justify-between items-center px-4">
                    <span className="text-sm text-slate-500 font-medium">Showing {students.from} to {students.to} of {students.total} students</span>
                    <div className="flex gap-2">
                        {students.links.map((link, i) => (
                            <Link key={i} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${link.active ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Student Modal */}
            <Modal show={showAddStudentModal} onClose={closeAddStudentModal}>
                <form onSubmit={submitAddStudent} className="p-6 font-['Figtree']">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Add New Student</h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="student_id" value="Student ID" />
                        <TextInput
                            id="student_id"
                            type="text"
                            name="student_id"
                            value={data.student_id}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('student_id', e.target.value)}
                            required
                        />
                        <InputError message={errors.student_id} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="faculty_id" value="Faculty" />
                        <SelectInput
                            id="faculty_id"
                            name="faculty_id"
                            value={data.faculty_id}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('faculty_id', e.target.value)}
                            required
                        >
                            <option value="">Select Faculty</option>
                            {faculties.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.faculty_id} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="gpa" value="GPA" />
                        <TextInput
                            id="gpa"
                            type="number"
                            name="gpa"
                            value={data.gpa}
                            className="mt-1 block w-full"
                            step="0.01"
                            min="0"
                            max="4"
                            onChange={(e) => setData('gpa', e.target.value)}
                        />
                        <InputError message={errors.gpa} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="risk_level" value="Risk Level" />
                        <SelectInput
                            id="risk_level"
                            name="risk_level"
                            value={data.risk_level}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('risk_level', e.target.value)}
                            required
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </SelectInput>
                        <InputError message={errors.risk_level} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeAddStudentModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>Add Student</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Bulk Import CSV Modal */}
            <Modal show={showBulkImportModal} onClose={closeBulkImportModal}>
                <form onSubmit={submitBulkImport} className="p-6 font-['Figtree']">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Bulk Import Students</h2>
                    <p className="text-slate-500 mb-4">Upload a CSV file with student data. The CSV should contain 'student_id', 'name', 'email', 'faculty_code', 'gpa' (optional), 'risk_level' (optional).</p>
                    <InputLabel htmlFor="csv_file" value="CSV File" />
                    <input type="file" id="csv_file" name="csv_file" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" onChange={(e) => setData('csv_file', e.target.files[0])} />
                    <InputError message={errors.csv_file} className="mt-2" />
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeBulkImportModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>Import</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Alert Student Modal */}
            <Modal show={showAlertStudentModal} onClose={closeAlertStudentModal}>
                <form onSubmit={submitAlertStudent} className="p-6 font-['Figtree']">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Alert Student: {selectedStudentForAlert?.name}</h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="intervention_type" value="Intervention Type" />
                        <TextInput
                            id="intervention_type"
                            type="text"
                            name="intervention_type"
                            value={data.intervention_type}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('intervention_type', e.target.value)}
                            required
                        />
                        <InputError message={errors.intervention_type} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="notes" value="Notes" />
                        <textarea
                            id="notes"
                            name="notes"
                            value={data.notes}
                            className="mt-1 block w-full border-slate-300 focus:border-violet-500 focus:ring-violet-500 rounded-md shadow-sm"
                            onChange={(e) => setData('notes', e.target.value)}
                            rows="4"
                        ></textarea>
                        <InputError message={errors.notes} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeAlertStudentModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>Log Intervention</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
}
