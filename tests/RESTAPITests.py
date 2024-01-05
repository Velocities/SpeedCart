import requests
import json
from bson import json_util

def read_binary_file(file_path, encoding='utf-8'):
    try:
        # Open the binary file in read mode
        with open(file_path, "rb") as f:
            # Read the binary data
            binary_data = f.read()

            # Decode the binary data into a string using the specified encoding
            decoded_data = binary_data.decode(encoding)

            # Load the decoded JSON string into a Python object
            json_data = json_util.loads(decoded_data)

            # Process the JSON data as needed
            # For example, you can print it or perform further processing
            print("Decoded JSON data read from file:")
            print(json_data)

    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

def send_get_request(search_value):
    # Replace 'your_server_ip' with the actual IP address of your server
    base_url = 'http://139.144.239.217'
    endpoint = '/api/ShopFastDataManager.php'

    # Construct the URL
    url = f'{base_url}{endpoint}'

    # Specify the search parameters as a dictionary
    params = {
        'database': 'movies',
        'tblName': 'movies',
        'condition': 'name LIKE :searchValue',
        'params' : {
            ':searchValue' : search_value
        }
    }

    print(search_value)

    # Convert params to JSON
    json_params = json.dumps(params)

    # Send the GET request with JSON payload
    response = requests.get(url, data=json_params, headers={'Content-Type': 'application/json'})

    # Check the status code
    if response.status_code == 200:
        # Access the binary data
        binary_data = response.content

        # Save the binary data to a file
        with open("output_file.bin","wb") as f:
            f.write(binary_data)

        print("Octet-stream data successfully saved to output_file.bin")

        # Read and process the binary data from the file
        read_binary_file("output_file.bin")
    else:
        print(f'Request failed with status code {response.status_code}')

# Example: Sending a request with search value 'home'
send_get_request('%opp%')