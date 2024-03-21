<?php

$allowed_origins = ['http://localhost:3000', 'https://www.speedcartapp.com'];
// Check if the request origin is allowed
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

// Set CORS headers for preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 3600"); // Cache preflight response for 1 hour
    exit(0); // End the script immediately without further processing
}
define('PROJECT_ROOT', getenv('PROJECT_ROOT'));

require_once(PROJECT_ROOT . '/vendor/autoload.php');
require_once(PROJECT_ROOT . '/src/loggable.php');
require_once(PROJECT_ROOT . '/src/database.php');

header('Content-Type: application/json');

$log = new loggable('authentication.log');

use Firebase\JWT\JWT;
use Google\Client as Google_Client;

// Replace with the Google ID token you want to verify
$authorizationHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$log->logRun("allowed_origins = " . print_r($allowed_origins, true));
$log->logRun("authorizationHeader = " . print_r($authorizationHeader, true));
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
    $query = "SELECT * FROM users WHERE user_id = :0";
    $userDbQryResult = $db->query($query, [0 => $googleId]);
    // Fetch the first row
    $user = $userDbQryResult->fetch(PDO::FETCH_ASSOC);

    // Check if the fetched row is not empty
    if (empty($user)) {
        // User does not exist; put them into the database
        $log->logRun("username obtained from payload: $username");
        $log->logRun("googleId obtained from payload: $googleId");
        $params = array(
            ':googleId' => $googleId,
            ':username' => $username
        );
        $insertQuery = "INSERT INTO users (user_id, username) VALUES (:googleId, :username)";
        $db->query($insertQuery, $params);
    } else {
        // User already exists in the database
        $log->logRun("Google user already in database" . print_r($user, true));
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
