function ObterNiveis(geoJsonFeatures){
    let niveis = [];
    for(let feature of geoJsonFeatures){
        let level = feature.properties.level;
        if(!niveis.includes(level) && level!== undefined){
            niveis.push(level);
        }
    }
    return niveis;
}
function CentroGeometrico(coords){
    let coordenadaInicial = L.latLng(coords[0]);
    let distancia = 0;
    let coordenadaMaisLonge;
    for(let i = 1; i < coords.length; i++){
        let tempDist = coordenadaInicial.distanceTo(coords[i])
        if(distancia < tempDist){
            coordenadaMaisLonge = L.latLng(coords[i]);
            distancia = tempDist;
        }
    }
    let center = L.latLngBounds(coordenadaInicial, coordenadaMaisLonge).getCenter();
    return center;
}