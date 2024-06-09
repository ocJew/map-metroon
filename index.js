/* Global states */
let levelSelecionado = "0";
let campusSelecionado = 0; // 0 = mucabinho 1= famed 2 = nenhum
let zoomAtual = 0;

let mapOptions = {
    zoomControl:false,
    attributionControl: true,
    minZoom:14,
    maxZoom: 24,
    maxBounds: [
        [-3.67694, -40.37051],
        [-3.70407, -40.32205]
    ],
    zoomSnap: 0.5
}
const map = L.map('map', mapOptions)
map.setView([-3.6932203,-40.3543455], 18);

/* Adiciona a escala */
const scale = L.control.scale({
    metric: true,
    maxWidth: 100,
    imperial: false,
    position: "topright"
}).addTo(map);

function styleMap(feature){

    let opcao = {

    }
    opcao.fillOpacity = 0;
    opcao.color = '#808080';
    opcao.weight = 2;
    
    if(feature.properties.indoor === 'room'){
        opcao.fill = true
        opcao.fillColor = '#FEFEE2'
        opcao.fillOpacity = 1;
        opcao.stroke = true;
        opcao.weight = 2;
        opcao.color = '#808080';
    }
    if(feature.properties.room !== undefined){
        opcao.fillColor = "#D4EDFF";
    }
    if(feature.properties.indoor !== "room"){
        opcao.fillOpacity = 1;
        opcao.weight = 1;
        opcao.fillColor = "#FDFCFA";
    }
    if(feature.properties.stairs === "yes"){
        opcao.weight = 10;
        opcao.dashArray = "4 10";
        opcao.lineCap = "miter";
    }
    if(feature.properties.indoor === "wall"){
        opcao.fillColor = "#F2EBE3";
        opcao.weight = 3;
    }
    if(feature.properties.amenity !== undefined || feature.properties.leisure !== undefined){
        opcao.fillColor = "#D4EDFF";
    }
    if(feature.properties.indoor === "corridor"){
        opcao.fillColor = "#FDFCFA";
    }
    
    
    return opcao;
}

/* Funcao que filtra as informações a ser exibida */
function filtrar(feature){
    return feature.properties.level === levelSelecionado  && feature.geometry.type !== "Point" && feature.properties.indoor !== undefined;
}

/* Adiciona as informações do campus mucabinho no mapa */
const geo = L.geoJSON(blocoEngenharia, {
    style: styleMap,
    filter: filtrar,
    interactive: false
}).addTo(map);

/* Adiciona as informações da famed no mapa */
const famedGeojson = L.geoJson(famed, {
    style: styleMap,
    filter: filtrar,
    interactive: false
}).addTo(map);



let iconesize = [20, 28];
const icones = {
    cadeirante: [ 
        L.icon({ iconUrl: "icons/2-cad.png", iconSize: iconesize }),
        L.icon({ iconUrl: "icons/1-cad.png", iconSize: iconesize }),
        L.icon({ iconUrl: "icons/0-cad.png", iconSize: iconesize })
    ],
    mobilidade: [
        L.icon({ iconUrl: "icons/2-mobred.png", iconSize: iconesize }),
        L.icon({ iconUrl: "icons/1-mobred.png", iconSize: iconesize }),
        L.icon({ iconUrl: "icons/0-mobred.png", iconSize: iconesize }),
    ],
    obeso: [
        L.icon({ iconUrl: "icons/2-obeso.png", iconSize: iconesize }),
        L.icon({ iconUrl: "icons/1-obeso.png", iconSize: iconesize }),
        L.icon({ iconUrl: "icons/0-obeso.png", iconSize: iconesize }),
    ],
    visual: [
        L.icon({ iconUrl: "icons/2-visual.png", iconSize: iconesize }),
        L.icon({ iconUrl: "icons/1-visual.png", iconSize: iconesize }),
        L.icon({ iconUrl: "icons/0-visual.png", iconSize: iconesize }),
    ]
}

