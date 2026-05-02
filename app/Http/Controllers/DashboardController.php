<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Dashboard', [
            'locale' => str_starts_with($request->header('Accept-Language', app()->getLocale()), 'ur') ? 'ur' : 'en',
        ]);
    }
}
