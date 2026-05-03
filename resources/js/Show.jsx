import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import moment from 'moment';

export default function StudentShow({ student }) {
    // Prepare data for GPA trend chart
    // Placeholder for converting letter grade to numeric GPA
    // In a real application, you'd have a more robust system or store numeric GPA directly.
    student.academic_records.forEach(record => {
        switch (record.grade.toUpperCase()) {
            case 'A': record.gpa_numeric = 4.0; break;
            case 'A-': record.gpa_numeric = 3.7; break;
            case 'B+': record.gpa_numeric = 3.3; break;
            case 'B': record.gpa_numeric = 3.0; break;
            case 'B-': record.gpa_numeric = 2.7; break;
            case 'C+': record.gpa_numeric = 2.3; break;
            case 'C': record.gpa_numeric = 2.0; break;
            case 'C-': record.gpa_numeric = 1.7; break;
            case 'D': record.gpa_numeric = 1.0; break;
            case 'F': record.gpa_numeric = 0.0; break;
            default: record.gpa_numeric = null;
        }
    });

    const gpaTrendData = student.academic_records
        .filter(record => record.gpa_numeric !== null)
        .sort((a, b) => {
            const dateA = moment(`${a.year} ${a.semester}`, 'YYYY SSS');
            const dateB = moment(`${b.year} ${b.semester}`, 'YYYY SSS');
            return dateA.diff(dateB);
        })
        .map(record => ({
            semester: `${record.semester} ${record.year}`,
            GPA: record.gpa_numeric,
        }));

    return (
        <Layout>
            <Head title={`Student: ${student.name}`} />
            <div className="p-8 font-['Figtree']">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Student Profile: {student.name}</h1>
                        <p className="text-slate-500 mt-1">Detailed view of student's academic and intervention history.</p>
                    </div>
                    <Link href={route('students.index')} className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Students
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Student Details Card */}
                    <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-sm p-6 h-full">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Personal Information</h2>
                        <p className="text-slate-700 mb-2"><span className="font-semibold">Student ID:</span> {student.student_id}</p>
                        <p className="text-slate-700 mb-2"><span className="font-semibold">Email:</span> {student.email}</p>
                        <p className="text-slate-700 mb-2"><span className="font-semibold">Faculty:</span> {student.faculty.name} ({student.faculty.code})</p>
                        <p className="text-slate-700 mb-2"><span className="font-semibold">Current GPA:</span> {student.gpa}</p>
                        <p className="text-slate-700 mb-2">
                            <span className="font-semibold">Risk Level:</span>
                            <span className={`ml-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                student.risk_level === 'High' ? 'bg-red-100 text-red-600' :
                                student.risk_level === 'Medium' ? 'bg-orange-100 text-orange-600' :
                                'bg-emerald-100 text-emerald-600'
                            }`}>
                                {student.risk_level} Risk
                            </span>
                        </p>
                    </div>

                    {/* GPA Trend Chart Card */}
                    <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-sm p-6 h-full">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">GPA Trend</h2>
                        {gpaTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={gpaTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="semester" className="text-xs text-slate-500" />
                                    <YAxis domain={[0, 4]} className="text-xs text-slate-500" />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="GPA" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-slate-500">No academic records available to show GPA trend.</p>
                        )}
                    </div>
                </div>

                {/* Academic Records Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-sm overflow-hidden mb-6">
                    <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200/60">Academic Records</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200/60">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Code</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Year</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {student.academic_records.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800">{record.course_code}</td>
                                    <td className="px-6 py-4 text-slate-700">{record.grade}</td>
                                    <td className="px-6 py-4 text-slate-700">{record.semester}</td>
                                    <td className="px-6 py-4 text-slate-700">{record.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Intervention Logs Card (Timeline) */}
                <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-sm p-6 h-full">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Intervention Logs</h2>
                    {student.intervention_logs.length > 0 ? (
                        <ol className="relative border-s border-slate-200 ml-4">
                            {student.intervention_logs.sort((a, b) => new Date(b.intervention_date) - new Date(a.intervention_date)).map((log) => (
                                <li key={log.id} className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-violet-100 rounded-full -start-3 ring-8 ring-white">
                                        <svg className="w-2.5 h-2.5 text-violet-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-900">{log.intervention_type}</h3>
                                    <time className="block mb-2 text-sm font-normal leading-none text-slate-400">{moment(log.intervention_date).format('MMMM D, YYYY h:mm A')}</time>
                                    <p className="mb-4 text-base font-normal text-slate-500">{log.notes}</p>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-slate-500">No intervention logs for this student.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}