const iconpos = [
    generateIconPos(L.latLng({lat: -3.693203027814058, lng: -40.354491004086256}), "1", "Corredores", icones.cadeirante[2], [0, 0, 0, 2, 1, 1, 0]),
    generateIconPos(L.latLng({lat: -3.693339762211707, lng: -40.3544853142617}), "0", "Portas das Salas", icones.cadeirante[0], [0, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.6932063437621787, lng: -40.3540377147305}), "0", "Banheiro", icones.cadeirante[2], [0, 0, 0, 0, 0, 0, 0]),
    generateIconPos(L.latLng({lat: -3.6931183508574192, lng: -40.35409882664681}), "0", "Auditório", icones.visual[2], [0, 1, 1, 2, 1, 1, 1]),
    generateIconPos(L.latLng({lat: -3.693327451999401, lng: -40.35408702654328}), "0", "Merendeiro", icones.cadeirante[2], [0, 0, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.69324182456486, lng: -40.35465885391043}), "0", "Elevador", icones.visual[2], [0, 1, 1, 1, 1, 1, 1]),
    generateIconPos(L.latLng({lat: -3.693159958191622, lng: -40.354243496718375}), "0", "Banheiros", icones.visual[2], [0, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.693228575507798, lng: -40.35456070443696}), "1", "Gabinetes", icones.cadeirante[2], [0, 0, 0, 1, 0, 1, 0]),
    generateIconPos(L.latLng({lat: -3.693228575507798, lng: -40.35456070443696}), "0", "Foyer", icones.cadeirante[0], [2, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.6927378812714955, lng: -40.35474799449504}), "0", "Estacionamento", icones.visual[2], [0, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.693278239311699, lng: -40.3540612757206}), "-1", "Corredores da biblioteca", icones.visual[2], [0, 0, 0, 1, 1, 1, 1]),
    generateIconPos(L.latLng({lat: -3.693303786947998, lng: -40.354008317303666}), "-1", "Balcao da biblioteca", icones.cadeirante[0], [2, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.693342187876938, lng: -40.354042164981365}), "-1", "Rampa", icones.visual[2], [0, 1, 1, 1, 1, 1, 1]),
    /// famed 
    generateIconPos(L.latLng({lat: -3.6937765346989315, lng: -40.354579670518795}), "0", "Copa", icones.visual[2], [0, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.6938214796861875, lng: -40.35473424408572}), "0", "Banheiros", icones.visual[2], [0, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.6938467327515214, lng: -40.3545105457306}), "0", "Laboratório de informática", icones.visual[2], [0, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.693676621779604, lng: -40.35443315753666}), "0", "Estacionamento", icones.cadeirante[0], [2, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.6937052040350187, lng: -40.354133024811745}), "0", "Recepção", icones.visual[2], [0, 1, 1, 1, 1, 1, 1]),
    generateIconPos(L.latLng({lat: -3.6938842124520974, lng: -40.35431809723378}), "0", "Sala de Radiografia", icones.visual[2], [0, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.694209458796248, lng: -40.354255350519516}), "0", "Almoxarifado", icones.visual[2], [0, 1, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.694208386745116, lng: -40.35441130399705}), "0", "Clínica", icones.visual[2], [0, 2, 2, 2, 2, 2, 2]),
    generateIconPos(L.latLng({lat: -3.694168230028304, lng: -40.35458430647851}), "0", "Sala de Lavagem", icones.visual[2], [0, 1, 2, 2, 2, 2, 2]),
]

function generateIconPos(pos, level, local, icone, acess){
    textos = ["Pouco Acessível", "Meio Acessível", "Acessível"];
    cores = ["red", "#f78f07", "green"];
    return {
        pos: pos,
        level: level,
        icone: icone,
        popup: L.popup(pos, {
            content: `
                <div>
                    <h3>${local}</h3>
                    <h3>Estado de acessibilidade:</h3>
                    <p style="margin:0">VISUAL: <span style="color:${cores[acess[0]]}">${textos[acess[0]]}</span></p>
                    <p style="margin:0">CADEIRANTE: <span style="color:${cores[acess[1]]}">${textos[acess[1]]}</span></p>
                    <p style="margin:0">MOBILIDADE: <span style="color:${cores[acess[2]]}">${textos[acess[2]]}</span></p>
                    <p style="margin:0">GESTANTE: <span style="color:${cores[acess[3]]}">${textos[acess[3]]}</span></p>
                    <p style="margin:0">OBESO: <span style="color:${cores[acess[4]]}">${textos[acess[4]]}</span></p>
                    <p style="margin:0">BENGALA: <span style="color:${cores[acess[5]]}">${textos[acess[5]]}</span></p>
                    <p style="margin:0">COM MULETA: <span style="color:${cores[acess[6]]}">${textos[acess[6]]}</span></p>
                </div>
            `
        })
    }
}
let iconesandares = {}

