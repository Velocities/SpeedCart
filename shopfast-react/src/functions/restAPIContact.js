// Define API endpoint for contacting
const url = 'http://139.144.239.217/api/ShopFastDataManager.php'
const base_url = 'http://139.144.239.217';
const endpoint = '/api/ShopFastDataManager.php';

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


async function read(db, table, chosenCondition, parameters) {
    // Construct request data necessary for query
    const params = {
        database: db,
        tblName: table,
        condition: chosenCondition,
        params: parameters,
    };

    // Stringify the entire params object
    const paramsString = JSON.stringify(params);

    // Construct the URL with a single 'params' parameter
    const urlWithParams = `${base_url}${endpoint}?params=${encodeURIComponent(paramsString)}`;
    fetch(urlWithParams)
      .then(response => response.arrayBuffer())
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
});
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
read('movies', 'movies', '', {}); // Should read all records from movies.db database from movies table
//read('movies', 'movies', 'name = :searchValue', { ':searchValue' : 'Oppenheimer'});
/*create('movies', 'movies', {
    name: 'Top Gun: Maverick',
    year: '2023',
});*/
//deleteRecord('movies', 'movies', 'name = :searchValue', { ':searchValue': 'Top Gun: Maverick'});