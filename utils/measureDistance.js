const { default: axios } = require("axios");

function getcoordinatesfrombackend(item) {
  return new Promise((resolve, reject) => {
    const AddressName = item.address;
    const geokey = "AIzaSyCsqLEJF_B5eGsLV6aaT3J1wxov9v0Qm04";
    const geocode1 =
      "https://maps.googleapis.com/maps/api/geocode/json?address=";
    const geocode2 = "&key=";

    const geoURL =
      geocode1 + encodeURIComponent(AddressName) + geocode2 + geokey;

    axios
      .get(geoURL)
      .then((response) => {
        const statusCode = response.status;
        const statusText = response.statusText;

        return response.data;
      })
      .then((data) => {
        const location = data.results[0].geometry.location;
        const result = { lat: location.lat, lng: location.lng };

        return JSON.stringify(result);
      })
      .then((json) => {
        const resultObj = JSON.parse(json);
        item.lat = parseFloat(resultObj.lat.toString());
        item.lon = parseFloat(resultObj.lng.toString());

        resolve(item);
      })
      .catch((err) => {
        item.lat = err;
        item.lon = err;

        reject(item);
      });
  });
}

function preparecoordinates(city) {
  return new Promise((resolve, reject) => {
    let lat = "";
    let lon = "";
    let address = city;
    let item = { address, lat, lon };
    resolve(item);
  });
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2, Konst) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2 - lat1, Konst);
  var dLon = degreesToRadians(lon2 - lon1, Konst);

  lat1 = degreesToRadians(lat1, Konst);
  lat2 = degreesToRadians(lat2, Konst);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function degreesToRadians(degrees, Konst) {
  return degrees * Konst;
}

const distanceCal = async (city, userAddress) => {
  let distance;
  try {
    await preparecoordinates(city)
      .then((item) => {
        return getcoordinatesfrombackend(item);
      })
      .then((result) => {
        const ownerAddress = userAddress;
        var Konst = Math.PI / 180;
        const calDistance = distanceInKmBetweenEarthCoordinates(
          ownerAddress.lat,
          ownerAddress.lon,
          result.lat,
          result.lon,
          Konst
        );
        distance = calDistance;
      });

    return distance;
  } catch (error) {
    return false;
  }
};

module.exports = {
  distanceCal,
};
