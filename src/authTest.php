<?php
// This file is for testing auth.php over the network via a JavaScript fetch

require('auth.php');
require('loggable.php');

define('PROJECT_ROOT', getenv('PROJECT_ROOT'));

$log = new loggable(PROJECT_ROOT . '/logs/api.log');

$log->logRun("Let's try this again");

// Assuming the JWT is sent in the Authorization header as "Bearer [JWT]"
$authorizationHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

// Extract the token part
$tokenParts = explode(' ', $authorizationHeader);

if (count($tokenParts) === 2 && $tokenParts[0] === 'Bearer') {
    $jwtToken = $tokenParts[1];

    // Now $jwtToken contains your JWT, and you can use it as needed
    $log->logRun("JWT token: $jwtToken");
    $verificationResult = verifyGoogleToken($jwtToken);
    $log->logRun("verificationResult: $verificationResult");
} else {
    // Handle invalid or missing Authorization header
    $log->logRun('Invalid or missing Authorization header');
}
?>