// const places = require('../places.json')
// const places = require('./places-v2.json')

// Converte Graus para Radianos
const radians = function (degree) {

    let rad = degree * Math.PI / 180;
  
    return rad;
}

// Calcula a distancia entre 2 pontos considerando a curvatura da Terra

const haversine = (lat1, lon1, lat2, lon2) => {
  
    let dlat, dlon, a, c, R;
    
    R = 6372.8; // km
    dlat = radians(lat2 - lat1);
    dlon = radians(lon2 - lon1);
    lat1 = radians(lat1);
    lat2 = radians(lat2);
    a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.sin(dlon / 2) * Math.sin(dlon / 2) * Math.cos(lat1) * Math.cos(lat2)
    c = 2 * Math.asin(Math.sqrt(a));

    return R * c;
}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

function closestLocation(targetLocation, locationData, sliceIndex) {

    let prevLocation = {
        cnpj: null,
        latitude: null,
        longitude: null
    }
    const locations = []

    function vectorDistance(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    }

    function locationDistance(location1, location2) {

        const dx = location1.latitude - location2.latitude;
        const dy = location1.longitude - location2.longitude;

        // Calcula a distancia do vetor
        return vectorDistance(dx, dy);
    }

    const locationsFound = locationData.reduce(function(prev, curr) {

        let prevDistance = locationDistance(targetLocation , prev)
        let currDistance = locationDistance(targetLocation , curr)

        // console.log('prevDistance: ' + prevDistance + '| currDistance: ' + currDistance)
        // console.log('prev', prev)
        // console.log('TESTE', prevLocation.cnpj, prev.cnpj)
        // console.log('=====================================')

        
        if (prevDistance < currDistance) {
            if(prevLocation.cnpj != prev.cnpj){
                console.log('PUSH PREV #####')
                prevLocation = prev
                locations.push(prev)
            }
            return prev
        }
        else{
            if(prevLocation.cnpj != curr.cnpj){
                console.log('PUSH CURR ####')
                prevLocation = curr
                locations.push(curr)
            }
            return curr
        }
    });


    if(sliceIndex){
        if(Math.abs(sliceIndex) <= locations.length){
            return locations
        }
        else{
            return locations.slice(sliceIndex)
        }
    }
    else{
        return locations
    }
}

const latitude = -23.325229
const longitude = -46.938054

const targetLocation = {
    latitude,
    longitude
}

const closestLocationV2 = function(entity, targetLocation, places, sliceIndex){

    // Filtra se place é PF/PJ
    const placesEntity = places.filter(place => {

        if(place.publicoAlvo == undefined && entity == 'pf'){
            return place
        }
        else if(place.publicoAlvo == entity){
            return place
        }
    })

    // console.log('placesEntity', placesEntity)

    const placeDistances = placesEntity.map(place => {
        const distance = haversine(targetLocation.latitude, targetLocation.longitude, place.latitude, place.longitude);
        return {
            ...place,
            distance
        }
    }).sort((a, b) => a.distance - b.distance)

    if(sliceIndex){
        return placeDistances.slice(0, sliceIndex)
    }

    return placeDistances
    
}

// const closest = closestLocationV2(targetLocation, places, 3);

// console.log('Locais Proximos => ', closest)

module.exports = closestLocationV2

