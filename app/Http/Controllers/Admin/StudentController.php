<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentPerformance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    private function formatStudent(Student $student): array
    {
        $predicted = $student->performance?->predicted_grade ?? 0;

        return [
            'id' => $student->id,
            'name' => trim($student->first_name . ' ' . $student->last_name),
            'email' => $student->email,
            'attendance' => $student->performance?->attendance ?? 0,
            'gpa' => round(($predicted / 25) + 1.5, 1),
            'risk' => $this->riskLabel($predicted),
            'riskScore' => (int) round($predicted),
            'predicted_grade' => (int) round($predicted),
            'gradeLevel' => $this->gradeLevel($predicted),
            'enrolled' => optional($student->enrolled_at)->format('Y-m-d') ?? $student->created_at->format('Y-m-d'),
        ];
    }

    private function gradeLevel(float $predicted): string
    {
        if ($predicted >= 90) {
            return 'Grade 12';
        }

        if ($predicted >= 75) {
            return 'Grade 11';
        }

        if ($predicted >= 60) {
            return 'Grade 10';
        }

        return 'Grade 9';
    }

    private function riskLabel(float $predicted): string
    {
        if ($predicted >= 75) {
            return 'High';
        }

        if ($predicted >= 45) {
            return 'Medium';
        }

        return 'Low';
    }

    public function index(Request $request): Response
    {
        $students = Student::with('performance')->orderByDesc('created_at')->get()->map(fn (Student $student) => $this->formatStudent($student));

        return Inertia::render('Admin/Students', [
            'students' => $students,
            'userName' => Auth::user()?->name ?? 'Admin',
            'filters' => [
                'query' => $request->query('query', ''),
                'gradeLevel' => $request->query('gradeLevel', 'All'),
                'risk' => $request->query('risk', 'All'),
                'enrolled' => $request->query('enrolled', 'All'),
            ],
            'navigation' => [
                ['name' => 'Dashboard', 'href' => route('admin.dashboard'), 'icon' => 'LayoutDashboard'],
                ['name' => 'Students', 'href' => route('admin.students.index'), 'icon' => 'Users'],
                ['name' => 'Academic Analytics', 'href' => route('admin.academic-analytics.index'), 'icon' => 'LineChart'],
                ['name' => 'AI Predictions', 'href' => route('admin.ai-predictions.index'), 'icon' => 'BrainCircuit'],
                ['name' => 'Faculty Management', 'href' => route('admin.faculty.index'), 'icon' => 'UsersRound'],
                ['name' => 'Intervention Logs', 'href' => route('admin.intervention-logs.index'), 'icon' => 'ClipboardList'],
                ['name' => 'Reports & Exports', 'href' => route('admin.reports.index'), 'icon' => 'FileDown'],
                ['name' => 'Settings', 'href' => route('admin.settings.index'), 'icon' => 'Settings'],
            ],
        ]);
    }

    public function show(Student $student): Response
    {
        return Inertia::render('Admin/StudentProfile', [
            'student' => $this->formatStudent($student),
            'userName' => Auth::user()?->name ?? 'Admin',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:students,email'],
            'gradeLevel' => ['required', 'string', 'max:255'],
        ]);

        [$firstName, $lastName] = array_pad(explode(' ', trim($validated['name']), 2), 2, '');

        $student = Student::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $validated['email'],
            'enrolled_at' => now(),
        ]);

        StudentPerformance::create([
            'student_id' => $student->id,
            'attendance' => 80 + rand(0, 20),
            'predicted_grade' => match ($validated['gradeLevel']) {
                'Grade 12' => rand(88, 98),
                'Grade 11' => rand(75, 87),
                'Grade 10' => rand(62, 74),
                default => rand(45, 61),
            },
        ]);

        return redirect()->route('admin.students.index')->with('success', 'Student successfully added.');
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:students,email,' . $student->id],
            'attendance' => ['nullable', 'numeric', 'between:0,100'],
            'predicted_grade' => ['nullable', 'numeric', 'between:0,100'],
        ]);

        [$firstName, $lastName] = array_pad(explode(' ', trim($validated['name']), 2), 2, '');

        $student->update([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $validated['email'],
        ]);

        $performance = $student->performance()->firstOrNew([]);
        $performance->fill([
            'attendance' => $validated['attendance'] ?? $performance->attendance ?? 0,
            'predicted_grade' => $validated['predicted_grade'] ?? $performance->predicted_grade ?? 0,
        ]);
        $performance->save();

        return redirect()->route('admin.students.index')->with('success', 'Student details updated.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        $student->delete();

        return redirect()->route('admin.students.index')->with('success', 'Student removed from the roster.');
    }
}
