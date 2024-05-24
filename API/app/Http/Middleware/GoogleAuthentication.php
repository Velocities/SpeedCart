<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Necessary libraries for running handle code
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema; // Necessary for debugging the schema
use Google\Client as Google_Client;
use App\Models\User;

define('DEBUG_MODE', 0);
// Fetch the client ID from the environment variable
define('GOOGLE_CLIENT_ID', env('GOOGLE_CLIENT_ID'));

class GoogleAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // START OF DEBUGGING STATEMENTS FOR CORS BUG
        // Log the Origin header
        if (DEBUG_MODE) {
            $origin = $request->header('Origin');
            Log::info('Incoming request origin: ' . $origin);
        }
        // END OF DEBUGGING STATEMENTS FOR CORS BUG

        $authorizationHeader = $request->header('Authorization');
        Log::error("authorizationHeader = " . print_r($authorizationHeader, true));
        list($bearer, $id_token) = explode(' ', $authorizationHeader, 2);

        Log::error("id_token = " . print_r($id_token, true));

        // Decode the token JSON string
        $decodedToken = json_decode($id_token, true);
        Log::error("decodedToken = " . print_r($decodedToken, true));

        //Log::error('gettype(token) == ' . gettype($token));

        /*if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid token format',
            ], 400);
        }*/

        // Access the credential field directly from the decodedToken
        $credential = $decodedToken['credential'];

        $google_client = new Google_Client(['client_id' => GOOGLE_CLIENT_ID]);

        try {
            $payload = $google_client->verifyIdToken($credential);

            if ($payload) {
                $googleId = $payload['sub'];
                $username = $payload['name'];
                $email = $payload['email'];

                // Log the schema of the users table
                $columns = Schema::getColumnListing('users');
                foreach ($columns as $column) {
                    $type = Schema::getColumnType('users', $column);
                    Log::info("{$column}: {$type}");
                }

                Log::error('Running firstOrCreate method now...');

                // Check if the user exists in the database
                $user = User::firstOrCreate(
                    ['user_id' => $googleId],
                    ['username' => $username]
                );

                $request->merge(['user_id' => $googleId]); // Add user_id to request

                // Log the request data after merging user_id
                Log::info('Request data after merging user_id: ' . print_r($request->all(), true));

                Log::error('Running user->save method now...');

                // Create or update the user record
                $user->save();

                /*return response()->json([
                    'status' => 'success',
                    'message' => 'Authentication successful',
                ], 200);*/
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized: Invalid token',
                ], 401);
            }
        } catch (\Exception $e) {
            Log::error('Google authentication error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Exception message: ' . $e->getMessage(),
            ], 401);
        }

        // Allow original request to proceed
        return $next($request);
    }
}
