<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Necessary libraries for running handle code
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Schema; // Necessary for debugging the schema
use Google\Client as Google_Client;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


define('DEBUG_MODE', 0);
// Fetch the client ID from the environment variable
define('GOOGLE_CLIENT_ID', env('GOOGLE_CLIENT_ID'));

class GoogleAuthenticationController extends Controller
{
    /**
     * Handle an incoming request's cookie before proceeding.
     *
     * 
     */
    public function handleLogin(Request $request): Response
    {
        // START OF DEBUGGING STATEMENTS FOR CORS BUG
        // Log the Origin header
        if (DEBUG_MODE) {
            $origin = $request->header('Origin');
            Log::debug('Incoming request origin: ' . $origin);
        }
        // END OF DEBUGGING STATEMENTS FOR CORS BUG

        $authorizationHeader = $request->header('Authorization');
        if ($authorizationHeader) {
            // We are validating a new sign in attempt (check Authorization header)
            if (DEBUG_MODE) {
                Log::debug("authorizationHeader = " . print_r($authorizationHeader, true));
            }
            list($bearer, $id_token) = explode(' ', $authorizationHeader, 2);
    
            if (DEBUG_MODE) {
                Log::debug("id_token = " . print_r($id_token, true));
            }
    
            // Decode the token JSON string
            $decodedToken = json_decode($id_token, true);
            if (DEBUG_MODE) {
                Log::debug("decodedToken = " . print_r($decodedToken, true));
            }

            // Access the credential field directly from the decodedToken
            $credential = $decodedToken['credential'];
            Log::debug("About to try " . $credential . "and type " . gettype($credential) . " with verifyJwtThenSetCookie method");

            $googleId = $this->validateGoogleJwt($credential);
            if ($googleId) {
                $request->merge(['user_id' => $googleId]); // Add user_id to request

                Log::info("User validated, setting cookie in request and returning...");

                // This should work (consult official documentation for more)
                $user = User::where('user_id', $googleId)->first();
                if ($user) {
                    Log::info("Logging in user");
                    //Auth::login($user);
                    Auth::guard('web')->login($user);
                } else {
                    Log::info("CAN'T LOGIN USER; IT'S NULL");
                }

    
                // Allow original request to proceed
                return response()->json(['status' => 'success']);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized: Invalid token or error occurred (contact administrator)',
                ], 401);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Missing Authorization Bearer token',
            ], 400);
        }
        
    }
    

    public function validateGoogleJwt($jwt) {
        try {
            $google_client = new Google_Client(['client_id' => GOOGLE_CLIENT_ID]);
            $payload = $google_client->verifyIdToken($jwt);

            if ($payload) {
                $googleId = $payload['sub'];
                $username = $payload['name'];
                $email = $payload['email'];
            } else {
                throw new Exception("Google couldn't validate the JWT provided (payload returned was null)");
            }

            if (DEBUG_MODE) {
                // Log the schema of the users table
                $columns = Schema::getColumnListing('users');
                foreach ($columns as $column) {
                    $type = Schema::getColumnType('users', $column);
                    Log::info("{$column}: {$type}");
                }
            }

            if (DEBUG_MODE) {
                Log::debug('Running firstOrCreate method now...');
            }

            // Check if the user exists in the database
            $user = User::firstOrCreate(
                ['user_id' => $googleId],
                ['username' => $username]
            );

            // Create or update the user record
            $user->save();

            Log::info("firstOrCreate successful, finishing validation");

            return $googleId;
        } catch (\Exception $e) {
            Log::error('Google authentication error: ' . $e->getMessage());

            return false;
        }
    }

    public function handleLogout(Request $request): Response {
        Log::info("Logging out user...");

        Auth::guard('web')->logout();  // Logs out the user from the session
        $request->session()->invalidate();  // Invalidate the session
        $request->session()->regenerateToken();  // Regenerate CSRF token

        Log::info("Clearing session and XSRF cookies...");

        Cookie::queue(Cookie::forget('api_session'));
        Cookie::queue(Cookie::forget('XSRF-TOKEN'));

        return response()->json(['status' => 'Successfully logged out']);
    }
}
