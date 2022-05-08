import geolocator from 'geolocator'

geolocator.config({
  language: 'en',
})

const stopEl = document.getElementById('stop')

const harper = {
  longitude: 41.788145,
  latitude: -87.599601,
}

const kent = {
  longitude: 41.790029,
  latitude: -87.599659,
}

const HARPER = 'Harper'
const KENT = 'Kent/Ryerson'

let currentStop = null
let timeReached = null

window.onload = function () {
  const options = {
    enableHighAccuracy: true,
    timeout: 50000000,
    maximumWait: 10000,     // max wait time for desired accuracy
    maximumAge: 0,          // disable cache
    desiredAccuracy: 1,    // meters
    fallbackToIP: true,     // fallback to IP if Geolocation fails or rejected
  }

  geolocator.watch(options, function (err, location) {
    if (err) return console.log(err)

    console.log(location)
    const newStop = calcStop(location.coords)
    if (newStop && newStop !== currentStop) {
      if (!timeReached || Date.now() - timeReached > 60 * 1000) {
        timeReached = Date.now()
        currentStop = newStop
        stopEl.innerText = newStop === KENT ? HARPER : KENT
      }
    }
  })
}

function calcStop(coords) {
  if (coords.longitude > kent.longitude) {
    return KENT
  } else if (coords.longitude < harper.longitude) {
    return HARPER
  } else {
    const distanceToKent  = geolocator.calcDistance({
      from: coords,
      to: kent,
      formula: geolocator.DistanceFormula.HAVERSINE,
      unitSystem: geolocator.UnitSystem.METRIC,
    })
    if (distanceToKent / 1000 <= 5) {
      return KENT
    }
    const distanceToHarper = geolocator.calcDistance({
      from: coords,
      to: harper,
      formula: geolocator.DistanceFormula.HAVERSINE,
      unitSystem: geolocator.UnitSystem.METRIC,
    })
    if (distanceToHarper / 1000 <= 5) {
      return HARPER
    }
  }
  return null
}
