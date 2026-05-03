<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FacultyController extends Controller
{
    public function index(): Response
    {
        $faculty = Faculty::orderByDesc('created_at')->get()->map(fn (Faculty $member) => [
            'id' => $member->id,
            'name' => $member->name,
            'email' => $member->email,
            'subject' => $member->subject,
            'workload' => $member->workload,
            'assigned' => $member->assigned,
            'status' => $member->status,
        ]);

        return Inertia::render('Admin/FacultyManagement', [
            'faculty' => $faculty,
            'userName' => Auth::user()?->name ?? 'Admin',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:faculties,email'],
            'subject' => ['required', 'string', 'max:255'],
            'workload' => ['required', 'integer', 'between:0,100'],
        ]);

        Faculty::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'workload' => $validated['workload'],
            'assigned' => rand(4, 18),
            'status' => $validated['workload'] > 78 ? 'At Capacity' : 'Available',
        ]);

        return redirect()->route('admin.faculty.index')->with('success', 'Faculty profile added.');
    }

    public function update(Request $request, Faculty $faculty): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:faculties,email,' . $faculty->id],
            'subject' => ['required', 'string', 'max:255'],
            'workload' => ['required', 'integer', 'between:0,100'],
        ]);

        $faculty->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'workload' => $validated['workload'],
            'status' => $validated['workload'] > 78 ? 'At Capacity' : 'Available',
        ]);

        return redirect()->route('admin.faculty.index')->with('success', 'Faculty workload updated.');
    }

    public function destroy(Faculty $faculty): RedirectResponse
    {
        $faculty->delete();

        return redirect()->route('admin.faculty.index')->with('success', 'Faculty record deleted.');
    }
}
