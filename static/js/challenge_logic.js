// Add console.log to check to see if our code is working.
console.log("working");

// Tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Second tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Third tile layer that will be the background of our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});


// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Dark":dark
};

// Create layer groups for the earthquake, tectonic plate, and major earthquake data.
let allEarthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();
let majorEarthquakes = new L.LayerGroup();


// Creating the overlays object with the 3 layers
let overlays = {
  "Earthquakes": allEarthquakes,
  "Tectonic Plates": tectonicPlates,
  "Major Earthquakes": majorEarthquakes
};

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);













earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Retrieve the earthquake GeoJSON data.
d3.json(earthquakeURL).then(function(data) {

  // Creating a GeoJSON layer
  L.geoJson(data, {
    	// Create circle markers for each feature in GeoJSON data
    	pointToLayer: function(feature, latlng) {
      		console.log(data);
      		return L.circleMarker(latlng);
        },
      
    style: styleInfo,

     // Create popup for each marker
     onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(allEarthquakes);

  // Add the earthquake layer to our map.
  allEarthquakes.addTo(map);


});





tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Retrieve Tectonic Plate GeoJSON Data
d3.json(tectonicURL).then(function(tectonicData){

  // Creating a GeoJSON layer
  L.geoJson(tectonicData,{
    color: "#DC143C",
    weight: 2
   }).addTo(tectonicPlates);
  
  tectonicPlates.addTo(map);
});





majorEarthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Retrieve Major Earthquake GeoJSON Data
d3.json(majorEarthquakeURL).then(function(majorEQData){

  L.geoJson(majorEQData, {

      // Add Circle Markers 
      pointToLayer: function(feature,latlng){
        return L.circleMarker(latlng);
      },

    // Style The Markers
    style: styleInfoMajor,

    onEachFeature: function(feature,layer){
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(majorEarthquakes);

  majorEarthquakes.addTo(map);

});



// Functions

// Generates the style data needed for the earthquake layer
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  };

  // Generates the style data needed for the major earthquake layer
  function styleInfoMajor(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColorMajor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  };

 // Determines the color of the earthquake marker based on the magnitude of the earthquake.
 function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
};

// Determines the color of the earthquake marker based on the magnitude of the earthquake.
function getColorMajor(magnitude) {
  if (magnitude > 6) {
    return "#ea2c2c";
  }
  if (magnitude > 5) {
    return "#ea822c";
  }
  return "#98ee00";
};

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
};




  

  // Create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");

  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

// Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);

  
