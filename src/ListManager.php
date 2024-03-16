<?php

define('PROJECT_ROOT', getenv('PROJECT_ROOT'));
define('APP_BASE_URL', 'www.'.$_SERVER['SERVER_NAME']); // You have to change this manually in the nginx conf file!

/**
 * Gets records from API streaming endpoint and handles them as they come in
 *
 * @param string $db - Database to query
 * @param string $table - Table to query from the specified database
 * @param array $parameters - Parameters applied in query
 * @param string $outputFormat - Desired output format ('array' or 'associative')
 */
function read($db, $table, $parameters, $outputFormat = 'associative') {
    // Construct request data necessary for query
    $params = array(
        'database' => $db,
        'tblName' => $table,
        'qryTypes' => $parameters,
        'outputFormat' => $outputFormat // Include the desired output format in the request
    );

    // Stringify the entire params object
    $paramsString = json_encode($params);

    $base_url = 'https://www.speedcartapp.com';
    $endpoint = '/api/DataManager.php';

    // Construct the URL with a single 'params' parameter
    $urlWithParams = $base_url . $endpoint . '?params=' . urlencode($paramsString);
    // Set stream context options to specify HTTP header
    $context = stream_context_create(array(
        'http' => array(
            'method' => 'GET',
            'header' => 'Accept: application/json' // Set the Accept header to specify JSON response
        )
    ));

    // Open a connection to the URL
    $stream = fopen($urlWithParams, 'r', false, $context);

    if (!$stream) {
        // Handle error when stream is not opened
        throw new Exception("Error opening stream to URL.");
    }

    // Process the stream data as it comes in
    while (!feof($stream)) {
        // Read a line from the stream
        $line = fgets($stream);

        // Process the received line as needed
        echo 'Received Line:', $line;

        // Decode JSON data from the line
        $jsonData = json_decode($line, true);

        // Process the JSON data
        //echo 'JSON Data:', print_r($jsonData, true);
        foreach ($jsonData as $idx => $arr) {
            echo 'idx = '.$idx.PHP_EOL;
            print_r($arr);
        }
    }

    // Close the stream
    fclose($stream);
}

/*
Example query json object of this API file:
{
    qryType: 'create',
    listName: 'Weekly Groceries',
    listItems: [
        {
            name: 'corn',
            quantity: 6,
            is_food: true,
            shopping_list_id: 1
        },
        {
            name: 'watch',
            quantity: 1,
            is_food: false,
            shopping_list_id: 2
        }
    ]
}
*/
read('movies', 'movies', array());

?>