const axios = require('axios');
const { performance } = require('perf_hooks');

async function fetchData(url, processRecordCallback) {
  const start = performance.now();

  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'stream',
  });

  const end = performance.now();
  console.log(`Time taken for fetchData: ${end - start} milliseconds`);

  const stream = response.data;

  let partialData = '';

  stream.on('data', (chunk) => {
    const chunkText = chunk.toString('utf-8');
    partialData += chunkText;

    // Check for complete records in the partialData
    let recordSeparatorIndex;
    while ((recordSeparatorIndex = partialData.indexOf('\n')) !== -1) {
      const record = partialData.substring(0, recordSeparatorIndex);
      // Process the record one at a time
      processRecordCallback(record);

      // Remove the processed record from partialData
      partialData = partialData.substring(recordSeparatorIndex + 1);
    }
  });

  return new Promise((resolve) => {
    stream.on('end', () => {
      // Process any remaining data in partialData after the stream ends
      if (partialData.length > 0) {
        processRecordCallback(partialData);
      }

      console.log('All data processed');
      resolve();
    });
  });
}

// Example usage inside an async function
async function main() {
  // Construct request data necessary for query
  const params = {
    database: 'movies',
    tblName: 'movies',
    condition: '',
    params: {},
  };

  // Stringify the entire params object
  const paramsString = JSON.stringify(params);
  
  const url = `https://www.speedcartapp.com/api/ShopFastDataManager.php?params=${encodeURIComponent(paramsString)}`; // Replace with your actual URL

  const processRecordCallback = (record) => {
    // Process each record as it arrives
    console.log('Processed Record:', record);
  };

  await fetchData(url, processRecordCallback);
}

main().catch(error => console.error(error));
