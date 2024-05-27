<?php

// Note: We need to move almost all of this content to api.php for clarity ASAP

use App\Libraries\Database\Database;
use App\Libraries\Logging\Loggable;

use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Route;

use App\Http\Middleware\GoogleAuthentication; // This brings in our middleware to ensure authentication prior to user actions actually being done

// This is primarily for testing; since it's middleware, it doesn't usually get directly contacted
Route::post('/auth/google', function () {
    // No code necessary here; we just want to test the middleware
    Log::error("Finished executing GoogleAuthentication middleware"); // Why isn't this logging?
    return response()->json([
        'status' => 'success',
        'message' => 'Authentication successful',
    ], 200);
})->middleware(GoogleAuthentication::class);

//require_once(app_path('Libraries/Database/database.php'));


// Used for checking if parameter is a map (i.e. associative array)
function isAssociativeArray($arr) {
    if (!is_array($arr)) {
        return false;
    }

    // Check if at least one key is a non-numeric key
    foreach ($arr as $key => $value) {
        if (!is_int($key)) {
            return true;
        }
    }

    return false;
}

function streamResults($qryResults, $log, $outputFormat) {
    // No need to set headers here
    try {
        $log->logRun("Sending back safe search results: " . print_r($qryResults, true));
        
        if ($outputFormat === 'array') {
            // Stream the data as a valid JSON array
            $stream = fopen('php://output', 'w');
            fwrite($stream, '[');
            $firstRecord = true;
            foreach ($qryResults as $currRecord) {
                $currRecord = array_values($currRecord);
                if (!$firstRecord) {
                    fwrite($stream, ',');
                }
                $firstRecord = false;

                // Output each JSON record
                fwrite($stream, json_encode($currRecord));
            }
            fwrite($stream, ']');
            fclose($stream);
        } else if ($outputFormat === 'associative') {
            // Stream the data as a valid JSON array
            $stream = fopen('php://output', 'w');
            fwrite($stream, '[');
            $firstRecord = true;
            foreach ($qryResults as $currRecord) {
                if (!$firstRecord) {
                    fwrite($stream, ',');
                }
                $firstRecord = false;

                // Output each JSON record
                fwrite($stream, json_encode($currRecord));
            }
            fwrite($stream, ']');
            fclose($stream);
        } else {
            // Handle other output formats here if needed
            return response()->json(["errorMessage" => "Invalid output format"], 400);
        }
    } catch (Exception $e) {
        // Handle exceptions
        // Log or output an error message
        return response()->json(["errorMessage" => $e->getMessage()], 500);
    }
}

Route::get('/ReadRecords', function () {
    define('PROJECT_ROOT', getenv('PROJECT_ROOT'));

    $method = $_SERVER['REQUEST_METHOD'];
    $clientIP = $_SERVER['REMOTE_ADDR'];
    $log = new Loggable('DataManager.log');
    $log->logRun("API call from IP $clientIP");

    $paramsString = isset($_GET['params']) ? $_GET['params'] : '';
    $log->logRun("params received in GET request: " . print_r($paramsString, true));
    $jsonData = json_decode(urldecode($paramsString), true);
    $log->logRun("jsonData received in GET request: " . print_r($jsonData, true));

    try {
        $db = new Database($jsonData['database'], 'DataManager.log');
    } catch (Exception $e) {
        return response()->json(["errorMessage" => "Failed to open database"], 404);
    }

    $tblName = $jsonData['tblName'];
    $containsTableResult = $db->containsTable($tblName);
    try {
        assert($containsTableResult === true);
    } catch (AssertionError $e) {
        return response()->json(["errorMessage" => "Table does not exist"], 404);
    }

    $qryTypes = $jsonData['qryTypes'];
    $outputFormat = $jsonData['outputFormat'];
    $log->logRun("outputFormat chosen: $outputFormat");

    $equalityMappings = null;
    $likeMappings = null;
    if ($qryTypes) {
        if (isAssociativeArray($qryTypes)) {
            foreach ($qryTypes as $currQryType => $currQryMapping) {
                switch ($currQryType) {
                    case 'EQUALS':
                        $equalityMappings = $currQryMapping;
                        break;
                    case 'LIKE':
                        $likeMappings = $currQryMapping;
                        break;
                    default:
                        return response()->json(["errorMessage" => "Invalid input type passed in qryType"], 400);
                }
            }
            $log->logRun("Data validated, continuing with parameter binding and sanitization...");
            $bindingParams = array('EQUALS' => $equalityMappings, 'LIKE' => $likeMappings);
            $qryResults = $db->selectRecords($tblName, $bindingParams);
            return streamResults($qryResults, $log, $outputFormat);
        } else {
            return response()->json(["errorMessage" => "Invalid input type passed"], 400);
        }
    } else {
        $qryResults = $db->selectRecords($tblName);
        return streamResults($qryResults, $log, $outputFormat);
    }
});

