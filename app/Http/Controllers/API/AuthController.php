<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Authentication", description: "Authentication endpoints")]
class AuthController extends BaseController
{
    #[OA\Post(
    path: "/api/register",
    tags: ["Authentication"],
    summary: "Register a new user",
    responses: [new OA\Response(response: 201, description: "User registered successfully")]
)]
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json($this->successResponse('User registered successfully', [
            'user' => $user,
            'token' => $token,
        ]));
    }

    #[OA\Post(
    path: "/api/login",
    tags: ["Authentication"],
    summary: "Authenticate a user and return a token",
    responses: [new OA\Response(response: 200, description: "Login successful")]
)]
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json($this->errorResponse('Invalid credentials', ['email' => ['The credentials are incorrect.']]), 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json($this->successResponse('Login successful', [
            'user' => $user,
            'token' => $token,
        ]));
    }

    #[OA\Post(
    path: "/api/logout",
    tags: ["Authentication"],
    summary: "Log out the authenticated user",
    responses: [new OA\Response(response: 200, description: "Logged out successfully")]
)]
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json($this->successResponse('Logged out successfully'));
    }
}
