<?php
// This file is for authentication, intended for reuse across contactable files

require __DIR__.'/../vendor/autoload.php'; // Load the Composer autoloader

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

define("GOOGLE_CLIENT_ID", '345095409372-ebua99dg2ok8dgt5bfpkacf4nclqhj08.apps.googleusercontent.com');

function getGoogleJwks() {
    // Fetch Google's JWKS (JSON Web Key Set)
    $jwksUri = 'https://www.googleapis.com/oauth2/v3/certs';
    $jwks = json_decode(file_get_contents($jwksUri), true);

    return $jwks;
}

function extractKidFromToken($idToken) {
    // Decode the JWT header
    $header = JWT::jsonDecode(JWT::urlsafeB64Decode(explode('.', $idToken)[0]));

    // Ensure 'kid' is set in the header
    if (!isset($header->kid)) {
        throw new \Exception('Key ID (kid) not found in JWT header');
    }

    return $header->kid;
}

function getPublicKey($kid) {
    $jwks = getGoogleJwks();

    // Find the key from JWKS based on the key ID
    $keyInfo = array_filter($jwks['keys'], function ($key) use ($kid) {
        return $key['kid'] === $kid;
    });

    if (empty($keyInfo)) {
        throw new \Exception('Key not found in JWKS');
    }

    // Get the public key material
    $key = reset($keyInfo); // Get the first element of the array
    $publicKey = $key['n'] ?? '';

    if (empty($publicKey)) {
        throw new \Exception('Public key material not found');
    }

    $formattedKey = "-----BEGIN PUBLIC KEY-----\n" . wordwrap($publicKey, 64, "\n", true) . "\n-----END PUBLIC KEY-----";

    return $formattedKey;
}


function verifyGoogleToken($idToken) {
    $kid = extractKidFromToken($idToken);
    $publicKey = getPublicKey($kid);

    // Verify the token using the Google public key
    $decodedToken = null;
    try {
        $decodedToken = JWT::decode($idToken, $publicKey, array('RS256'));
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        // Signature verification failed
        error_log('Signature verification failed: ' . $e->getMessage());
        return null;
    } catch (\Exception $e) {
        // Other errors
        error_log('Verification error: ' . $e->getMessage());
        return null;
    }

    return $decodedToken;
}


?>
