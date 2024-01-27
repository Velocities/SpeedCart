<?php

define('PROJECT_ROOT', getenv('PROJECT_ROOT'));

require_once(PROJECT_ROOT . '/vendor/autoload.php');
require_once(PROJECT_ROOT . '/src/loggable.php');
require_once(PROJECT_ROOT . '/src/database.php');

header('Content-Type: application/json');

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
    // Verifies the id token, Google documentation says:
    // The verifyIdToken function verifies the JWT signature, the aud claim, the exp claim, and the iss claim.
    $payload = $google_client->verifyIdToken($credential);
    // Fetch user information from the payload
    $googleId = $payload['sub'];
    $username = $payload['name'];  // Assuming 'name' field contains the username, adjust as needed

    // Check if the user exists in the database
    $db = new Database('speedcart', PROJECT_ROOT . "/logs/authentication.log");
    $query = "SELECT * FROM users WHERE user_id = '$googleId'";
    $userDbQryResult = $db->query($query);
    if (!$userDbQryResult->fetch(PDO::FETCH_ASSOC)) {
        // User does not exist; put them into database
        $log->logRun("username obtained from payload: $username");
        $log->logRun("googleId obtained from payload: $googleId");
        $params = array(
            ':googleId' => $googleId,
            ':username' => $username
        );
        $insertQuery = "INSERT INTO users (user_id, username) VALUES (:googleId, :username)";
        $db->query($insertQuery, $params);
    } else {
        $log->logRun("Google user already in database");
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

    http_response_code(200);
    echo json_encode(array("status" => "success", "message" => "Authentication successful"));


} catch (Firebase\JWT\ExpiredException $e) {
    // Handle expired token
    $log->logRun('ID token has expired: ' . $e->getMessage());
    
    // Authentication failed
    http_response_code(401);
    echo json_encode(array("status" => "error", "message" => "Unauthorized: Token has expired"));

} catch (Firebase\JWT\InvalidToken $e) {
    // Handle other token validation failures
    $log->logRun('ID token validation failed: ' . $e->getMessage());
    
    // Authentication failed
    http_response_code(401);
    echo json_encode(array("status" => "error", "message" => "Unauthorized: Invalid token"));

}
?>