Route::post('/CreateRecord', function () {
    // Get parameters
    $jsonData = json_decode(file_get_contents('php://input'), true);
    try {
        $db = new Database($jsonData['database'], 'DataManager.log');
    } catch (Exception $e) {
        return response()->json(["errorMessage" => "Failed to open database"], 404);
    }

    $tblName = $jsonData['tblName'];
    // Handle POST request
    $insertionData = $jsonData['data']; // This should be a map
    $log = new Loggable('DataManager.log');
    $log->logRun("Table name: $tblName");
    if ($insertionData === null) {
        $log->logRun("jsonData['data'] was null");
        $errMsg = "Data passed to API was null";
        $log->logRun("$errMsg, exception thrown: $e");
        return response()->json(["errorMessage" => $errMsg, "error" => "Bad Request"], 400)->withHeaders([
            'Content-Type' => 'application/json',
        ]);
        exit();
    } else if (gettype($insertionData) !== 'array') {
        $log->logRun("jsonData['data'] was not a map");
        $errMsg = "Data passed to API was not a map";
        $log->logRun("$errMsg, exception thrown: $e");
        return response()->json(["errorMessage" => $errMsg, "error" => "Bad Request"], 400)->withHeaders([
            'Content-Type' => 'application/json',
        ]);
        exit();
    // The below line checks if the type is array or a map (this is necessary because PHP considers both maps and arrays as just arrays)
    } else if (array_keys($insertionData) === range(0, count($insertionData) - 1)) {
        $log->logRun("jsonData['data'] was not a map");
        $errMsg = "Data passed to API was not a map";
        $log->logRun("$errMsg, exception thrown: $e");
        return response()->json(["errorMessage" => $errMsg, "error" => "Bad Request"], 400)->withHeaders([
            'Content-Type' => 'application/json',
        ]);
        exit();
    }
    
    $qryResults = $db->insertRecord($tblName, $insertionData);
    return response()->json($qryResults)->withHeaders([
        'Content-Type' => 'application/json',
    ]);
});

Route::put('/UpdateRecords', function () {
    // Get parameters
    $jsonData = json_decode(file_get_contents('php://input'), true);

    $updatedData = $jsonData['data'];
    $qryResults = array();
    $log = new Loggable('DataManager.log');
    if ($updatedData === null) {
        $log->logRun("jsonData['data'] was null");
        $errMsg = "Data passed to API was null";
        $log->logRun("$errMsg, exception thrown: $e");
        return response()->json(["errorMessage" => $errMsg, "error" => "Bad Request"], 400)->withHeaders([
            'Content-Type' => 'application/json',
        ]);
        exit();
    } else if (gettype($updatedData) !== 'array') {
        $log->logRun("jsonData['data'] was not a map");
        $errMsg = "Data passed to API was not a map";
        $log->logRun("$errMsg, exception thrown: $e");
        return response()->json(["errorMessage" => $errMsg, "error" => "Bad Request"], 400)->withHeaders([
            'Content-Type' => 'application/json',
        ]);
        exit();
    // The below line checks if the type is array or a map (this is necessary because PHP considers both maps and arrays as just arrays)
    } else if (array_keys($updatedData) === range(0, count($updatedData) - 1)) {
        $log->logRun("jsonData['data'] was not a map");
        $errMsg = "Data passed to API was not a map";
        $log->logRun("$errMsg, exception thrown: $e");
        return response()->json(["errorMessage" => $errMsg, "error" => "Bad Request"], 400)->withHeaders([
            'Content-Type' => 'application/json',
        ]);
        exit();
    }
    $equalityMappings = null;
    $likeMappings = null;
    $qryTypes = $jsonData['qryTypes']; // This contains the actual conditions that come after WHERE
    $log->logRun("qryTypes: ".print_r($qryTypes, true));
    if ( $qryTypes ) {
        if ( isAssociativeArray( $qryTypes ) ) {
            foreach ( $qryTypes as $currQryType => $currQryMapping ) {
                switch ( $currQryType ) {
                    case 'EQUALS':
                        // Grab all equality mappings
                        $equalityMappings = $currQryMapping;
                        break;
                    case 'LIKE':
                        $likeMappings = $currQryMapping;
                        break;
                    default:
                        $errMsg = "Invalid input type passed in qryType: " . gettype($currQryType) . ", should be EQUALS or LIKE";
                        $log->logRun( $errMsg );
                        return response()->json(["errorMessage" => $errMsg, "error" => "Bad Request"], 400)->withHeaders([
                            'Content-Type' => 'application/json',
                        ]);
                        exit();
                        break; // This might not be necessary as we're force-ending the program
                }
            }
            // If we're here, we should be safe knowing the mappings passed can be used
            $log->logRun("Data validated, continuing with parameter binding and sanitization...");
            $bindingParams = array('EQUALS' => $equalityMappings, 'LIKE' => $likeMappings);
            $qryResults = $db->updateRecords($tblName, $updatedData, $bindingParams);
        }
    }

    return response()->json($qryResults)->withHeaders([
        'Content-Type' => 'application/json',
    ]);
});

