<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cookie;
// Necessary for debugging cookie
use Illuminate\Support\Facades\Log;


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
        $cookie = Cookie::make(
            'speedcart_auth',
            $credential,
            20, // Minutes cookie will be valid
            '/', // Path setting
            null, // Domain setting
            true, // Secure setting
            true, // HttpOnly setting
            false, // raw setting
            'None' // SameSite setting
        );

        // Log detailed cookie information
        Log::debug('Made cookie:', [
            'name' => $cookie->getName(),
            'value' => $cookie->getValue(),
            'expire' => $cookie->getExpiresTime(),
            'path' => $cookie->getPath(),
            'domain' => $cookie->getDomain(),
            'secure' => $cookie->isSecure(),
            'httpOnly' => $cookie->isHttpOnly(),
            'samesite' => $cookie->getSameSite()
        ]);

        // Send cookie back to user
        return response('Cookie has been set')->cookie($cookie);
    }

    public function removeCookie(Request $request) {
        // Set an empty value and a negative expiration time
        $cookie = Cookie::make(
            'speedcart_auth',
            '',
            0, // This (and the above empty string) will help delete the cookie
            '/', // Path setting
            null, // Domain setting
            true, // Secure setting
            true, // HttpOnly setting
            false, // raw setting
            'None' // SameSite setting
        );
        return response()->json(['status' => 'Successfully logged out'])
                        ->withCookie($cookie);
    }
}