function addIconsInLayerGroup(){
    if(iconesandares[levelSelecionado] == null){
        iconesandares[levelSelecionado] = L.layerGroup([]);
        for(let icone = 0; icone < iconpos.length; icone++){
            if(iconpos[icone].level != levelSelecionado){
                continue;
            }
            let marker = L.marker(iconpos[icone].pos, {
                icon: iconpos[icone].icone
            })
            if(iconpos[icone].popup!=null){
                marker.bindPopup(iconpos[icone].popup)
            }
            iconesandares[levelSelecionado].addLayer(marker);
        }
    }
    levels = Object.keys(iconesandares);
    for(level of levels){
        if(levelSelecionado === level){
            iconesandares[level].addTo(map);
        }
        else{
            iconesandares[level].remove();
        }
    }
}

addIconsInLayerGroup();

//quando botao de mudar o level é clicado esse funcao e chamada
const fn = ()=>{
    map.removeControl(myL);
    map.addControl(myL);
    geo.clearLayers();
    geo.addData(blocoEngenharia);
    famedGeojson.clearLayers();
    famedGeojson.addData(famed);
    for(nivel of niveisMucab){
        nomeLocaisMucab[nivel].remove();
    }
    if(map.getZoom() > 21){
        nomeLocaisMucab[levelSelecionado].addTo(map);
    }
    
    addIconsInLayerGroup();
    updateNomes(zoomAtual);
}

/* Extende a classe controle para criar um controle de andar */
const LayerButton = L.Control.extend({
    onAdd: function(){
        let buttonContainer = L.DomUtil.create("div", "level-buttons");
        let levels;
        if(campusSelecionado == 0){
            levels = ObterNiveis(blocoEngenharia.features);
        }
        else{
            levels = ObterNiveis(famed.features);
        }
        for(let i = 0; i < levels.length; i++){
            let bt = L.DomUtil.create("div", "level-buttons__button", buttonContainer);
            L.DomEvent.on(bt, "click", ()=>{
                levelSelecionado = levels[i]
                fn();
            })
            
            let p = L.DomUtil.create("p", "level-buttons__text", bt);
            if(levels[i] === levelSelecionado){
                L.DomUtil.addClass(bt, "level-buttons__button--selected")
            }
            p.innerText = levels[i];
        }
        return buttonContainer;
    }
});

/* Cria uma instancia da nova classe de controle e adiciona no mapa */
const myL = new LayerButton({
    position: "bottomright"
});
map.addControl(myL);

const niveisMucab = ObterNiveis(blocoEngenharia.features);
const niveisFamed = ObterNiveis(famed.features);
const nomeLocaisMucab = {};
const nomeLocaisFamed = {};

/* Cria os layers groups para cada campus */
for(let i = 0; i < niveisMucab.length; i++){
    nomeLocaisMucab[niveisMucab[i]] = L.layerGroup([], {
        interactive: false
    });
}
for(let i = 0; i < niveisFamed.length; i++){
    nomeLocaisFamed[niveisFamed[i]] = L.layerGroup([], {
        interactive: false
    });
}

/* Cria os marcadores dos nomes dos locais */
for(let feature of blocoEngenharia.features){
    if(feature.properties.name !== undefined && feature.properties.indoor === "room" && feature.geometry.type === "LineString" && feature.properties.level !== undefined){
        let c = CentroGeometrico(feature.geometry.coordinates);
        let icon = L.divIcon({
            html: `<p>${feature.properties.name}</p>`,
            className: "names",
            iconSize: L.point(100, 100),
            iconAnchor: L.point(50,50)
        });
        let mrr = L.marker([c.lng, c.lat], {
            icon:icon,
            interactive:false,
            keyboard: false
        });
        nomeLocaisMucab[feature.properties.level].addLayer(mrr);
    }
}
for(let feature of famed.features){
    if(feature.properties.name !== undefined && feature.properties.indoor === "room" && feature.geometry.type === "LineString" && feature.properties.level !== undefined){
        let c = CentroGeometrico(feature.geometry.coordinates);
        let icon = L.divIcon({
            html: `<p>${feature.properties.name}</p>`,
            className: "names",
            iconSize: L.point(100, 100),
            iconAnchor: L.point(50,50)
        });
        let mrr = L.marker([c.lng, c.lat], {
            icon:icon,
            interactive:false,
            keyboard: false
        });
        nomeLocaisFamed[feature.properties.level].addLayer(mrr);
    }
}


