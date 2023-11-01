<?php
$logFilePath = __DIR__ . '/../logs/api.log';

ini_set('log_errors', 1);
ini_set('error_log', $logFilePath);

error_log("API script started at " . date('Y-m-d H:i:s'));

$db = new SQLite3("../databases/movies.db");


$srchValue = strtolower($_REQUEST['srchValue']);
error_log("srchValue received in lowercase: " . $srchValue);
$srchValue = $db->escapeString($srchValue);

$qry = "SELECT * FROM movies WHERE LOWER(name) LIKE '%$srchValue%'";
error_log("API query: " . $qry);
$qryResults = $db->query($qry);

$arrayResults = array();
while ($row = $qryResults->fetchArray(SQLITE3_ASSOC)) {
    $arrayResults[] = array(
        $row['NAME'],
        $row['YEAR']
    );
}

$db->close();

$JSONResults = json_encode($arrayResults);

// Log the response data before echoing
error_log("API response data: $JSONResults");

// Send results back to API caller in JSON format
echo $JSONResults;

error_log("API script completed at " . date('Y-m-d H:i:s'));
?>

