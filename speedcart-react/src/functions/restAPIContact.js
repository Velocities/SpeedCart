// Define API endpoint for contacting
//const url = 'https://www.speedcartapp.com/api/DataManager.php'
//const base_url = 'https://www.speedcartapp.com';
const base_url = 'https://api.speedcartapp.com';
//const endpoint = '/api/DataManager.php';


import { performance } from 'perf_hooks';

// db and tbl should both be Strings, record should be a map

function update(db, tbl, parameters, record) {
    const params = {
        database: db,
        tblName: tbl,
        data: record,
        qryTypes: parameters
    };
    const json_params = JSON.stringify(params);
    const endpoint = '/UpdateRecords';

    fetch(`${base_url}${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: json_params
    }).then(response => {
        console.log(response.status);
    })
    .catch(error => {
        console.error('Error processing POST request:', error);
    });
}

function deleteRecord(db, tbl, chosenCondition, parameters) {
    const params = {
        database: db,
        tblName: tbl,
        //condition: chosenCondition,
        //params: parameters
        qryTypes: chosenCondition
    };
    const json_params = JSON.stringify(params);
    const endpoint = '/DeleteRecords';

    fetch(`${base_url}${endpoint}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: json_params
    }).then(response => {
        console.log(response);
        console.log(response.status);
    })
    .catch(error => {
        console.error('Error processing POST request:', error);
    });
}

/*read('movies', 'movies', 'name LIKE :searchValue', {
    ':searchValue' : '%home%'
})*/

function readBinaryFile(file_path, encoding = 'utf-8') {
    fetch(file_path)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const binary_data = new TextDecoder(encoding).decode(buffer);
            const json_data = JSON.parse(binary_data);
            console.log('Decoded JSON data read from file:');
            console.log(json_data);
        })
        .catch(error => {
            console.error(`Error reading file: ${file_path}`, error);
        });
}

/**
 * Gets records from API streaming endpoint and handles them as they come in
 *
 * @param {string} db - Database to query
 * @param {string} table - Table to query from the specified database
 * @param {object} parameters - Parameters applied in query
 * @param {string} outputFormat - Desired output format ('array' or 'associative')
 */
async function read(db, table, parameters, outputFormat = 'associative') {
    const endpoint = '/ReadRecords';
    // Construct request data necessary for query
    const params = {
        database: db,
        tblName: table,
        qryTypes: parameters,
        outputFormat: outputFormat // Include the desired output format in the request
    };

    // Stringify the entire params object
    const paramsString = JSON.stringify(params);

    // Construct the URL with a single 'params' parameter
    const urlWithParams = `${base_url}${endpoint}?params=${encodeURIComponent(paramsString)}`;
    const response = await fetch(urlWithParams);
  
    if (!response.ok) {
        //throw new Error(`HTTP error! Status: ${response.status}`);
        const errorText = await response.text(); // Read the error response
        throw new Error(`HTTP error! Status: ${response.status} Response text: ${errorText}`);
    }

    const reader = response.body.getReader();
    let partialData = ''; // String to accumulate partial data

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break; // Exit the loop when all data has been read
        }

        // Process the chunk of data (value) as it comes in
        //console.log(value);

        // Convert chunk (Uint8Array) to string and append to partialData
        partialData += new TextDecoder('utf-8').decode(value);

        // Process the partial data as needed
        console.log('Partial Data:', partialData);
    }

    // Parse the final accumulated partial data as JSON
    const jsonData = JSON.parse(partialData);


    // Process the final JSON data
    console.log('Final JSON Data:', jsonData);

    jsonData.forEach(record => {
        // Perform operations on each record
        console.log('Record:', record);
        // Access individual fields of the record
        /*console.log('Name:', record.NAME);
        console.log('Year:', record.YEAR);*/
    });

    // Additional processing after all data is read
    console.log('All data processed');
    /*fetch(urlWithParams)
      .then(response => {
        console.log(response);
        return response.arrayBuffer();
       })
      .then(buffer => {
        // Convert array buffer to string
        const text = new TextDecoder('utf-8').decode(buffer);

        // Log the raw text before parsing
        console.log('Raw Text:', text);

        // Parse JSON
        const jsonData = JSON.parse(text);

        // Process the JSON data
        console.log(jsonData);
    })
    .catch(error => {
        // Handle array buffer error
        console.error('Error reading array buffer data:', error);
    });*/
}



import fetch from 'node-fetch';
import cookie from 'cookie';
function create(db, table, data) {

    const params = {
        database: db,
        tblName: table,
        data: data,
    };
    const json_params = JSON.stringify(params);
    const endpoint = '/CreateRecord';
    // Assuming you have stored the Laravel session cookie in a variable called 'laravel_session'
    const laravelSessionCookie = 'laravel_session=your_session_cookie_value';
    
    // Parse the CSRF token from the cookie
    const csrfToken = cookie.parse(laravelSessionCookie).XSRF_TOKEN;

    fetch(`${base_url}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Include the CSRF token in the headers
        },
        body: json_params,
    })
    .then(response => {
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Parse response JSON
        return response.json().then(responseData => {
            // Log response data and status
            console.log(responseData);
            console.log('Status:', response.status);
        });
    })
    .catch(error => {
        console.error('Error processing POST request:', error);
    });
}



// Example: Sending a request with search value 'home'
//read('movies', 'movies', 'name LIKE :searchValue', { ':searchValue': '%h%' });
// The above example works too
/*update('movies', 'movies', {
    'EQUALS' : {
    "name": 'Top Gun: Maverick', // Type of variable doesn't matter at the moment; this should probably be addressed at some point
    "year": 2023
    }}, {
    name: 'Top Gun: Maverick',
    year: '2022',
    });*/
/*async function main() {
    const start = performance.now();
    await read('movies', 'movies',  {

    }); // Should read all records from movies.db database from movies table
    // POTENTIAL BUG (at some point, probably): Final JSON data shows spaces in records output (look near square brackets)
    const end = performance.now();
    console.log("Overall time spent on stream restAPIContact.js: ", end - start, "milliseconds");
}
main().catch(error => console.error(error));*/

create('movies', 'movies', {
    name: 'Oppenheimer',
    year: '2023',
});
//deleteRecord('movies', 'movies', { 'EQUALS': {'name':'Top Gun: Maverick'}});