map.on("click", function(evento){
    console.log(evento.latlng)
})

function updateNomes(zoom){
    if(zoom < 21){
        if(campusSelecionado == 0){
            for(nivel of niveisMucab){
                nomeLocaisMucab[nivel].remove();
            }
        }

        if(campusSelecionado == 1){
            for(nivel of niveisFamed){
                nomeLocaisFamed[nivel].remove();
            }
        }

    }
    else{

        if(campusSelecionado == 0){
            for(nivel of niveisMucab){
                nomeLocaisMucab[nivel].remove();
            }
            nomeLocaisMucab[levelSelecionado].addTo(map);
        }

        if(campusSelecionado == 1){
            for(nivel of niveisFamed){
                nomeLocaisFamed[nivel].remove();
            }
            nomeLocaisFamed[levelSelecionado].addTo(map);
        }

    }
    
}
map.on("zoom", function(evento){
    let zoom = evento.target._zoom;
    zoomAtual = zoom;
    updateNomes(zoom);
    if(zoom < 17){
        famedGeojson.remove();
        geo.remove();
    }
    else{
        famedGeojson.addTo(map);
        geo.addTo(map);
    }
});

/* Funcao chamada quando o mapa é movido */
/*
let removedLayers = [];
function MOVEEND(evento){
    let limiteAtual = map.getBounds();
    let layers = nomeLocaisMucab[levelSelecionado].getLayers();
    for(l of removedLayers){
        nomeLocaisMucab[levelSelecionado].addLayer(l);
    }
    removedLayers = [];
    for(l of layers){
        if(!limiteAtual.contains(l.getLatLng())){
            removedLayers.push(l);
            l.remove(layers);
        } 
    }
}

map.on("moveend", MOVEEND);
*/

const centroMucambinho = L.latLng([-3.6934337,-40.354892]);
const limitesMucabinho = centroMucambinho.toBounds(210);
const centroFamed = L.latLng([-3.681489,-40.336803]);
const limitesFamed = centroFamed.toBounds(150);

map.on("move", function(evento){
    if(!map.getBounds().intersects(limitesMucabinho)){
        geo.remove();
    }
    else{
        geo.addTo(map);
    }
    if(!map.getBounds().intersects(limitesFamed)){
        famedGeojson.remove();
    }
    else{
        famedGeojson.addTo(map);
    }
})

map.on("moveend", function(evento){
    let zoom = evento.target._zoom;
    updateNomes(zoom);
    if(campusSelecionado != 0){
        if(map.getBounds().intersects(limitesMucabinho)){
            campusSelecionado = 0;
            levelSelecionado = "0";
            fn();
        }
    }

    if(campusSelecionado != 1){
        if(map.getBounds().intersects(limitesFamed)){
            campusSelecionado = 1;
            levelSelecionado = "0";
            fn();
        }
    }

});


/* Tile Layers */

const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';
var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: cartodbAttribution,
    maxZoom:24,
    maxNativeZoom: 24,
    interactive:false
}).addTo(map);

const stamenLayer = L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",{
    attribution: "STAMEN",
    maxZoom:24,
    maxNativeZoom: 17,
    interactive:false
});
const openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    interactive:false,
    maxZoom:24,
    maxNativeZoom: 18,
});

L.control.layers({
    "Stamem": stamenLayer,
    "CartoDB": positron,
    "OpenStreetMap": openStreetMap
}).addTo(map);

/* Botoes campus */
document.querySelector(".controls__button--mucab").onclick = ()=>{
    map.flyTo([-3.693466, -40.354933], 17.97);
    document.querySelector(".controls__button--mucab").classList.add("controls__button--selected");
    document.querySelector(".controls__button--famed").classList.remove("controls__button--selected");
}
document.querySelector(".controls__button--famed").onclick = ()=>{
    map.flyTo([-3.68137, -40.336832], 18.29);
    document.querySelector(".controls__button--famed").classList.add("controls__button--selected");
    document.querySelector(".controls__button--mucab").classList.remove("controls__button--selected");
}
