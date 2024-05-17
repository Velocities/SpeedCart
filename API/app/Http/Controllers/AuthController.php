<?php

// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Google\Client as Google_Client;
use App\Models\User;

class AuthController extends Controller
{
    public function authenticateWithGoogle(Request $request)
    {
        $client_id = '345095409372-ebua99dg2ok8dgt5bfpkacf4nclqhj08.apps.googleusercontent.com';
        $token = $request->bearerToken();

        $google_client = new Google_Client(['client_id' => $client_id]);

        try {
            $payload = $google_client->verifyIdToken($token);

            if ($payload) {
                $googleId = $payload['sub'];
                $username = $payload['name'];
                $email = $payload['email'];

                // Check if the user exists in the database
                $user = User::firstOrCreate(
                    ['user_id' => $googleId],
                    ['username' => $username, 'email' => $email]
                );

                // Create or update the user record
                $user->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Authentication successful',
                ], 200);
            } else {
                Log::error('Payload from verifyIdToken failed, here\'s the bearerToken: ' . $token);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized: Invalid token',
                ], 401);
            }
        } catch (\Exception $e) {
            Log::error('Google authentication error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized, exception message: ' . $e->getMessage(),
            ], 401);
        }
    }
}
