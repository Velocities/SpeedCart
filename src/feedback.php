<?php
require('crud_ops.php');

// Create a new instance of SQLite3Database
$db = new SQLite3Database('feedback.db', __DIR__ . '/../logs/api.log');

// Check the request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Handle POST request
    $jsonData = json_decode(file_get_contents('php://input'), true);
    $feedbackTitle = $jsonData['feedbackTitle'];
    $feedbackDesc = $jsonData['feedbackDesc'];
    // Adjust your SQL query based on the POST data
    $qryResults = $db->createRecord('feedback', array([$feedbackTitle, $feedbackDesc]));
} else {
    // Failure (must conform to RESTful API format)
}

// Convert the query results to JSON
$JSONResults = json_encode($qryResults);

// Output the JSON results
echo $JSONResults;
?>