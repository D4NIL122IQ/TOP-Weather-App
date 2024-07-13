import './general.css'
import imgFind from './assets/find.png'
import imgHumidity from './assets/humidity.png'
import UV from './assets/uv.png'
import  minmaxImg from './assets/minmax.png'
import windImg from './assets/vent.png'
import sunriseImg from './assets/sunrise.png'
import sunsetImg from './assets/sunset.png'
import ressentieImg from './assets/ressentie.png'
import sunsetrise from './assets/sunsetndrise.png'
import avgTemp from './assets/avgtemp.png'

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

const CardContainer = document.querySelector('.displaycard')


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
}
async function getMinMaxTempToday(villeName){
    let URLforcast = `https://api.weatherapi.com/v1/forecast.json?key=14195a369dfb44a8bc803821240707&q=${villeName}&day=1`
    const rep = await fetch (URLforcast)

    rep.json().then(function(rep){
        minmaxTexte.textContent = rep.forecast.forecastday[0].day.mintemp_c + '°C - ' + rep.forecast.forecastday[0].day.maxtemp_c + '°C'
    })
}

function setupForecastMeteo(themeteo){
    let div = document.createElement('div')
    let date = document.createElement('h4')
    let minmaxText = document.createElement('h4')
    let avgTempe = document.createElement('h4')
    let avgHumidity = document.createElement('h4')
    let sunrise_sunsetTime = document.createElement('h4')

    let t2 = document.createElement('h4')
    let t3 = document.createElement('h4')
    let div1 = document.createElement('div')
    let div2 = document.createElement('div')
    let div3 = document.createElement('div')
    let div4 = document.createElement('div')
    let img1  = document.createElement('img')
    let img2 = document.createElement('img')
    let img3 = document.createElement('img')
    let img4 = document.createElement('img')

    div1.className = 'infoDisplay'
    div2.className = 'infoDisplay'
    div3.className = 'infoDisplay'
    div4.className = 'infoDisplay'

    div.className = 'card'
    date.textContent = themeteo.date
    img1.src = minmaxImg
    img1.width = 40
    minmaxText.textContent = `${themeteo.day.mintemp_c}°C - ${themeteo.day.maxtemp_c}°C`
    div1.appendChild(img1)
    div1.appendChild(minmaxText)

    img2.width = 40
    img2.src = imgHumidity
    t2.textContent = 'Humidité moyenne : '
    avgHumidity.textContent = `${themeteo.day.avghumidity}%`
    div2.appendChild(img2)
    div2.appendChild(t2)
    div2.appendChild(avgHumidity)

    img3.width = 40
    img3.src = avgTemp
    t3.textContent = 'Temperature moyenne :'
    avgTempe.textContent = `${themeteo.day.avgtemp_c}°C`
    div3.appendChild(img3)
    div3.appendChild(t3)
    div3.appendChild(avgTempe)

    img4.src = sunsetrise
    img4.width = 40
    sunrise_sunsetTime.textContent = `${themeteo.astro.sunrise} - ${themeteo.astro.sunset}`
    div4.appendChild(img4)
    div4.appendChild(sunrise_sunsetTime)

    div.appendChild(date)
    div.appendChild(div1)
    div.appendChild(div3)
    div.appendChild(div2)
    div.appendChild(div4)


    CardContainer.appendChild(div)
}

async function getTempFor4Days (villeName){
    let URL = `https://api.weatherapi.com/v1/forecast.json?key=14195a369dfb44a8bc803821240707&lang=fr&q=${villeName}&days=5`

    const rep = await fetch(URL)
    rep.json().then(function(rep){
        console.log(rep)
       setupForecastMeteo(rep.forecast.forecastday[1])
       setupForecastMeteo(rep.forecast.forecastday[2])
       setupForecastMeteo(rep.forecast.forecastday[3])
       setupForecastMeteo(rep.forecast.forecastday[4])
    })
}

document.querySelector("img").addEventListener('click' , ()=>{
    getTempInstant(document.querySelector('#ville').value)

   
})

getTempFor4Days('bejaia')