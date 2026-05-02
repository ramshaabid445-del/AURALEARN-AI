<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WebAuthController extends Controller
{
    public function redirectToPortal(Request $request)
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        return $this->redirectByRole();
    }

    public function showLogin(Request $request)
    {
        if (Auth::check()) {
            return $this->redirectByRole();
        }

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'Invalid credentials provided.']);
        }

        $request->session()->regenerate();

        return $this->redirectByRole();
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    private function redirectByRole()
    {
        return redirect()->intended(Auth::user()->role === 'admin' ? route('admin.dashboard') : route('student.dashboard'));
    }
}
