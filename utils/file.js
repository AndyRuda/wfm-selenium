const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');

function writeFile(filePath, newObject, isArray = true) {
  const dirPath = path.dirname(filePath);

  // Check if the directory exists
  if (!fs.existsSync(dirPath)) {
    // If the directory doesn't exist, create it
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    jsonfile.writeFile(filePath, isArray? []: {}, { spaces: 2 }, (err) => {
      if (err) {
        console.error('Error creating the file:', err);
        return;
      }
      // Call the function again to add the object after the file is created
      writeFile(filePath, newObject, isArray);
    });
    return;
  }

  // Read the JSON file
  jsonfile.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // If the file is empty or doesn't exist, initialize as an empty array or object
    if (!data) {
      data = isArray? [] : {};
    }

    // Add the new object to the array or property of object
    if(isArray){
      data.push(newObject);
    }
    else{
      for (const key in newObject) {
        data[key] = newObject[key]
      }
    }

    // Write the changes back to the JSON file
    jsonfile.writeFile(filePath, data, { spaces: 2 }, (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
    });
  });
}

function deleteFile(filePath){
  if(filePath[0] === '/') filePath = filePath.slice(1)
  fs.unlinkSync(path.join(process.cwd(), ...filePath.split('/') ) )
}

function readData(filePath) {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (err) {
    return [];
  }
}

module.exports = { writeFile, readData, deleteFile };
