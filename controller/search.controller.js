const User = require("../models/users.model");

function getcoordinatesfrombackend(item) {
  // console.log("item on f", item)

  return new Promise((resolve, reject) => {
    // Remove special characters from the address
    // item.address = item.address.replace(/ü/gi, "ue");
    // item.address = item.address.replace(/ö/gi, "oe");
    // item.address = item.address.replace(/ä/gi, "ae");
    // item.address = item.address.replace(/ß/gi, "ss");

    const AddressName = item.adress;
    // console.log('AddressName', AddressName)
    const geokey = "AIzaSyCsqLEJF_B5eGsLV6aaT3J1wxov9v0Qm04"; // Replace with your actual API key
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

        // console.log("response", response.data)

        return response.data;
      })
      .then((data) => {
        const location = data.results[0].geometry.location;
        const result = { lat: location.lat, lng: location.lng };

        // console.log("JSON.stringify(result)", JSON.stringify(result))
        return JSON.stringify(result);
      })
      .then((json) => {
        const resultObj = JSON.parse(json);
        item.lat = parseFloat(resultObj.lat.toString());
        item.lon = parseFloat(resultObj.lng.toString());
        // console.log("resolve ",)
        resolve(item);
      })
      .catch((err) => {
        item.lat = err;
        item.lon = err;
        // console.log("reject",)
        reject(item);
      });
  });
}

// const data = {
//   address: "dhaka",
//   lat: "23.804093",
//   lon: "90.4152376",
// };

function preparecoordinates() {
  return new Promise((resolve, reject) => {
    let lat = "";
    let lon = "";
    let adress = "usa";
    let item = { adress, lat, lon };
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

const distanceCal = async (req, res) => {
  try {
    preparecoordinates((city = "usa"))
      .then((item) => {
        // console.log("item", item)
        return getcoordinatesfrombackend(item);
      })
      .then((result) => {
        const ownerAddress = { adress: "usa", lat: 37.0902, lon: 95.7129 };
        // console.log(result);
        var Konst = Math.PI / 180;
        const calDistance = distanceInKmBetweenEarthCoordinates(
          ownerAddress.lat,
          ownerAddress.lon,
          result.lat,
          result.lon,
          Konst
        );

        console.log("distance", calDistance);
      });

    res.status(200).send("Successfully Done");
  } catch (error) {
    res.status(500).send(error);
  }
};

const searchChildCarer = async (req, res) => {
  const { distance, gender } = req.query;
  const offerProvide = req.body.offerProvide || [];

  const filtering = [{ $match: { role: "childcarer" } }];
  if (distance) {
    filtering.push({ $match: { distance: { $lte: Number(distance) } } });
  }
  if (gender) {
    filtering.push({ $match: { gender: gender } });
  }
  if (offerProvide.length > 0) {
    filtering.push({
      $match: {
        offerProvide: {
          $elemMatch: {
            $in: offerProvide,
          },
        },
      },
    });
  }

  try {
    const filteredUser = await User.aggregate(filtering);
    res.send(filteredUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { searchChildCarer, distanceCal };
