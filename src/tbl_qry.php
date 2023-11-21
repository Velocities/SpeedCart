<?php

require('crud_ops.php');

// Create a new instance of SQLite3Database
$db = new SQLite3Database('movies.db', __DIR__ . '/../logs/api.log');

// Check the request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Handle GET request
    $srchValue = strtolower($_REQUEST['srchValue']);
    $params = [
        'tblName' => 'movies',
        'columns' => '*',
        'condition' => 'name LIKE :searchValue',
        'params' => [':searchValue' => "%$srchValue%"],
    ];
    $qryResults = $db->readRecords($params);
} elseif ($method === 'POST') {
    // Handle POST request
    $jsonData = json_decode(file_get_contents('php://input'), true);
    $srchValue = strtolower($jsonData['srchValue']);
    // Adjust your SQL query based on the POST data
    // Example: $qryResults = $db->readRecords('movies', '*', "WHERE some_column = '$srchValue'");
    $params = [
        'tblName' => 'movies',
        'columns' => '*',
        'condition' => 'name LIKE :searchValue',
        'params' => [':searchValue' => "%$srchValue%"],
    ];
    $qryResults = $db->readRecords($params);
}

// Convert the query results to JSON
$JSONResults = json_encode($qryResults);

// Output the JSON results
echo $JSONResults;
?>