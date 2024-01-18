<?php


$clientSecret = "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";


require '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Google\Client as Google_Client;

// Replace with your Google API credentials
$client_id = '345095409372-ebua99dg2ok8dgt5bfpkacf4nclqhj08.apps.googleusercontent.com';

// Replace with the Google ID token you want to verify
$id_token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4YTYzYmM0NzY3Zjg1NTBhNTMyZGM2MzBjZjdlYjQ5ZmYzOTdlN2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNDUwOTU0MDkzNzItZWJ1YTk5ZGcyb2s4ZGd0NWJmcGthY2Y0bmNscWhqMDguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNDUwOTU0MDkzNzItZWJ1YTk5ZGcyb2s4ZGd0NWJmcGthY2Y0bmNscWhqMDguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM2NjM1ODM0MTg4NjQ3NTQwMTIiLCJlbWFpbCI6ImNhbXk2MjRAY29tY2FzdC5uZXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzA1NTA5Mzg5LCJuYW1lIjoiVmVsb2NpdGllcyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLRjRrb2VOejI1VURrOTFGQlpla2E4MFdLTlZhUVJLVEtXdkFiR0JRNkNnbXc9czk2LWMiLCJnaXZlbl9uYW1lIjoiVmVsb2NpdGllcyIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNzA1NTA5Njg5LCJleHAiOjE3MDU1MTMyODksImp0aSI6ImMzNDViZDZiZTFiNDY0YzBmMmVkNDFmNmYyOTZmNTcxNGZlZDkxN2EifQ.fPKX2IB2Wz8sa3pfwLqH92dNf0Pk7bXZ93SpzZVKIJFezMkEyM_g6uRvaSNqDqT80Y7SRBanm_KEhChVPtuHOhkJXdviKxdZE7yL33I7ZsTmOtekGj7oZDbbPb0WllffSEq-dgwioiizZ4aEu4XiyiVqqdB__i6LhcPUm0eOqKj999kwU0JlEuCZDQAufOjRnMX0mfJzjozZA7xKV5MCdFSzb_fOoWSZNcuLUWs1tBEmKHHtByXp-WjNpCwbg-xX5T2VwztOmpfc5CXXF2nPpk993JSU7UIEiFe3FbAq246QxAa3rcqUgOEzPL3AeLovra_MbJooOBnE3MHOeRO9kw';
$id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4YTYzYmM0NzY3Zjg1NTBhNTMyZGM2MzBjZjdlYjQ5ZmYzOTdlN2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNDUwOTU0MDkzNzItZWJ1YTk5ZGcyb2s4ZGd0NWJmcGthY2Y0bmNscWhqMDguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNDUwOTU0MDkzNzItZWJ1YTk5ZGcyb2s4ZGd0NWJmcGthY2Y0bmNscWhqMDguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM2NjM1ODM0MTg4NjQ3NTQwMTIiLCJlbWFpbCI6ImNhbXk2MjRAY29tY2FzdC5uZXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzA1NTEzOTg2LCJuYW1lIjoiVmVsb2NpdGllcyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLRjRrb2VOejI1VURrOTFGQlpla2E4MFdLTlZhUVJLVEtXdkFiR0JRNkNnbXc9czk2LWMiLCJnaXZlbl9uYW1lIjoiVmVsb2NpdGllcyIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNzA1NTE0Mjg2LCJleHAiOjE3MDU1MTc4ODYsImp0aSI6IjU4NjI3YzU0OTc2ZTFhOGY2ZDExOTQ1YzRlZGYyZTZjNDE0YjUwMjcifQ.KYvvuQcUp1qZED1JWp1XQTp7xLXTxVuXsfnSPzCcpfDsPTD-LxZ9xs78xW7-EwyKQKIPXNDQ8d6lBy-cwlTvO5dnzIw-dkpYsIUgeG1UiEKV_AJUkXG2-3ZdbkaK-lBeucWUE1MWU4J-jumwH387zU-2LRkzUwPbHPzkKm2qUdTyZ5hcI4068xhnwYA4jWaVywbrrbocUorRfZjI_WAjIb6AjEjk2HDN09hsSyuTQUl3QpJNKSKfuAeHiRNXOUdSi8gqHNuBYGntuDIgy34rFBDKKMPV2jZ_2mcPn-PlEZn3XLIsq8YEVz5nth9UizmFDV8mH8HXUWZXwDEOBfof3A";
// Initialize the Google API client
$google_client = new Google_Client(['client_id' => $client_id]);

try {
    // Decode the ID token
    $payload = $google_client->verifyIdToken($id_token);
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
    echo 'User ID: ' . $user_id . '<br>';
    echo 'Email: ' . $email . '<br>';
    
    // Additional checks or actions can be performed here
    
    // The ID token is valid
    echo 'ID token is valid';

} catch (Exception $e) {
    // Handle verification failure
    echo 'ID token verification failed: ' . $e->getMessage();
}
?>
