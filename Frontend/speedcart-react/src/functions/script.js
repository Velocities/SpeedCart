/* Your JavaScript code here
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput'; // Add an id
    fileInput.name = 'fileInput'; // Add a name

    function read(db, table, chosenCondition, parameters) {
        // Construct request data necessary for query
        const params = {
            database: db,
            tblName: table,
            condition: chosenCondition,
            params: parameters,
        };

        const base_url = 'http://139.144.239.217';
        const endpoint = '/api/ShopFastDataManager.php';

        // Construct the URL with a single 'params' parameter
        const urlWithParams = `${base_url}${endpoint}?params=${encodeURIComponent(JSON.stringify(params))}`;
    
        // Use Fetch API with streaming
    fetch(urlWithParams)
        .then(response => {
            const reader = response.body.getReader();
            return new ReadableStream({
                async start(controller) {
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            controller.enqueue(value);
                        }
                        controller.close();
                    } catch (error) {
                        console.error('Error with Fetch API streaming:', error);
                        controller.error(error);
                    } finally {
                        reader.releaseLock();
                    }
                },
            });
        })
        .then(stream => new Response(stream))
        .then(response => response.text())
        .then(text => {
            console.log('Received Text:', text);
            const records = JSON.parse(text);
            console.log('Parsed Records:', records);
        })
        .catch(error => {
            console.error('Error with Fetch API:', error);
        });
    }
    

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                // Process the binary data (e.target.result is an ArrayBuffer)
                const binaryData = new Uint8Array(e.target.result);
                console.log('Binary Data:', binaryData);
            };

            reader.readAsArrayBuffer(file);
        }
    });

    document.body.appendChild(fileInput);

    // Trigger the read function when the page loads
    read('movies', 'movies', '', {});
});*/

const params = {
    database: 'movies',
    tblName: 'movies',
    condition: '',
    params: {},
};

const base_url = 'http://139.144.239.217';
const endpoint = '/api/ShopFastDataManager.php';

// Construct the URL with a single 'params' parameter
const urlWithParams = `${base_url}${endpoint}?params=${encodeURIComponent(JSON.stringify(params))}`;

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