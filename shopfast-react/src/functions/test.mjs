import fetch from 'node-fetch';

// ... rest of the code remains unchanged

// Define API endpoint for contacting
const url = 'http://139.144.239.217/api/ShopFastDataManager.php';
const base_url = 'http://139.144.239.217';
const endpoint = '/api/ShopFastDataManager.php';

async function fetchData(db, tbl, chosenCondition, parameters) {
  try {
    const params = {
      database: db,
      tblName: tbl,
      condition: chosenCondition,
      params: parameters
    };
    const paramsString = JSON.stringify(params);
    const urlWithParams = `${base_url}${endpoint}?params=${encodeURIComponent(paramsString)}`;
    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream', // Set the content type to octet-stream
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not okay; HTTP code ' + response.status);
    }

    const binaryData = await response.blob();

    // Read binary data using FileReader
    const reader = new FileReader();

    reader.onload = function (event) {
      const binaryString = event.target.result;
      const textData = new TextDecoder().decode(new Uint8Array(binaryString));

      // Do something with the textData
      console.log('Text Data:', textData);
    };

    // Start reading the blob as text
    reader.readAsArrayBuffer(binaryData);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}

// Call the function to fetch and process binary data
fetchData('movies', 'movies', '', {});
