<?php
// RESTful API that manages data for ShopFast

require('database.php');
define('PROJECT_ROOT', getenv('PROJECT_ROOT'));

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (you can specify your domain instead of '*')
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); // Specify the allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type"); // Specify the allowed headers

// Check the request method
$method = $_SERVER['REQUEST_METHOD'];

$clientIP = $_SERVER['REMOTE_ADDR'];

$log = new loggable(PROJECT_ROOT . '/logs/api.log');

$log->logRun("API call from IP $clientIP");


// Read
if ($method === 'GET') {

    // GET requests (for HTTP 1.1 and onward) don't allow body content; use encoded URL parameters instead
    // Retrieve parameters from the URL
    $paramsString = isset($_GET['params']) ? $_GET['params'] : '';
    $jsonData = json_decode(urldecode($paramsString), true);
    $log->logRun("jsonData received in GET request: " . print_r($jsonData, true));

    try {
        $db = new Database($jsonData['database'], PROJECT_ROOT . '/logs/api.log'); // Note: Check this at some point prior to final release (potential security and functionality risk)
    } catch (Exception $e) {
        // Response should be JSON for failure
        header('Content-Type: application/json');
        $errMsg = "Failed to open database " . $jsonData['database'] . ".db";
        $log->logRun($errMsg);
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["errorMessage" => $errMsg]);
        exit();
    }

    $tblName = $jsonData['tblName'];
    $containsTableResult = $db->containsTable($tblName);
    try {
        assert($containsTableResult === true); // Note: Check this at some point prior to final release (potential security and functionality risk)
    } catch (AssertionError $e) {
        // Response should be JSON for failure
        header('Content-Type: application/json');
        $log->logRun("containsTable failed");
        $errMsg = "Table $tblName does not exist";
        $log->logRun("$errMsg, exception thrown: $e");
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["errorMessage" => $errMsg]);
        exit();
    }
    
    // Test this for security! (and functionality, too!)
    $sql = "SELECT * FROM `{$tblName}`";
    try {
        $condition = $jsonData['condition'];
        if (strlen($condition) === 0) {
            throw new Exception("No condition; proceed without one and read all records");
        }
        // Validate condition by terminating the statement at the first semicolon (should prevent SQL injection)
        $terminationPoint = strpos($condition, ';');
        // The index could be 0
        if ($terminationPoint || $terminationPoint === 0) {
            $condition = substr($condition, 0, $terminationPoint);
        }
        $sql .= " WHERE " . $condition;
        $db->logger->logRun("Successfully injected condition into sql statement: " . $condition);
        // Retrieve parameters from the URL
        $searchValue = isset($_GET['searchValue']) ? $_GET['searchValue'] : '';

        // Handle the 'params' key by decoding the JSON string
        $userConditionParams = $jsonData['params'];
        //$db->logger->logRun("userConditionParams length: " . count($userConditionParams));

        // Use $searchValue and $params in your code
        //$params = array();
        $params = $userConditionParams;
        //$userConditionParams = $_REQUEST['params'];
        foreach ($userConditionParams as $currParam => $currValue) {
            //$params[$currParam] = $currValue;
            $db->logger->logRun("params map looks like this: " . $currParam . " => " . $currValue);

        }
    } catch (Exception $e) {
        $condition = false;
        $params = [];
        $db->logger->logRun("Couldn't properly inject condition into sql statement");
    }
    $qryResults = $db->select($sql, $params);
    $db->logger->logRun("SELECT results: " . json_encode($qryResults));

    // Set appropriate headers for binary data
    header('Content-Type: application/octet-stream');

    try {
        // Stream the binary data
        ob_start();
        flush();
        // Stream the data
        /*foreach ($qryResults as $currRecord) {
            $binaryData = pack('H*', bin2hex(json_encode($currRecord)));
            echo $binaryData;
            ob_flush();
            flush();
        }*/
        // Stream the data as a valid JSON array
        echo '[';
        $firstRecord = true;
        foreach ($qryResults as $currRecord) {
            if (!$firstRecord) {
                echo ',';
            }
            $firstRecord = false;

            // Output each JSON record
            echo json_encode($currRecord);
            ob_flush();
            flush();
        }
        echo ']';
        
        ob_end_flush();
    } catch (Exception $e) {
        // Handle exceptions
        // Log or output an error message
        echo 'Error: ' . $e->getMessage();
    }
    

} else {
    // Response should always be JSON for these methods, even in failure
    header('Content-Type: application/json');

    // Decode the input data
    $jsonData = json_decode(file_get_contents('php://input'), true);
    $tblName = $jsonData['tblName'];
    try {
        $db = new Database($jsonData['database'], PROJECT_ROOT . '/logs/api.log');
    } catch (Exception $e) {
        // Response should be JSON for failure
        header('Content-Type: application/json');
        $errMsg = "Failed to open database " . $jsonData['database'] . ".db";
        $log->logRun($errMsg);
        header("HTTP/1.1 404 Not Found"); // This error code should become refined at some point; 404 won't always be the case, maybe 403 or other error type
        echo json_encode(["errorMessage" => $errMsg]);
        exit();
    }
    $containsTableResult = $db->containsTable($tblName);
    try {
        assert($containsTableResult === true); // Note: Check this at some point prior to final release (potential security and functionality risk)
    } catch (AssertionError $e) {
        // Response should be JSON for failure
        header('Content-Type: application/json');
        $log->logRun("containsTable failed");
        $errMsg = "Table $tblName does not exist";
        $log->logRun("$errMsg, exception thrown: $e");
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["errorMessage" => $errMsg]);
        exit();
    }
    // Create
    if ($method === 'POST') {
        // Handle POST request
        $insertionData = $jsonData['data']; // This should be a map
        if ($insertionData === null) {
            $log->logRun("jsonData['data'] was null");
            $errMsg = "Data passed to API was null";
            $log->logRun("$errMsg, exception thrown: $e");
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["errorMessage" => $errMsg]);
            exit();
        } else if (gettype($insertionData) !== 'array') {
            $log->logRun("jsonData['data'] was not a map");
            $errMsg = "Data passed to API was not a map";
            $log->logRun("$errMsg, exception thrown: $e");
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["errorMessage" => $errMsg]);
            exit();
        // The below line checks if the type is array or a map (this is necessary because PHP considers both maps and arrays as just arrays)
        } else if (array_keys($insertionData) === range(0, count($insertionData) - 1)) {
            $log->logRun("jsonData['data'] was not a map");
            $errMsg = "Data passed to API was not a map";
            $log->logRun("$errMsg, exception thrown: $e");
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["errorMessage" => $errMsg]);
            exit();
        }
        
        $qryResults = $db->insert($tblName, $insertionData);
    // Update
    } elseif ($method === 'PUT') {
        $updatedData = $jsonData['data'];
        if ($updatedData === null) {
            $log->logRun("jsonData['data'] was null");
            $errMsg = "Data passed to API was null";
            $log->logRun("$errMsg, exception thrown: $e");
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["errorMessage" => $errMsg]);
            exit();
        } else if (gettype($updatedData) !== 'array') {
            $log->logRun("jsonData['data'] was not a map");
            $errMsg = "Data passed to API was not a map";
            $log->logRun("$errMsg, exception thrown: $e");
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["errorMessage" => $errMsg]);
            exit();
        // The below line checks if the type is array or a map (this is necessary because PHP considers both maps and arrays as just arrays)
        } else if (array_keys($updatedData) === range(0, count($updatedData) - 1)) {
            $log->logRun("jsonData['data'] was not a map");
            $errMsg = "Data passed to API was not a map";
            $log->logRun("$errMsg, exception thrown: $e");
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["errorMessage" => $errMsg]);
            exit();
        }
        $condition = $jsonData['condition']; // This is for the actual condition that comes after WHERE
        $userConditionParams = $jsonData['params']; // This is for binding values

        // Be careful! Updating without a WHERE clause will update ALL records!
        $qryResults = $db->update($tblName, $updatedData, $condition, $userConditionParams);
    // Delete
    } else if ($method === 'DELETE') {
        try {
            $condition = $jsonData['condition'];
        } catch (Exception $e) {
            $condition = null;
        }
        $userConditionParams = $jsonData['params'];
        $qryResults = $db->delete($tblName, $condition, $userConditionParams);
    } else {
        // Handle invalid method
        $qryResults = new stdClass(); // Use a basic, built-in PHP class for assigning JSON response values
        // Set failure values
        $qryResults->success = false;
        $qryResults->errorMsg = 'Invalid method type; allowed types are GET, POST, PUT, and DELETE';
    }
    // Convert the query results to JSON
    $JSONResults = json_encode($qryResults);

    // Output the JSON results
    echo $JSONResults;
}

?>
