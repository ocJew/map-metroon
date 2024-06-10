// Função para salvar a posição e o zoom do mapa no localStorage
function saveMapState() {
    var mapState = {
        center: map.getCenter(),
        zoom: map.getZoom()
    };
    localStorage.setItem('mapState', JSON.stringify(mapState));
}

// Função para carregar a posição e o zoom do mapa do localStorage
function loadMapState() {
    var mapState = localStorage.getItem('mapState');
    return mapState ? JSON.parse(mapState) : null;
}

var initialMapState = loadMapState();
var initialCenter = initialMapState ? initialMapState.center : [-3.685, -40.35];
var initialZoom = initialMapState ? initialMapState.zoom : 13;

let mapOptions = {
    minZoom: 13,
    maxZoom: 18,
    maxBounds: [
        [-3.72, -40.389], 
        [-3.65, -40.319]
    ],
    zoomControl: false,
    maxBoundsViscosity: 1.0 // Mantém o mapa dentro dos limites
}

var map = L.map('map', mapOptions).setView(initialCenter, initialZoom);

map.on('moveend', saveMapState);
map.on('zoomend', saveMapState);

// Adicione uma camada de mapa base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var northLayer = L.layerGroup().addTo(map);
var southLayer = L.layerGroup().addTo(map);
var SNLayer = L.layerGroup().addTo(map);

function isDarkMode() {
    return document.body.classList.contains('dark-mode');
}

// Função para adicionar trilhas do arquivo KML
function addKMLTracks() {
    fetch('./metroon.kml') // Carregue o arquivo KML
    .then(response => response.text())
    .then(kmltext => {
        var parser = new DOMParser();
        var kml = parser.parseFromString(kmltext, 'text/xml');
        var darkMode = isDarkMode();

        var northTracks = omnivore.kml.parse(kml, null, L.geoJson(null, {
            filter: function(feature) {
                return feature.properties && feature.properties.name && feature.properties.name.includes('Norte');
            },
            style: function (feature) {
                return {
                    color: darkMode ? '#6699ff' : '#0000FF',
                    weight: 5,
                    opacity: 0.5
                };
            },
            pointToLayer: function (geoJsonPoint, latlng) {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: './icons/blueball.png',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                    })
                });
            }
        }));

        var southTracks = omnivore.kml.parse(kml, null, L.geoJson(null, {
            filter: function(feature) {
                return feature.properties && feature.properties.name && feature.properties.name.includes('Sul');
            },
            style: function (feature) {
                return {
                    color: darkMode ? '#ff6666' : '#FF0000',
                    weight: 5,
                    opacity: 0.5
                };
            },
            pointToLayer: function (geoJsonPoint, latlng) {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: './icons/redball.png',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                    })
                });
            }
        }));

        northTracks.eachLayer(function(layer) {
            northLayer.addLayer(layer);
        });

        southTracks.eachLayer(function(layer) {
            southLayer.addLayer(layer);
        });
    });
}
addKMLTracks();

var redIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var blueIcon = L.icon({
    iconUrl: './icons/usuario.png',
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Adicione a localização do usuário ao mapa
function addLocationToMap() {
    const urlParams = new URLSearchParams(window.location.search);
    const latParam = urlParams.get('lat');
    const lngParam = urlParams.get('lng');
    if (latParam !== null && lngParam !== null) {
        var userLat = parseFloat(latParam);
        var userLng = parseFloat(lngParam);
        L.marker([userLat, userLng], {icon: redIcon}).addTo(northLayer).bindPopup("VLT NORTE");
    }

    const latParam2 = urlParams.get('lat2');
    const lngParam2 = urlParams.get('lng2');
    if (latParam2 !== null && lngParam2 !== null) {
        var userLat2 = parseFloat(latParam2);
        var userLng2 = parseFloat(lngParam2);
        L.marker([userLat2, userLng2], {icon: redIcon}).addTo(southLayer).bindPopup("VLT SUL");
    }

    const latParam3 = urlParams.get('lat3');
    const lngParam3 = urlParams.get('lng3');
    if (latParam3 !== null && lngParam3 !== null) {
        var userLat3 = parseFloat(latParam3);
        var userLng3 = parseFloat(lng3);
        L.marker([userLat3, userLng3], {icon: blueIcon}).addTo(SNLayer).bindPopup("Sua localização");
    }
}
addLocationToMap();

function toggleLayer(layer, show) {
    if (show) {
        if (!map.hasLayer(layer)) {
            map.addLayer(layer);
        }
    } else {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    }
}

// Função para salvar o estado dos botões no localStorage
function saveButtonState(buttonId) {
    localStorage.setItem('activeButton', buttonId);
}

// Função para carregar o estado dos botões do localStorage
function loadButtonState() {
    return localStorage.getItem('activeButton');
}

// Função para definir o estado inicial dos botões com base no localStorage
function setInitialButtonState() {
    var activeButtonId = loadButtonState();
    if (activeButtonId) {
        setActiveButton(activeButtonId);
        if (activeButtonId === 'button-norte') {
            toggleLayer(northLayer, true);
            toggleLayer(southLayer, false);
        } else if (activeButtonId === 'button-sul') {
            toggleLayer(northLayer, false);
            toggleLayer(southLayer, true);
        } else {
            toggleLayer(northLayer, true);
            toggleLayer(southLayer, true);
        }
    }
}
// Chame a função para definir o estado inicial dos botões
setInitialButtonState();

// Adiciona o evento de clique para os botões S, A e N
document.getElementById('button-sul').addEventListener('click', function() {
    toggleLayer(northLayer, false);
    toggleLayer(southLayer, true);
    setActiveButton('button-sul');
    saveButtonState('button-sul');
});
document.getElementById('button-norte').addEventListener('click', function() {
    toggleLayer(northLayer, true);
    toggleLayer(southLayer, false);
    setActiveButton('button-norte');
    saveButtonState('button-norte');
});
document.getElementById('button-ambos').addEventListener('click', function() {
    map.setView([-3.685, -40.35], 13);
    toggleLayer(northLayer, true);
    toggleLayer(southLayer, true);
    setActiveButton('button-ambos');
    saveButtonState('button-ambos');
    setActiveButton('button-ambos');
    saveMapState();
});

function setActiveButton(buttonId) {
    document.querySelectorAll('.control-buttons button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
}

// Adicione uma função para mudar o provedor de mapa com base no parâmetro da URL
function changeMapTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');

    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        map.eachLayer(function (layer) {
            if (layer instanceof L.TileLayer && !layer._url.includes('cartodb.dark')) {
                map.removeLayer(layer);
            }
        });
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(map);
    } else {
        map.eachLayer(function (layer) {
            if (layer instanceof L.TileLayer && layer._url.includes('cartodb.dark')) {
                map.removeLayer(layer);
            }
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
}
// Chame a função para alterar o tema do mapa
changeMapTheme();
