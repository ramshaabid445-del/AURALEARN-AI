export const students = [
    { id: 'ST-1001', name: 'Sara Hassan', email: 'sara.hassan@example.com', gradeLevel: 'Grade 10', attendance: 72, gpa: 2.1, currentGrade: 55.4, risk: 'High', riskScore: 88, advisor: 'Dr. Amina Farooq' },
    { id: 'ST-1002', name: 'Naveed Khan', email: 'naveed.khan@example.com', gradeLevel: 'Grade 9', attendance: 91, gpa: 3.4, currentGrade: 84.2, risk: 'Low', riskScore: 24, advisor: 'Prof. Sameer Iqbal' },
    { id: 'ST-1003', name: 'Ayesha Malik', email: 'ayesha.malik@example.com', gradeLevel: 'Grade 11', attendance: 84, gpa: 2.8, currentGrade: 68.5, risk: 'Medium', riskScore: 56, advisor: 'Dr. Amina Farooq' },
    { id: 'ST-1004', name: 'Bilal Ahmed', email: 'bilal.ahmed@example.com', gradeLevel: 'Grade 10', attendance: 95, gpa: 3.7, currentGrade: 91.1, risk: 'Low', riskScore: 18, advisor: 'Ms. Hira Nadeem' },
    { id: 'ST-1005', name: 'Mehak Raza', email: 'mehak.raza@example.com', gradeLevel: 'Grade 12', attendance: 78, gpa: 2.4, currentGrade: 62.8, risk: 'Medium', riskScore: 73, advisor: 'Prof. Sameer Iqbal' },
];

export const faculty = [
    { id: 'FC-201', name: 'Dr. Amina Farooq', subject: 'Mathematics', workload: 82, assigned: 18, status: 'At Capacity' },
    { id: 'FC-202', name: 'Prof. Sameer Iqbal', subject: 'Science', workload: 64, assigned: 14, status: 'Available' },
    { id: 'FC-203', name: 'Ms. Hira Nadeem', subject: 'English', workload: 48, assigned: 9, status: 'Available' },
    { id: 'FC-204', name: 'Mr. Omar Siddiqui', subject: 'Computer Science', workload: 71, assigned: 15, status: 'Balanced' },
];

export const trendData = [
    { month: 'Aug', low: 18, medium: 33, high: 36, excellent: 13, performance: 68, risk: 31 },
    { month: 'Sep', low: 16, medium: 31, high: 38, excellent: 15, performance: 71, risk: 28 },
    { month: 'Oct', low: 14, medium: 29, high: 40, excellent: 17, performance: 74, risk: 25 },
    { month: 'Nov', low: 12, medium: 27, high: 42, excellent: 19, performance: 76, risk: 22 },
    { month: 'Dec', low: 10, medium: 25, high: 43, excellent: 22, performance: 79, risk: 19 },
    { month: 'Jan', low: 8, medium: 23, high: 45, excellent: 24, performance: 82, risk: 16 },
];

export const interventionLogs = [
    { id: 'LOG-701', student: 'Sara Hassan', type: 'Advisor Meeting', status: 'Scheduled', owner: 'Dr. Amina Farooq', date: '2026-05-03', note: 'Meeting scheduled after AI high-risk alert.' },
    { id: 'LOG-702', student: 'Sara Hassan', type: 'Parent Contact', status: 'Pending', owner: 'Admin Office', date: '2026-05-04', note: 'Parent notification prepared for attendance and grade decline.' },
    { id: 'LOG-703', student: 'Mehak Raza', type: 'Study Plan', status: 'In Progress', owner: 'Prof. Sameer Iqbal', date: '2026-05-01', note: 'Remedial module assigned for weak assessment areas.' },
];

export function calculateRiskScore(attendance, grade) {
    const attendancePenalty = Math.max(0, 100 - Number(attendance)) * 0.45;
    const gradePenalty = Math.max(0, 100 - Number(grade)) * 0.55;
    return Math.min(99, Math.round(attendancePenalty + gradePenalty));
}

export function riskLabel(score) {
    if (score >= 70) return 'High';
    if (score >= 45) return 'Medium';
    return 'Low';
}
