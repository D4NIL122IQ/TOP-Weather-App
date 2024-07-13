import './general.css'
import imgFind from './assets/find.png'
import imgHumidity from './assets/humidity.png'
import UV from './assets/uv.png'
import  minmaxImg from './assets/minmax.png'
import windImg from './assets/vent.png'
import sunriseImg from './assets/sunrise.png'
import sunsetImg from './assets/sunset.png'
import ressentieImg from './assets/ressentie.png'

const section = document.querySelector('section')
const title = document.querySelector('.loc')

const dateDuJour = document.querySelector('.date')
const heure = document.querySelector('.heure')
const temp = document.querySelector('#temp')
const imgMeteoInstant = document.querySelector('#imgInstant')
const descrip = document.querySelector('.description')
const humidityInstant = document.querySelector("#pourcHimid")
const uvActu = document.querySelector('#uv')
const ressentieActu = document.querySelector('#ressentieActu')
const ventActu = document.querySelector('#windkmh')
const actue = document.querySelector('.actuA')
const sunsetTime = document.querySelector('#sunsettime')
const sunriseTime = document.querySelector('#sunrisetime')
const minmaxTexte = document.querySelector('.minmaxTemp')

const CardContainer = document.querySelector('.displayCard')


document.querySelector('#rechercher').src = imgFind
document.querySelector('#humdityImg').src = imgHumidity
document.querySelector('#ressentieImg').src = ressentieImg
document.querySelector('#UVimg').src = UV
document.querySelector('#windImg').src = windImg
document.querySelector('#sunriseImg').src = sunriseImg
document.querySelector('#sunsetImg').src = sunsetImg
document.querySelector('#minmaxImg').src = minmaxImg

let heureactuel = new Date().getHours()

if((heureactuel> 5)  && (heureactuel<8)){
    section.className = 'debutJ'
}else if( (heureactuel > 8) && (heureactuel < 18)) {
    section.className = 'jour'
}else if((heureactuel >18) && (heureactuel< 20)){
    section.className = 'finJ'
}else{
    section.className = 'nuit'
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        getTempInstant(String(latitude) +','+String(longitude))

      },
      function(error) {
        getTempInstant('bejaia')

      }
    );
  } else {
    console.log("La géolocalisation n'est pas supportée par ce navigateur.");
}
  
async function getTempInstant(villeName){
    let URLgetTodayMeteo = `https://api.weatherapi.com/v1/current.json?key=14195a369dfb44a8bc803821240707&lang=fr&q=${villeName}`

    
    const rep = await fetch(URLgetTodayMeteo)

    rep.json().then(function(rep){
        title.textContent = rep.location.name + ', ' + rep.location.region + ', '+ rep.location.country

        dateDuJour.textContent = rep.location.localtime.slice(0, 10)
        heure.textContent =  heureactuel +':'+ new Date().getMinutes()
        actue.textContent += rep.current.last_updated.slice(-5)
        imgMeteoInstant.src = rep.current.condition.icon
        temp.textContent = rep.current.temp_c + '°C'
        imgMeteoInstant.alt =  descrip.textContent = rep.current.condition.text

        humidityInstant.textContent = rep.current.humidity +'%'
        ressentieActu.textContent = rep.current.feelslike_c + '°C'
        ventActu.textContent = rep.current.wind_kph + ' Km/h'
        uvActu.textContent = rep.current.uv
    })
    getSunTime(villeName)
    getMinMaxTempToday(villeName)
}

async function getSunTime(villeName) {
    let URLgetSun = `https://api.weatherapi.com/v1/astronomy.json?key=14195a369dfb44a8bc803821240707&lang=fr&q=${villeName}`

    const rep = await fetch(URLgetSun)

    rep.json().then(function(rep){
        sunriseTime.textContent = rep.astronomy.astro.sunrise
        sunsetTime.textContent = rep.astronomy.astro.sunset
    })

async function getMinMaxTempToday(villeName){
    let URLforcast = `https://api.weatherapi.com/v1/forecast.json?key=14195a369dfb44a8bc803821240707&q=${villeName}&day=1`
    const rep = await fetch (URLforcast)

    rep.json().then(function(rep){
        minmaxTexte.textContent = rep.forecast.forecastday[0].day.mintemp_c + '°C - ' + rep.forecast.forecastday[0].day.maxtemp_c + '°C'
    })
}

async function getTempFor4Days (villeName){
    let URL = `https://api.weatherapi.com/v1/forecast.json?key=14195a369dfb44a8bc803821240707&lang=fr&q=${villeName}&day=4`

    const rep = await fetch(URL)
    rep.json().then()
}

document.querySelector("img").addEventListener('click' , ()=>{
    getTempInstant(document.querySelector('#ville').value)

   
})

