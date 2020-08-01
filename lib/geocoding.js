const Nominatim = require('nominatim-geocoder')
const axios = require('axios')
const geocoder = new Nominatim()

const fetchAddressViaCepAPI = async (cep) => {
    
    const URL = `https://viacep.com.br/ws/${cep}/json`
    const response = await axios.get(URL)
    const {data} = response

    return data

}

const fetchAddressGoogleMapsGeocoding = async (cep) => {

    const URL = `https://maps.google.com/maps/api/geocode/json?address=${cep}&sensor=false&key=${process.env.GOOGLE_MAPS_GEOCODING_API_KEY}`
    const response = await axios.get(URL)
    const {data} = response

    return data

}

const fetchLatLong = async (cep) => {

    const address = await fetchAddressViaCepAPI(cep)

    console.log('address', address)

    const {logradouro, bairro, localidade} = address
    const fullAddress = `${logradouro} ${bairro} ${localidade}`

    const resultGeocoderNomination = await geocoder.search({q: fullAddress})

    console.log('fullAddress', fullAddress)
    console.log('result', resultGeocoderNomination)

    if(resultGeocoderNomination.length == 0){
        const resultGoogleMapsGeocoding = await fetchAddressGoogleMapsGeocoding(cep)
        console.log('resultGoogleMapsGeocoding', resultGoogleMapsGeocoding)

        const {location} = resultGoogleMapsGeocoding.results[0].geometry
        const {lat: latitude, lng: longitude} = resultGoogleMapsGeocoding.results[0].geometry.location
        // console.log(latitude, longitude)
        // console.log('location GoogleMapsGeocoding', location)
        return {latitude, longitude, raw: `${latitude}, ${longitude}`}
        
    }
    else{
        
        const {lat: latitude, lon: longitude} = resultGeocoderNomination[0]
        return {latitude, longitude, raw: `${latitude}, ${longitude}`}

    }

}

module.exports = {
    fetchAddressViaCepAPI,
    fetchLatLong
}







