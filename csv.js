const fs = require("fs");
const csv = require("csv-parser");
const JSONStream = require("JSONStream");

const csvFilePath = "format3.csv"; // Replace with the path to your CSV file
const jsonFilePath = "output3.json"; // Replace with the desired JSON output file path

const writeStream = fs.createWriteStream(jsonFilePath);

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .pipe(JSONStream.stringify())
  .pipe(writeStream)
  .on("finish", () => {
    console.log("Conversion completed. JSON data saved as", jsonFilePath);
  })
  .on("error", (err) => {
    console.error("Error writing JSON file:", err);
  });