Route::delete('/DeleteRecords', function() {
    // Get parameters
    $jsonData = json_decode(file_get_contents('php://input'), true);

    try {
        $db = new Database($jsonData['database'], 'DataManager.log');
    } catch (Exception $e) {
        return response()->json(["errorMessage" => "Failed to open database"], 404);
    }

    try {
        $condition = $jsonData['condition'];
    } catch (Exception $e) {
        $condition = null;
    }
    $equalityMappings = null;
    $likeMappings = null;
    $qryTypes = $jsonData['qryTypes'];
    $tblName = $jsonData['tblName'];
    $qryResults = array();

    $log = new Loggable('DataManager.log');
    $log->logRun("qryTypes: ".print_r($jsonData, true));
    if ( $qryTypes ) {
        if ( isAssociativeArray( $qryTypes ) ) {
            foreach ( $qryTypes as $currQryType => $currQryMapping ) {
                switch ( $currQryType ) {
                    case 'EQUALS':
                        // Grab all equality mappings
                        $equalityMappings = $currQryMapping;
                        break;
                    case 'LIKE':
                        $likeMappings = $currQryMapping;
                        break;
                    default:
                        $errMsg = "Invalid input type passed in qryType: " . gettype($currQryType) . ", should be EQUALS or LIKE";
                        $log->logRun( $errMsg );
                        return response()->json(["errorMessage" => $errMsg, "error" => "Bad Request"], 400)->withHeaders([
                            'Content-Type' => 'application/json',
                        ]);
                        exit();
                        break; // This might not be necessary as we're force-ending the program
                }
            }
            // If we're here, we should be safe knowing the mappings passed can be used
            $log->logRun("Data validated, continuing with parameter binding and sanitization...");
            $bindingParams = array('EQUALS' => $equalityMappings, 'LIKE' => $likeMappings);
            $qryResults = $db->deleteRecords($tblName, $bindingParams);
        }
    }
    return response()->json($qryResults)->withHeaders([
        'Content-Type' => 'application/json',
    ]);
});

Route::get('/phpinfo', function () {
    phpinfo();
});

//use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\ShoppingListController;
use App\Http\Controllers\Api\GroceryItemController;

//Route::apiResource('users', UserController::class);
Route::apiResource('routes', RouteController::class);

//Route::apiResource('shopping-lists', ShoppingListController::class);
// Middleware for authentication endpoint
Route::post('/shopping-lists', [ShoppingListController::class, 'store'])
->middleware(GoogleAuthentication::class);

Route::apiResource('grocery-items', GroceryItemController::class);

// Route for retrieving all shopping list titles (used for Dashboard page)
Route::get('/shopping-lists', [ShoppingListController::class, 'getUserShoppingLists'])
->middleware(GoogleAuthentication::class);

// Route for deleting a shopping list
Route::delete('/shopping-lists/{id}', [ShoppingListController::class, 'destroy'])
    ->middleware(GoogleAuthentication::class);