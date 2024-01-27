// Define API endpoint for contacting
const url = 'https://www.speedcartapp.com/api/ShopFastDataManager.php'
const base_url = 'https://www.speedcartapp.com';
const endpoint = '/api/ShopFastDataManager.php';

const { performance } = require('perf_hooks');

// db and tbl should both be Strings, record should be a map

function update(db, tbl, record, chosenCondition, parameters) {
    const params = {
        database: db,
        tblName: tbl,
        data: record,
        condition: chosenCondition,
        params: parameters
    };
    const json_params = JSON.stringify(params);
    fetch(url, {
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
        condition: chosenCondition,
        params: parameters
    };
    const json_params = JSON.stringify(params);
    fetch(url, {
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
 */
async function read(db, table, parameters) {
    // Construct request data necessary for query
    const params = {
        database: db,
        tblName: table,
        qryTypes: parameters
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




function create(db, table, data) {
    const url = `${base_url}${endpoint}`;
    const params = {
        database: db,
        tblName: table,
        data: data,
    };
    const json_params = JSON.stringify(params);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json_params,
    })
    .then(response => {
        console.log(response.json());
        console.log(response.status);
    })
    .catch(error => {
        console.error('Error processing POST request:', error);
    });
}

// Example: Sending a request with search value 'home'
//read('movies', 'movies', 'name LIKE :searchValue', { ':searchValue': '%h%' });
// The above example works too
/*update('movies', 'movies', {
    name: 'Top Gun: Maverick',
    year: '2022',
}, 'name = :searchValue', { ':searchValue': 'Top Gun: Maverick'});*/
async function main() {
    const start = performance.now();
    await read('movies', 'movies',  {
        'EQUALS' : {
            "year": 1990 // Type of variable doesn't matter at the moment; this should probably be addressed at some point
        },
        'LIKE' : {
            "name": "hOmE "
        }
    }); // Should read all records from movies.db database from movies table
    // POTENTIAL BUG (at some point, probably): Final JSON data shows spaces in records output (look near square brackets)
    const end = performance.now();
    console.log("Overall time spent on stream restAPIContact.js: ", end - start, "milliseconds");
}
main().catch(error => console.error(error));

//read('movies', 'movies', 'name = :searchValue', { ':searchValue' : 'Oppenheimer'});
/*create('movies', 'movies', {
    name: 'Top Gun: Maverick',
    year: '2023',
});*/
//deleteRecord('movies', 'movies', 'name = :searchValue', { ':searchValue': 'Top Gun: Maverick'});