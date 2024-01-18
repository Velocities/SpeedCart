<?php

define('PROJECT_ROOT', getenv('PROJECT_ROOT'));

require(PROJECT_ROOT . '/vendor/autoload.php');
require(PROJECT_ROOT . '/src/loggable.php');

$log = new loggable(PROJECT_ROOT . '/logs/authentication.log');

use Firebase\JWT\JWT;
use Google\Client as Google_Client;

// Replace with the Google ID token you want to verify
$authorizationHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
list($bearer, $id_token) = explode(' ', $authorizationHeader, 2);

$log->logRun("id_token = " . print_r($id_token, true));

// Decode the token
$decodedToken = json_decode($id_token);

$log->logRun("decodedToken = " . print_r($decodedToken, true));

// Access the credential field directly from the decodedToken
$credential = $decodedToken->credential; // Has to be accessed this way since its type should be stdClass Object rather than map

// Replace with your Google API credentials
$client_id = '345095409372-ebua99dg2ok8dgt5bfpkacf4nclqhj08.apps.googleusercontent.com';

// Initialize the Google API client
$google_client = new Google_Client(['client_id' => $client_id]);

try {
    // Decode the ID token
    $payload = $google_client->verifyIdToken($credential);
    // Verify the audience (client ID)
    if ($payload['aud'] !== $client_id) {
        throw new Exception('Invalid audience, should be: ' . $payload);
    }

    // Verify the issuer
    if ($payload['iss'] !== 'accounts.google.com' && $payload['iss'] !== 'https://accounts.google.com') {
        throw new Exception('Invalid issuer');
    }

    // You can now use the verified data from the payload
    $user_id = $payload['sub'];
    $email = $payload['email'];

    // Print user information
    $log->logRun('User ID: ' . $user_id);
    $log->logRun('Email: ' . $email);
    
    // Additional checks or actions can be performed here
    
    // The ID token is valid
    $log->logRun('ID token is valid');

} catch (Exception $e) {
    // Handle verification failure
    $log->logRun('ID token verification failed: ' . $e->getMessage());
}
?>
