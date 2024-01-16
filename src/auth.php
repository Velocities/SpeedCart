<?php
// This file is for authentication, intended for reuse across contactable files

require __DIR__.'/../vendor/autoload.php'; // Load the Composer autoloader

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;


define("GOOGLE_CLIENT_ID", '345095409372-ebua99dg2ok8dgt5bfpkacf4nclqhj08.apps.googleusercontent.com');

function verifyGoogleToken($idToken) {
    try {
        // The middle argument must be kept private! (it's your Google Client ID, the one on Google Cloud Console for SpeedCart)
        $decoded = JWT::decode($idToken, new Key(GOOGLE_CLIENT_ID, 'HS256'));
        return $decoded;
    } catch (\Exception $e) {
        // Token verification failed
        return null;
    }
}
?>