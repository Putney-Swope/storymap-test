// Define your map layers
var osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true
});

var wmsLayer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: 'https://demo.boundlessgeo.com/geoserver/ows',
    params: {
      'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
      'TILED': true
    },
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  }),
  visible: false
});

var baseLayers = [
  {
    name: 'OpenStreetMap',
    layer: osmLayer
  },
  {
    name: 'Natural Earth',
    layer: wmsLayer
  }
];

// Define your map
var map = new ol.Map({
  target: 'map',
  layers: [osmLayer, wmsLayer],
  view: new ol.View({
    center: ol.proj.fromLonLat([-73.985664, 40.748817]), // New York City
    zoom: 10
  })
});

// Add layer switcher control
var layerSwitcher = new ol.control.LayerSwitcher({
  tipLabel: 'Legend' // Optional label for button
});
map.addControl(layerSwitcher);

// Define Leaflet map and tile layers
var leafletMap = L.map('map');
var esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var openTopoMapLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');

// Add tile layers to Leaflet map
leafletMap.addLayer(esriLayer);
leafletMap.addLayer(openTopoMapLayer);

// Add Layer Control to Leaflet map
var baseMaps = {
  'Esri Imagery': esriLayer,
  'OpenTopoMap': openTopoMapLayer
};

L.control.layers(baseMaps).addTo(leafletMap);

// Sync Leaflet and OpenLayers maps
var olMapDiv = document.getElementById('map');
var olMap = map;
var sync = new ol.control.Sync({
  target: olMapDiv,
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }),
  interactions: ol.interaction.defaults({
    altShiftDragRotate: false,
    pinchRotate: false
  }),
  layers: baseLayers,
  view: olMap.getView()
});
sync.bindTo('extent', leafletMap);

// Add marker to Leaflet map
var marker = L.marker([40.748817, -73.985664]).addTo(
