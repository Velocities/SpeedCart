pointers_folder="${PROJECT_ROOT}/shopfast-react/api" # Grab the folder location that points with symbolic links
destination_pointers_folder="${PROJECT_ROOT}/shopfast-react/"
sudo mv -P $pointers_folder $destination_pointers_folder # Temporarily move folder of symbolic links to avoid problems with npm
sudo npm run build # Build the React application
sudo mv -P $destination_pointers_folder $pointers_folder # Move folder of symbolic links back to proper/original position