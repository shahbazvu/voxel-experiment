const fs = require("fs");
const VectorTile = require("vector-tile").VectorTile;
const Pbf = require("pbf");

// Load the .mvt file as a binary buffer
const mvtData = fs.readFileSync("building.mvt");

// Parse the VectorTile
const tile = new VectorTile(new Pbf(mvtData));

// Convert tile.layers to JSON and pretty-print it
const jsonLayers = JSON.stringify(tile.layers, null, 2);

// Write the JSON data to a new file
fs.writeFile("output.json", jsonLayers, "utf8", (err) => {
  if (err) {
    console.error("Error writing JSON file:", err);
  } else {
    console.log("Conversion completed. JSON data saved as output.json");
  }
});
