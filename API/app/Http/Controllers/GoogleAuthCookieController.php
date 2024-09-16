<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cookie;
// Necessary for debugging cookie
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class GoogleAuthCookieController extends Controller
{
    //
    public function setCookie(Request $request): Response
    {
        // Get credential that will be set as the cookie
        $authorizationHeader = $request->header('Authorization');
        list($bearer, $id_token) = explode(' ', $authorizationHeader, 2);
        $decodedToken = json_decode($id_token, true);
        $credential = $decodedToken['credential'];

        // Now set cookie value to be credential
        /*$cookie = Cookie::make(
            'speedcart_auth',
            $credential,
            20, // Minutes cookie will be valid
            '/', // Path setting
            null, // Domain setting
            true, // Secure setting
            true, // HttpOnly setting
            false, // raw setting
            'None' // SameSite setting
        );*/
        // Get google ID from earlier middleware code that merged it in
        $googleId = $request->user_id;

        Log::info("Got user_id $googleId from request, running where method via model");
        
        // Get user from database
        $user = User::where('user_id', $googleId)->first();

        // Create Sanctum token
        $sanctumResult = $user->createToken('auth_token');
        // Log the entire object
        Log::info('Token Result:' . print_r((array) $sanctumResult, true));
        $token = $sanctumResult->accessToken;


        // Set Sanctum token as cookie
        $cookie = Cookie::make(
            'speedcart_auth', 
            $token, 
            43800, // Minutes cookie will be valid (1 month)
            '/', // Path setting
            null, // Domain setting
            true, // Secure setting
            true, // HttpOnly setting
            false, // raw setting
            'None' // SameSite setting
        );
        
        // Set the token
        $user->token = $token; // or whatever token value you have
        $user->save();


        // Log detailed cookie information
        /*Log::debug('Made cookie:', [
            'name' => $cookie->getName(),
            'value' => $cookie->getValue(),
            'expire' => $cookie->getExpiresTime(),
            'path' => $cookie->getPath(),
            'domain' => $cookie->getDomain(),
            'secure' => $cookie->isSecure(),
            'httpOnly' => $cookie->isHttpOnly(),
            'samesite' => $cookie->getSameSite()
        ]);*/

        // Send cookie back to user
        return response('Cookie has been set')->cookie($cookie);
    }

    public function removeCookie(Request $request) {
        // Set an empty value and a negative expiration time
        /*$cookie = Cookie::make(
            'speedcart_auth',
            '',
            0, // This (and the above empty string) will help delete the cookie
            '/', // Path setting
            null, // Domain setting
            true, // Secure setting
            true, // HttpOnly setting
            false, // raw setting
            'None' // SameSite setting
        );*/
        Auth::logout();  // Logs out the user from the session

        $request->session()->invalidate();  // Invalidate the session
        $request->session()->regenerateToken();  // Regenerate CSRF token

        return response()->json(['status' => 'Successfully logged out']);
    }
}
